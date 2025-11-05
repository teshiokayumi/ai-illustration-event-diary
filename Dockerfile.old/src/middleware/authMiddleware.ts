import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// ExpressのRequestインターフェースを拡張して、userプロパティを追加
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; email: string };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-default-secret') as { userId: string; email: string };
    req.user = decoded; // リクエストオブジェクトにユーザー情報を追加
    next(); // 次のミドルウェアまたはルートハンドラへ
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
