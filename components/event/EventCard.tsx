
import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../../types';

interface EventCardProps {
  event: Event;
}

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
);

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });
  };

  return (
    <div className="bg-surface rounded-lg shadow-xl overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <div className="p-6">
        <h3 className="text-2xl font-bold text-on-surface mb-2">{event.title}</h3>
        <p className="text-on-surface-secondary mb-4">{event.organizerName}</p>
        <div className="flex items-center text-on-surface-secondary mb-2">
            <CalendarIcon />
            <span>{formatDate(event.startTime)}</span>
        </div>
        <div className="flex items-center text-on-surface-secondary mb-4">
            <LocationIcon />
            <span>{event.location}</span>
        </div>
        <p className="text-on-surface line-clamp-3 mb-4">{event.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold text-secondary">${event.fee}</span>
          <Link
            to={`/events/${event.id}`}
            className="bg-primary hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
