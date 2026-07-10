import React from 'react';
import { Event } from '../../types';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md dark:bg-slate-900 dark:ring-slate-800">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/90 backdrop-blur-md dark:bg-slate-900/90 shadow-sm border border-slate-200 dark:border-slate-700">
            {event.category}
          </Badge>
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
            ${event.price}
          </p>
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center">
              ⭐ {event.rating}
            </span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 mb-2">
          {event.title}
        </h3>
        
        <div className="mt-auto space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-slate-400" />
            <time dateTime={event.date}>
              {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </time>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-slate-400" />
            <span className="line-clamp-1">{event.venue}, {event.city}</span>
          </div>
        </div>
        
        <Link to={`/events/${event.id}`} className="mt-4 block w-full">
          <Button variant="outline" className="w-full">View Details</Button>
        </Link>
      </div>
    </div>
  );
};
