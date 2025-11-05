import { Event } from '../types';
// No longer need bcryptjs on the frontend
// import bcrypt from 'bcryptjs'; 
import { apiRequest } from './authService'; // Import the shared apiRequest function

// 全イベント取得
export const getAllEvents = async (): Promise<Event[]> => {
  try {
    // This now sends the auth token automatically
    return await apiRequest<Event[]>('/api/events', 'GET', null, false); // Public route
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return [];
  }
};

// イベント作成
export const createEvent = async (
  eventData: Omit<Event, 'id' | 'edit_password_hash'>, // Frontend doesn't know the hash
  editPassword: string // Send raw password
): Promise<Event | null> => {
  try {
    // The backend will now handle hashing.
    const event = await apiRequest<Event>('/api/events', 'POST', {
      ...eventData,
      editPassword, // Send raw password
    });
    
    return event;
  } catch (error) {
    console.error('Failed to create event:', error);
    alert(error instanceof Error ? error.message : 'Failed to create event');
    return null;
  }
};

// イベント更新
export const updateEvent = async (
  eventId: string,
  eventData: Partial<Omit<Event, 'id' | 'edit_password_hash'>>,
  editPassword: string // Send raw password
): Promise<Event | null> => {
  try {
    // The backend will handle hashing and comparison.
    const event = await apiRequest<Event>(`/api/events/${eventId}`, 'PUT', {
      ...eventData,
      editPassword, // Send raw password
    });
    
    return event;
  } catch (error) {
    console.error('Failed to update event:', error);
    alert(error instanceof Error ? error.message : 'Failed to update event');
    return null;
  }
};

// イベント削除
export const deleteEvent = async (
    eventId: string,
    editPassword: string // Send raw password
): Promise<boolean> => {
  try {
    // The backend will handle password comparison.
    await apiRequest(`/api/events/${eventId}`, 'DELETE', { editPassword });
    return true;
  } catch (error) {
    console.error('Failed to delete event:', error);
    alert(error instanceof Error ? error.message : 'Failed to delete event');
    return false;
  }
};