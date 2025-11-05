import React, { useState, useEffect, useCallback } from 'react';
import { Event } from '../types';
import { useAuth } from '../hooks/useAuth';
import { getAllEvents, createEvent, deleteEvent } from '../services/eventService';
import { Link } from 'react-router-dom';
import EventForm from '../components/event/EventForm';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchAllEvents = useCallback(async () => {
    setLoading(true);
    const allEvents = await getAllEvents();
    const sortedEvents = allEvents;
    setEvents(sortedEvents);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  const handleCreateEvent = async (eventData: Omit<Event, 'id' | 'userId'>, editPassword: string) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const fullEventData = {
        ...eventData,
        userId: user.id,
        editPasswordHash: editPassword, // Storing plaintext for demo
      };
      await createEvent(fullEventData);
      alert('Event created successfully!');
      setShowForm(false);
      fetchAllEvents();
    } catch (err) {
      console.error(err);
      alert('Failed to create event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
        try {
            await deleteEvent(eventId);
            alert('Event deleted successfully.');
            fetchAllEvents();
        } catch (error) {
            alert('Failed to delete event.');
        }
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-secondary hover:bg-green-600 text-white font-bold py-2 px-5 rounded-lg transition-colors"
        >
          {showForm ? 'Cancel' : '+ Create New Event'}
        </button>
      </div>

      {showForm && (
        <div className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-center">新規イベントフォーム</h2>
            <EventForm 
              onSubmit={handleCreateEvent}
              isSubmitting={isSubmitting}
              submitButtonText="イベントを作成"
            />
        </div>
      )}

      <div className="bg-surface rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">All Events</h2>
        {loading ? (
          <p>Loading your events...</p>
        ) : events.length > 0 ? (
          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="flex justify-between items-center bg-gray-800 p-4 rounded-md">
                <div>
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  <p className="text-on-surface-secondary">
                    {new Date(event.startTime).toLocaleDateString()} - {event.location}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Link to={`/events/${event.id}`} className="text-primary hover:underline">
                    View/Edit
                  </Link>
                  <button onClick={() => handleDeleteEvent(event.id)} className="text-red-500 hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-on-surface-secondary text-center py-8">
            No events have been created yet. Click 'Create New Event' to get started!
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
