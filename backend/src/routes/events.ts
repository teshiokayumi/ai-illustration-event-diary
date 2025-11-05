import { Router, Request, Response } from 'express';
import db from '../db';
import { Event } from '../types';

const router = Router();
const eventsCollection = db.collection('events');

// Get all events
router.get('/', async (_req: Request, res: Response) => {
  try {
    const snapshot = await eventsCollection.orderBy('startTime', 'desc').get();
    const events: Event[] = [];
    snapshot.forEach(doc => {
      events.push({ id: doc.id, ...doc.data() } as Event);
    });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get event by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doc = await eventsCollection.doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create new event
router.post('/', async (req: Request, res: Response) => {
  try {
    const eventData: Omit<Event, 'id'> = req.body;

    if (!eventData.title || !eventData.description || !eventData.startTime || !eventData.endTime || !eventData.location || !eventData.organizerName || !eventData.editPasswordHash) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newEventData = {
      ...eventData,
      fee: eventData.fee ?? 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await eventsCollection.add(newEventData);
    const newEvent = { id: docRef.id, ...newEventData };
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eventData: Partial<Event> = req.body;

    const docRef = eventsCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await docRef.update({ ...eventData, updatedAt: new Date().toISOString() });

    const updatedDoc = await docRef.get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const docRef = eventsCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await docRef.delete();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

export default router;