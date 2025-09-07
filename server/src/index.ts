import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

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
