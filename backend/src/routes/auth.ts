import { Router, Request, Response } from 'express';
import db from '../db';
import bcrypt from 'bcrypt';
import { User } from '../types';

const router = Router();
const usersCollection = db.collection('users');

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, displayName } = req.body;
    if (!email || !password || !displayName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const snapshot = await usersCollection.where('email', '==', email).get();
    if (!snapshot.empty) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const newUser: Omit<User, 'id'> = {
      email,
      displayName,
      passwordHash,
    };

    const docRef = await usersCollection.add(newUser);

    res.status(201).json({ id: docRef.id, email, displayName });
  } catch (e) {
    console.error('Error registering user:', e);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const snapshot = await usersCollection.where('email', '==', email).get();
    if (snapshot.empty) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data() as User;

    const ok = await bcrypt.compare(password, user.passwordHash!);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { passwordHash, ...userWithoutPassword } = user;
    res.json({ id: userDoc.id, ...userWithoutPassword });
  } catch (e) {
    console.error('Error logging in:', e);
    res.status(500).json({ error: 'Failed to login' });
  } 
});

export default router;