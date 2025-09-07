import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

export function auditMiddleware(prisma: PrismaClient) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only log mutating endpoints
    if (!['POST','PUT','PATCH','DELETE'].includes(req.method)) return next();
    const orgId = (req as any).orgId;
    const user = (req as any).user;
    const start = Date.now();
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      const duration = Date.now() - start;
      prisma.auditLog.create({
        data: {
          orgId: orgId || 'unknown',
            userId: user?.sub || null,
            action: `${req.method} ${req.path}`,
            entity: inferEntity(req.path),
            entityId: (body && (body.id || body?.journal?.id || body?.invoice?.id)) || null,
            newData: safeBody(body),
            oldData: null
        }
      }).catch(()=>{});
      return originalJson(body);
    };
    next();
  };
}

function inferEntity(path: string): string | null {
  if (path.includes('journal')) return 'journal';
  if (path.includes('accounts')) return 'account';
  if (path.includes('invoices')) return 'invoice';
  if (path.includes('expenses')) return 'expense';
  return null;
}

function safeBody(body: any) {
  try { return JSON.parse(JSON.stringify(body)); } catch { return null; }
}
