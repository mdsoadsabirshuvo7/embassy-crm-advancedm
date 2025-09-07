import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthPayload {
  sub: string; // user id
  email?: string;
  orgId?: string; // optional default org
  roles?: string[];
  iat?: number;
  exp?: number;
}

const HEADER = 'authorization';

export function authOptional(secret: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const token = (req.headers[HEADER] || '').toString().replace(/^Bearer /i, '');
    if (!token) return next();
    try {
      const payload = jwt.verify(token, secret) as AuthPayload;
      (req as any).user = payload;
      if (!req.headers['x-org-id'] && payload.orgId) (req as any).orgId = payload.orgId; // fallback org
    } catch { /* ignore invalid tokens */ }
    next();
  };
}

export function requireAuth() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any).user) return res.status(401).json({ error: 'Unauthorized' });
    next();
  };
}
