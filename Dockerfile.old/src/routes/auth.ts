import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' }); // ルートの.envを読み込む
import db from '../db';

const router = Router();

// ユーザー登録
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // メールアドレスの重複チェック
    const checkStmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const existingUser = checkStmt.get(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = `user_${Date.now()}`;
    const finalDisplayName = displayName || email.split('@')[0];

    const insertStmt = db.prepare(`
      INSERT INTO users (id, email, password_hash, display_name)
      VALUES (?, ?, ?, ?)
    `);
    insertStmt.run(id, email, passwordHash, finalDisplayName);

    const getStmt = db.prepare('SELECT id, email, display_name, created_at FROM users WHERE id = ?');
    const newUser = getStmt.get(id);

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// ログイン
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email) as any;

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // JWTを生成
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-default-secret',
      { expiresIn: '1h' } // トークンの有効期限
    );

    res.json({ 
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name
      }
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

export default router;
