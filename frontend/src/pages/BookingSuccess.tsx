import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Booking } from '../types';
import { Button } from '../components/ui/Button';
import { CheckCircle2, Calendar, MapPin, Ticket as TicketIcon, Download } from 'lucide-react';

export const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking as Booking | undefined;

  if (!booking) {
    return (
      <div className="container mx-auto p-20 text-center">
        <h2 className="text-2xl font-bold mb-4">No booking found</h2>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 text-center shadow-sm">
        
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-500 mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
          Your booking is confirmed. We've sent a confirmation email to you.
        </p>

        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-left overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Booking ID</p>
              <p className="font-mono text-slate-900 dark:text-white font-bold">{booking.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Paid</p>
              <p className="text-primary-600 dark:text-primary-400 font-bold">${booking.totalPrice.toFixed(2)}</p>
            </div>
          </div>
          
          {/* Details */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Event</p>
              <p className="font-semibold text-slate-900 dark:text-white">{booking.event.title}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Seats</p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {booking.seats.map(s => `${s.row}${s.number}`).join(', ')}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 flex items-center"><Calendar className="h-4 w-4 mr-1"/> Date & Time</p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {new Date(booking.event.date).toLocaleDateString()} at {booking.event.time}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 flex items-center"><MapPin className="h-4 w-4 mr-1"/> Venue</p>
              <p className="font-semibold text-slate-900 dark:text-white line-clamp-1">{booking.event.venue}, {booking.event.city}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="sm:w-auto">
            <Download className="mr-2 h-5 w-5" /> Download Tickets
          </Button>
          <Link to="/my-bookings">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <TicketIcon className="mr-2 h-5 w-5" /> View My Bookings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
