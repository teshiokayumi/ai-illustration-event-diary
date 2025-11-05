import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import eventsRouter from './routes/events';
import organizersRouter from './routes/organizers';
import { runMigrations } from './migrate';
import { authMiddleware } from './middleware/authMiddleware'; // ← 追加

const app = express();

console.log('Running database migrations...');
runMigrations();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/events', authMiddleware, eventsRouter); // ← 保護
app.use('/api/organizers', authMiddleware, organizersRouter); // ← 保護  // ← 追加

const port = process.env.PORT ? Number(process.env.PORT) : 8080;
app.listen(port, () => {
  console.log(`✅ Server listening on port ${port}`);
});

export default app;
