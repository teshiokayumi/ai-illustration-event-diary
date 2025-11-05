import { Event } from '../types';

const API_BASE_URL = '/api/events';

export const getAllEvents = async (): Promise<Event[]> => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  // The backend returns events sorted by start_time descending, so no need to sort on the client.
  return response.json();
};

export const getEventById = async (id: string): Promise<Event | null> => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch event');
  }
  return response.json();
};

export const createEvent = async (eventData: Omit<Event, 'id'>): Promise<Event> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });
  if (!response.ok) {
    throw new Error('Failed to create event');
  }
  return response.json();
};

export const updateEvent = async (id: string, eventData: Partial<Event>): Promise<Event | null> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to update event');
  }
  return response.json();
};

export const deleteEvent = async (id: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    if (response.status === 404) {
      return false;
    }
    throw new Error('Failed to delete event');
  }
  // Check for a 204 No Content response for successful deletion
  return response.status === 204 || response.ok;
};