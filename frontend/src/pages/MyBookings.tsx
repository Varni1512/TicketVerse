import { useEffect, useState } from 'react';
import { Booking } from '../types';
import { bookingService } from '../services/bookingService';
import { useAppStore } from '../store/useAppStore';
import { Calendar, MapPin, Ticket as TicketIcon } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Link, Navigate } from 'react-router-dom';

export const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAppStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingService.getUserBookings(user.id);
        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Bookings</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">Manage your upcoming events and past tickets.</p>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-4">
            <TicketIcon className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">No bookings yet</h3>
          <p className="text-slate-500 mt-1 mb-6">Looks like you haven't booked any events.</p>
          <Link to="/events">
            <Button>Explore Events</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => (
            <div key={booking.id} className="flex flex-col md:flex-row overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              {/* Date/Image Column */}
              <div className="md:w-64 h-48 md:h-auto relative bg-slate-100 dark:bg-slate-800">
                <img src={booking.event.imageUrl} alt={booking.event.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4">
                  <Badge variant={booking.status === 'confirmed' ? 'success' : 'danger'}>
                    {booking.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{booking.event.title}</h3>
                    <span className="font-mono text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">#{booking.id}</span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mt-4">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-slate-400" />
                      {new Date(booking.event.date).toLocaleDateString()} at {booking.event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-slate-400" />
                      {booking.event.venue}, {booking.event.city}
                    </div>
                    <div className="flex items-center">
                      <TicketIcon className="mr-2 h-4 w-4 text-slate-400" />
                      Seats: <span className="font-medium text-slate-900 dark:text-white ml-1">
                        {booking.seats.map(s => `${s.row}${s.number}`).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-sm text-slate-500">Total Paid</p>
                    <p className="font-bold text-primary-600 dark:text-primary-400">${booking.totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm">Download PDF</Button>
                    <Link to={`/events/${booking.eventId}`}>
                      <Button variant="secondary" size="sm">Event Details</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
