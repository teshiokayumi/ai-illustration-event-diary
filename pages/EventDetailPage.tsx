import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Event } from '../types';
import { getEventById, updateEvent } from '../services/eventService';
import { useAuth } from '../hooks/useAuth';
import EventForm from '../components/event/EventForm';

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-primary" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
);

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-primary" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const fetchedEvent = await getEventById(id);
        if (fetchedEvent) {
          setEvent(fetchedEvent);
        } else {
          setError('Event not found.');
        }
      } catch (err) {
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleEditRequest = () => {
    if (!event) return;
    const password = prompt("Please enter the edit password for this event:");
    if (password === event.editPasswordHash) {
      setIsEditing(true);
    } else if (password !== null) {
      alert("Incorrect password.");
    }
  };

  const handleUpdateEvent = async (eventData: Omit<Event, 'id' | 'userId'>) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const updatedEvent = await updateEvent(id, eventData);
      if (updatedEvent) {
        setEvent(updatedEvent);
        setIsEditing(false);
        alert('Event updated successfully!');
      } else {
        alert('Failed to update event.');
      }
    } catch (err) {
        alert('An error occurred while updating the event.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });
  };

  if (loading) return <div className="text-center p-10 text-xl">Loading event details...</div>;
  if (error) return <div className="text-center p-10 text-xl text-red-500">{error}</div>;
  if (!event) return null;

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">編集中: {event.title}</h1>
        <EventForm 
          initialData={event}
          onSubmit={handleUpdateEvent}
          isSubmitting={isSubmitting}
          submitButtonText="イベントを更新"
        />
        <div className="text-center mt-4">
            <button onClick={() => setIsEditing(false)} className="text-on-surface-secondary hover:text-on-surface">キャンセル</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg shadow-xl overflow-hidden max-w-4xl mx-auto">
      <div className="p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{event.title}</h1>
        <p className="text-xl text-on-surface-secondary mb-8">Organized by {event.organizerName}</p>
        
        <div className="space-y-6 mb-8">
          <div className="flex items-start">
            <CalendarIcon />
            <div>
              <p className="font-semibold">Starts: {formatDate(event.startTime)}</p>
              <p className="font-semibold">Ends: {formatDate(event.endTime)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <LocationIcon />
            <p className="font-semibold">{event.location}</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none text-on-surface text-lg mb-8">
          <h2 className="text-2xl font-bold border-b border-gray-600 pb-2 mb-4">About this event</h2>
          <p>{event.description}</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800 p-6 rounded-lg">
          <div>
            <p className="text-lg text-on-surface-secondary">Participation Fee</p>
            <p className="text-4xl font-bold text-secondary">${event.fee}</p>
          </div>
          {user && user.id === event.userId && (
            <button
              onClick={handleEditRequest}
              className="mt-4 md:mt-0 bg-primary hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Edit Event
            </button>
          )}
        </div>
        {event.contactInfo && (
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-2">Contact</h3>
                <p className="text-on-surface-secondary">{event.contactInfo}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailPage;
