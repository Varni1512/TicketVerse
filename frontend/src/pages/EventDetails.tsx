import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Event } from '../types';
import { eventService } from '../services/eventService';
import { Calendar, MapPin, Clock, Users, ChevronRight } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const data = await eventService.getEventById(id);
        if (data) {
          try {
            const seats = await eventService.getSeats(id);
            const availableSeatsCount = seats.filter((s: any) => s.status.toLowerCase() === 'available').length;
            const prices = seats.map((s: any) => s.price);
            const startingPrice = prices.length > 0 ? Math.min(...prices) : 0;
            
            setEvent({
              ...data,
              availableSeats: availableSeatsCount,
              price: startingPrice
            });
          } catch (seatErr) {
            console.error('Failed to fetch seats', seatErr);
            setEvent(data); // still set event even if seats fail
          }
        }
      } catch (error) {
        console.error('Failed to fetch event', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl mb-8"></div>
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-8"></div>
    </div>;
  }

  if (!event) {
    return <div className="container mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold">Event not found</h2>
      <Link to="/events" className="text-primary-600 hover:underline mt-4 inline-block">Back to Events</Link>
    </div>;
  }

  return (
    <div>
      {/* Banner */}
      <div className="relative h-[40vh] min-h-[300px] w-full bg-slate-900">
        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full">
          <div className="container mx-auto px-4 pb-8">
            <Badge className="mb-4">{event.category}</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-slate-200">
              <div className="flex items-center"><MapPin className="mr-2 h-5 w-5 text-primary-400" />{event.venue}, {event.city}</div>
              <div className="flex items-center"><Calendar className="mr-2 h-5 w-5 text-primary-400" />{event.eventDate ? new Date(event.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'TBD'}</div>
              <div className="flex items-center"><Clock className="mr-2 h-5 w-5 text-primary-400" />{event.time || 'TBD'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">About this Event</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                {event.description}
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Organizer</h2>
              <div className="flex items-center p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
                <div className="h-12 w-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-4">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{event.organizer}</h4>
                  <p className="text-sm text-slate-500">Event Organizer</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar / Ticket Box */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none p-6">
              <div className="mb-6">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Starting from</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">₹{event.price ?? '--'}</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Availability</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {event.availableSeats > 0 ? `${event.availableSeats} Seats left` : <span className="text-red-500">Sold Out</span>}
                  </span>
                </div>
                <div className="flex justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Rating</span>
                  <span className="font-medium text-slate-900 dark:text-white">⭐ {event.rating} / 5.0</span>
                </div>
              </div>

              <Link to={(event.availableSeats || 0) > 0 ? `/events/${event.id}/seats` : '#'}>
                <Button size="lg" className="w-full text-base font-semibold" disabled={(event.availableSeats || 0) === 0}>
                  {(event.availableSeats || 0) > 0 ? 'Select Seats' : 'Sold Out'} <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="text-xs text-center text-slate-400 mt-4">Safe and secure checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
