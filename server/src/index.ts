import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authOptional, requireAuth } from './middleware/auth.js';
import { auditMiddleware } from './middleware/audit.js';

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());
app.use(authOptional(process.env.JWT_SECRET || 'dev-secret'));
app.use(auditMiddleware(prisma));

// Multi-tenant org header key
const ORG_HEADER = 'x-org-id';

// Attach orgId (in real production validate + authorize)
app.use((req, _res, next) => {
  (req as any).orgId = req.header(ORG_HEADER) || null;
  next();
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Example: list expenses (read-only scaffold)
app.get('/api/expenses', async (req, res) => {
  const orgId = (req as any).orgId;
  if (!orgId) return res.status(400).json({ error: 'Missing org header' });
  const expenses = await prisma.expense.findMany({ where: { orgId }, take: 100, orderBy: { createdAt: 'desc' } });
  res.json(expenses);
});

// Accounts
const accountSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(['asset','liability','equity','revenue','expense'])
});

app.get('/api/accounts', async (req, res) => {
  const orgId = (req as any).orgId; if (!orgId) return res.status(400).json({ error: 'Missing org header' });
  const accounts = await prisma.account.findMany({ where: { orgId, isActive: true }, orderBy: { code: 'asc' } });
  res.json(accounts);
});

app.post('/api/accounts', async (req, res) => {
  const orgId = (req as any).orgId; if (!orgId) return res.status(400).json({ error: 'Missing org header' });
  const parsed = accountSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json(parsed.error.format());
  try {
    const account = await prisma.account.create({ data: { id: crypto.randomUUID(), orgId, balance: 0, ...parsed.data } });
    res.status(201).json(account);
  } catch (e:any) {
    if (e.code === 'P2002') return res.status(409).json({ error: 'Duplicate code' });
    console.error(e); res.status(500).json({ error: 'Internal error' });
  }
});

// Deactivate account
app.post('/api/accounts/:id/deactivate', requireAuth(), async (req, res) => {
  const orgId = (req as any).orgId; if (!orgId) return res.status(400).json({ error: 'Missing org header' });
  const { id } = req.params;
  const account = await prisma.account.findFirst({ where: { id, orgId } });
  if (!account) return res.status(404).json({ error: 'Not found' });
  const updated = await prisma.account.update({ where: { id }, data: { isActive: false } });
  res.json(updated);
});

// Invoices
const invoiceSchema = z.object({
  number: z.string().min(1),
  subtotal: z.number().nonnegative(),
  tax: z.number().nonnegative().default(0),
  total: z.number().nonnegative(),
  status: z.enum(['draft','sent','paid','void']),
  issueDate: z.coerce.date(),
  dueDate: z.coerce.date().optional()
});

app.get('/api/invoices', async (req, res) => {
  const orgId = (req as any).orgId; if (!orgId) return res.status(400).json({ error: 'Missing org header' });
  const invoices = await prisma.invoice.findMany({ where: { orgId }, orderBy: { issueDate: 'desc' }, take: 100 });
  res.json(invoices);
});

app.post('/api/invoices', async (req, res) => {
  const orgId = (req as any).orgId; if (!orgId) return res.status(400).json({ error: 'Missing org header' });
  const parsed = invoiceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json(parsed.error.format());
  const data = parsed.data;
  if (Math.abs((data.subtotal + data.tax) - data.total) > 0.01) {
    return res.status(400).json({ error: 'Subtotal + tax must equal total' });
  }
  try {
    const invoice = await prisma.invoice.create({ data: { id: crypto.randomUUID(), orgId, createdBy: null, ...data } });
    res.status(201).json(invoice);
  } catch (e:any) {
    if (e.code === 'P2002') return res.status(409).json({ error: 'Duplicate number' });
    console.error(e); res.status(500).json({ error: 'Internal error' });
  }
});

// Update invoice status
app.post('/api/invoices/:id/status', requireAuth(), async (req, res) => {
  const orgId = (req as any).orgId; if (!orgId) return res.status(400).json({ error: 'Missing org header' });
  const { id } = req.params;
  const status = (req.body?.status || '').toString();
  if (!['draft','sent','paid','void'].includes(status)) return res.status(422).json({ error: 'Invalid status' });
  const invoice = await prisma.invoice.findFirst({ where: { id, orgId } });
  if (!invoice) return res.status(404).json({ error: 'Not found' });
  const updated = await prisma.invoice.update({ where: { id }, data: { status } });
  res.json(updated);
});

// Example: create journal entry (atomic)
const journalSchema = z.object({
  date: z.coerce.date(),
  ref: z.string().min(1),
  memo: z.string().optional(),
  lines: z.array(z.object({
    accountCode: z.string().min(1),
    debit: z.number().nonnegative().default(0),
    credit: z.number().nonnegative().default(0)
  })).min(2)
});

app.post('/api/accounting/journal', async (req, res) => {
  const orgId = (req as any).orgId;
  if (!orgId) return res.status(400).json({ error: 'Missing org header' });
  const parsed = journalSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json(parsed.error.format());
  const { date, ref, memo, lines } = parsed.data;

  const totalDebit = lines.reduce((s,l)=>s+l.debit,0);
  const totalCredit = lines.reduce((s,l)=>s+l.credit,0);
  if (totalDebit.toFixed(2) !== totalCredit.toFixed(2)) {
    return res.status(400).json({ error: 'Unbalanced journal', totalDebit, totalCredit });
  }

  try {
    const journal = await prisma.$transaction(async(tx: PrismaClient)=>{
      const j = await tx.ledgerJournal.create({ data: { id: crypto.randomUUID(), orgId, date, ref, memo } });
      await tx.ledgerLine.createMany({ data: lines.map(l => ({ journalId: j.id, accountCode: l.accountCode, debit: l.debit, credit: l.credit })) });
      return j;
    });
    res.status(201).json({ journal });
  } catch (e:any) {
    if (e.code === 'P2002') return res.status(409).json({ error: 'Duplicate ref' });
    console.error(e);
    res.status(500).json({ error: 'Internal error' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on :${port}`));
