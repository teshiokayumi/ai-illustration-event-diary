import React, { useState, useEffect } from 'react';
import { Event } from '../types';
import { getAllEvents } from '../services/eventService';
import EventCard from '../components/event/EventCard';
import CalendarView from '../components/event/CalendarView';

const CardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" /></svg>;
const CalendarIconSvg = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [view, setView] = useState<'card' | 'calendar'>('card');
  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const fetchedEvents = await getAllEvents();
        setEvents(fetchedEvents);
        setFilteredEvents(fetchedEvents);
      } catch (err) {
        setError('Failed to load events.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = events.filter(item => {
      return (
        item.title.toLowerCase().includes(lowercasedFilter) ||
        item.description.toLowerCase().includes(lowercasedFilter) ||
        item.organizerName.toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredEvents(filteredData);
  }, [searchTerm, events]);

  if (loading) {
    return <div className="text-center p-10 text-xl">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-xl text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4">Discover AI Illustration Events</h1>
        <p className="text-lg text-on-surface-secondary max-w-2xl mx-auto">
          Explore a curated list of events, workshops, and meetups for AI art enthusiasts and professionals.
        </p>
      </div>
      
      <div className="mb-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-auto md:flex-grow">
            <input
            type="text"
            placeholder="Search by title, organizer, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-gray-600 rounded-lg p-3 text-on-surface focus:ring-primary focus:border-primary transition-all"
            />
        </div>
        <div className="flex bg-surface p-1 rounded-lg shrink-0">
           <button onClick={() => setView('card')} className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${view === 'card' ? 'bg-primary text-white shadow-lg' : 'hover:bg-gray-700'}`}>
               <CardIcon /> カード
           </button>
           <button onClick={() => setView('calendar')} className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${view === 'calendar' ? 'bg-primary text-white shadow-lg' : 'hover:bg-gray-700'}`}>
               <CalendarIconSvg /> カレンダー
           </button>
        </div>
      </div>

      {view === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.length > 0 ? (
            filteredEvents.map(event => <EventCard key={event.id} event={event} />)
            ) : (
            <p className="col-span-full text-center text-on-surface-secondary text-lg">
                No events found. Try adjusting your search.
            </p>
            )}
        </div>
        ) : (
        <CalendarView events={filteredEvents} currentDate={calendarDate} setCurrentDate={setCalendarDate} />
      )}
    </div>
  );
};

export default HomePage;
