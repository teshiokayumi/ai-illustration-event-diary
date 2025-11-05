import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

// イベントの主催者一覧を取得
router.get('/event/:eventId', async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    
    const stmt = db.prepare(`
      SELECT eo.*, u.email, u.display_name 
      FROM event_organizers eo
      JOIN users u ON eo.user_id = u.id
      WHERE eo.event_id = ?
      ORDER BY eo.role DESC, eo.added_at ASC
    `);
    
    const organizers = stmt.all(eventId);
    res.json(organizers);
  } catch (error) {
    console.error('Error fetching organizers:', error);
    res.status(500).json({ error: 'Failed to fetch organizers' });
  }
});

// 主催者を追加
router.post('/event/:eventId', async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { userId, role = 'co-organizer' } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // イベントが存在するか確認
    const eventStmt = db.prepare('SELECT * FROM events WHERE id = ?');
    const event = eventStmt.get(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // ユーザーが存在するか確認
    const userStmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = userStmt.get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 既に主催者として登録されているか確認
    const checkStmt = db.prepare('SELECT * FROM event_organizers WHERE event_id = ? AND user_id = ?');
    const existing = checkStmt.get(eventId, userId);
    if (existing) {
      return res.status(409).json({ error: 'User is already an organizer' });
    }

    // 主催者を追加
    const insertStmt = db.prepare(`
      INSERT INTO event_organizers (event_id, user_id, role)
      VALUES (?, ?, ?)
    `);
    insertStmt.run(eventId, userId, role);

    const getStmt = db.prepare(`
      SELECT eo.*, u.email, u.display_name 
      FROM event_organizers eo
      JOIN users u ON eo.user_id = u.id
      WHERE eo.event_id = ? AND eo.user_id = ?
    `);
    const newOrganizer = getStmt.get(eventId, userId);
    
    res.status(201).json(newOrganizer);
  } catch (error) {
    console.error('Error adding organizer:', error);
    res.status(500).json({ error: 'Failed to add organizer' });
  }
});

// 主催者を削除
router.delete('/event/:eventId/user/:userId', async (req: Request, res: Response) => {
  try {
    const { eventId, userId } = req.params;

    // ownerを削除しようとしていないか確認
    const checkStmt = db.prepare('SELECT role FROM event_organizers WHERE event_id = ? AND user_id = ?');
    const organizer = checkStmt.get(eventId, userId) as any;
    
    if (!organizer) {
      return res.status(404).json({ error: 'Organizer not found' });
    }

    if (organizer.role === 'owner') {
      return res.status(403).json({ error: 'Cannot remove the event owner' });
    }

    const deleteStmt = db.prepare('DELETE FROM event_organizers WHERE event_id = ? AND user_id = ?');
    const result = deleteStmt.run(eventId, userId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Organizer not found' });
    }

    res.json({ message: 'Organizer removed successfully' });
  } catch (error) {
    console.error('Error removing organizer:', error);
    res.status(500).json({ error: 'Failed to remove organizer' });
  }
});

export default router;
