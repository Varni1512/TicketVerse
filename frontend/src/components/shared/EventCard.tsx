
import { Event } from '../../types';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  return (
    <Link to={`/events/${event.id}`} className="block h-full group">
      <div className="flex flex-col h-full bg-white dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md">
        <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-900">
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-xs font-semibold bg-white/90 dark:bg-slate-900/90 backdrop-blur text-slate-900 dark:text-white rounded-md shadow-sm border border-slate-200/50 dark:border-slate-700/50">
              {event.category}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col flex-grow p-5">
          <div className="flex justify-between items-start mb-2 gap-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {event.title}
            </h3>
            <span className="font-bold text-slate-900 dark:text-white shrink-0 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-md text-sm border border-slate-100 dark:border-slate-800">
              ₹{event.price ?? '--'}
            </span>
          </div>
          
          <div className="mt-auto space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
              <Calendar className="h-4 w-4 mr-2 shrink-0" />
              <span>{event.eventDate ? new Date(event.eventDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'TBD'}</span>
              <span className="mx-2">•</span>
              <Clock className="h-4 w-4 mr-2 shrink-0" />
              <span>{event.time || 'TBD'}</span>
            </div>
            
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
              <MapPin className="h-4 w-4 mr-2 shrink-0" />
              <span className="truncate">{event.venue}, {event.city}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
