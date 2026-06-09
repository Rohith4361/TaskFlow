/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const SECRET_SALT = 'tasknexus-auth-key-2026';

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authUtils = {
  // Generate a tamper-proof JWT-like token containing user ID
  generateToken(userId: string): string {
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
    const payload = `${userId}:${expiresAt}`;
    const signature = crypto.createHmac('sha256', SECRET_SALT).update(payload).digest('hex');
    return Buffer.from(`${payload}:${signature}`).toString('base64');
  },

  // Decode and verify a token, returning the userId if valid
  verifyToken(token: string): string | null {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const parts = decoded.split(':');
      if (parts.length !== 3) return null;

      const [userId, expiresAtStr, signature] = parts;
      const expiresAt = Number(expiresAtStr);

      if (Date.now() > expiresAt) {
        return null; // Expired
      }

      // Revalidate signature
      const expectedPayload = `${userId}:${expiresAt}`;
      const expectedSignature = crypto.createHmac('sha256', SECRET_SALT).update(expectedPayload).digest('hex');

      if (signature !== expectedSignature) {
        return null; // Tampered
      }

      return userId;
    } catch {
      return null;
    }
  }
};

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization header is missing or malformed' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const userId = authUtils.verifyToken(token);

  if (!userId) {
    res.status(401).json({ error: 'Token is invalid or expired' });
    return;
  }

  req.userId = userId;
  next();
}
