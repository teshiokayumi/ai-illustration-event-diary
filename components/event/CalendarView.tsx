import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../../types';

interface CalendarViewProps {
  events: Event[];
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

// Helper function to check if two dates are the same day (ignoring time)
const isSameDay = (d1: Date, d2: Date) => {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
};


const CalendarView: React.FC<CalendarViewProps> = ({ events, currentDate, setCurrentDate }) => {
  const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];

  const getFourWeeks = (date: Date) => {
    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() - startDate.getDay()); 
    
    const weeks: Date[][] = [];
    for (let i = 0; i < 4; i++) {
      const week: Date[] = [];
      for (let j = 0; j < 7; j++) {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + (i * 7) + j);
        week.push(day);
      }
      weeks.push(week);
    }
    return weeks;
  };
  
  const weeks = getFourWeeks(currentDate);

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 28);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 28);
    setCurrentDate(newDate);
  };
  
  const getMonthYearDisplay = () => {
    const firstDay = weeks[0][0];
    const lastDay = weeks[3][6];
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    const firstMonthYear = firstDay.toLocaleDateString('ja-JP', options);
    const lastMonthYear = lastDay.toLocaleDateString('ja-JP', options);

    if(firstMonthYear === lastMonthYear) {
      return firstMonthYear;
    }
    return `${firstMonthYear} - ${lastMonthYear}`;
  }

  return (
    <div className="bg-surface rounded-lg shadow-xl p-4 sm:p-6">
       <div className="flex justify-between items-center mb-4">
         <button onClick={handlePrev} className="bg-primary hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">&lt; 前</button>
         <h2 className="text-xl sm:text-2xl font-bold text-center">{getMonthYearDisplay()}</h2>
         <button onClick={handleNext} className="bg-primary hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">次 &gt;</button>
       </div>
      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-on-surface-secondary">
        {daysOfWeek.map(day => <div key={day} className="py-2">{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((day, index) => {
          const dayStart = new Date(day);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(day);
          dayEnd.setHours(23, 59, 59, 999);
          
          const dayEvents = events
            .filter(event => {
                const eventStart = new Date(event.startTime);
                const eventEnd = new Date(event.endTime);
                return eventStart <= dayEnd && eventEnd >= dayStart;
            })
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

          const isToday = isSameDay(day, new Date());
          const isCurrentDisplayMonth = day.getMonth() === currentDate.getMonth();

          return (
            <div key={index} className={`border border-gray-700 h-32 sm:h-40 flex flex-col p-1 sm:p-2 overflow-hidden ${isCurrentDisplayMonth ? 'bg-surface' : 'bg-gray-800'}`}>
              <div className="flex justify-end">
                <span className={`font-bold text-sm ${isToday ? 'bg-secondary text-white rounded-full h-6 w-6 flex items-center justify-center' : ''}`}>
                  {day.getDate()}
                </span>
              </div>
              <div className="overflow-y-auto flex-grow -mx-1 px-1 mt-1 space-y-1">
                {dayEvents.map(event => {
                    const eventStartDate = new Date(event.startTime);
                    const eventEndDate = new Date(event.endTime);

                    const isStart = isSameDay(day, eventStartDate);
                    const isEnd = isSameDay(day, eventEndDate);
                    const isOneDayEvent = isSameDay(eventStartDate, eventEndDate);

                    let barClasses = 'w-full text-white p-1 text-xs transition-colors';
                    if (isOneDayEvent) {
                        barClasses += ' rounded';
                    } else if (isStart) {
                        barClasses += ' rounded-l-md';
                    } else if (isEnd) {
                        barClasses += ' rounded-r-md';
                    } else {
                        barClasses += ' rounded-none';
                    }
                    
                    const showTitle = isStart || day.getDay() === 0;

                    return (
                        <Link 
                            key={event.id} 
                            to={`/events/${event.id}`} 
                            className={`block bg-primary/80 hover:bg-primary ${barClasses}`}
                            title={event.title}
                        >
                            <div className="truncate">
                                {showTitle ? event.title : <span className="invisible">.</span>}
                            </div>
                        </Link>
                    );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;