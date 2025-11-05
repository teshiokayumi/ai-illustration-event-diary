import express from 'express';
import cors from 'cors';
import path from 'path'; // Add path import
import authRouter from './routes/auth';
import eventsRouter from './routes/events';

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../../dist')));

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);

// For any other request, serve the index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

console.log('Starting server...');
const port = process.env.PORT ? Number(process.env.PORT) : 8080;
console.log(`Attempting to listen on port ${port}`);
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default app;
