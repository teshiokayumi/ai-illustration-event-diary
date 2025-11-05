import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db';

const router = Router();

// Get all events
router.get('/', (req: Request, res: Response) => {
  try {
    const stmt = db.prepare('SELECT * FROM events ORDER BY start_time DESC');
    const events = stmt.all();
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get a single event
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('SELECT * FROM events WHERE id = ?');
    const event = stmt.get(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create new event
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      location,
      organizerName,
      fee,
      contactInfo,
      editPassword // Expect raw password
    } = req.body;
    
    const userId = req.user?.userId; // Get userId from authenticated user

    if (!userId) {
        return res.status(403).json({ error: 'User not authenticated' });
    }

    if (!title || !description || !startTime || !endTime || !location || !organizerName || !editPassword) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Hash the edit password
    const editPasswordHash = await bcrypt.hash(editPassword, 10);

    const id = `event_${Date.now()}`;
    
    const insertEvent = db.prepare(`
      INSERT INTO events (id, user_id, title, description, start_time, end_time, location, organizer_name, fee, contact_info, edit_password_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const insertOrganizer = db.prepare(`
      INSERT INTO event_organizers (event_id, user_id, role)
      VALUES (?, ?, 'owner')
    `);
    
    const transaction = db.transaction(() => {
      insertEvent.run(id, userId, title, description, startTime, endTime, location, organizerName, fee ?? 0, contactInfo, editPasswordHash);
      insertOrganizer.run(id, userId);
    });
    
    transaction();

    const getStmt = db.prepare('SELECT * FROM events WHERE id = ?');
    const newEvent = getStmt.get(id);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update an event
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, startTime, endTime, location, organizerName, fee, contactInfo, editPassword } = req.body;

        if (!editPassword) {
            return res.status(400).json({ error: 'editPassword is required for update' });
        }

        // Check if event exists
        const getStmt = db.prepare('SELECT * FROM events WHERE id = ?');
        const event = getStmt.get(id) as any;
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Verify the edit password
        const isPasswordValid = await bcrypt.compare(editPassword, event.edit_password_hash);
        if (!isPasswordValid) {
            return res.status(403).json({ error: 'Incorrect edit password' });
        }

        const updateStmt = db.prepare(`
            UPDATE events
            SET title = ?, description = ?, start_time = ?, end_time = ?, location = ?, organizer_name = ?, fee = ?, contact_info = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
        updateStmt.run(
            title ?? event.title,
            description ?? event.description,
            startTime ?? event.start_time,
            endTime ?? event.end_time,
            location ?? event.location,
            organizerName ?? event.organizer_name,
            fee ?? event.fee,
            contactInfo ?? event.contact_info,
            id
        );

        const updatedEvent = getStmt.get(id);
        res.json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Failed to update event' });
    }
});

// Delete an event
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { editPassword } = req.body; // Password must be in the body

        if (!editPassword) {
            return res.status(400).json({ error: 'editPassword is required for deletion' });
        }

        // Check if event exists and get password hash
        const getStmt = db.prepare('SELECT edit_password_hash FROM events WHERE id = ?');
        const event = getStmt.get(id) as any;
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Verify the edit password
        const isPasswordValid = await bcrypt.compare(editPassword, event.edit_password_hash);
        if (!isPasswordValid) {
            return res.status(403).json({ error: 'Incorrect edit password' });
        }
        
        const deleteOrganizersStmt = db.prepare('DELETE FROM event_organizers WHERE event_id = ?');
        const deleteEventStmt = db.prepare('DELETE FROM events WHERE id = ?');

        const transaction = db.transaction(() => {
            deleteOrganizersStmt.run(id);
            const result = deleteEventStmt.run(id);
            if (result.changes === 0) {
                throw new Error('Event not found during transaction');
            }
        });

        transaction();

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        if ((error as Error).message.includes('Event not found')) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

export default router;