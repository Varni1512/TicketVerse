import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, Check } from 'lucide-react';

interface AdminSeatBookingModalProps {
  eventId: string;
  onClose: () => void;
}

export const AdminSeatBookingModal = ({ eventId, onClose }: AdminSeatBookingModalProps) => {
  const [seats, setSeats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [targetEmail, setTargetEmail] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchSeats = async () => {
    try {
      const res = await api.get(`/events/${eventId}/seats`);
      setSeats(res.data || []);
    } catch (error) {
      console.error('Failed to fetch seats', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, [eventId]);

  const handleSeatClick = (seatId: string, status: string) => {
    if (status !== 'AVAILABLE') return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleDirectBook = async () => {
    if (selectedSeats.length === 0) return;
    setBookingLoading(true);
    try {
      const payload = {
        eventId: parseInt(eventId),
        seatIds: selectedSeats.map(s => parseInt(s)),
        otpCode: '' // Admin bypasses OTP
      };
      
      const url = targetEmail 
        ? `/bookings/admin?userEmail=${encodeURIComponent(targetEmail)}` 
        : `/bookings/admin`;
        
      await api.post(url, payload);
      setSuccessMsg('Booking successful!');
      setSelectedSeats([]);
      fetchSeats(); // Refresh seats to show them as booked
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Direct booking failed', error);
      alert('Failed to book seats.');
    } finally {
      setBookingLoading(false);
    }
  };

  const occupiedCount = seats.filter(s => s.status === 'BOOKED').length;
  const remainingCount = seats.filter(s => s.status === 'AVAILABLE').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl p-6 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Direct Booking & Occupancy</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-500">Loading seating layout...</div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-6 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex-1 text-center border-r border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-500">Total Seats</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{seats.length}</p>
              </div>
              <div className="flex-1 text-center border-r border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-500">Occupied</p>
                <p className="text-2xl font-bold text-purple-600">{occupiedCount}</p>
              </div>
              <div className="flex-1 text-center">
                <p className="text-sm text-slate-500">Available</p>
                <p className="text-2xl font-bold text-green-600">{remainingCount}</p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
              <div className="min-w-max mx-auto space-y-2">
                {/* Stage Indicator */}
                <div className="w-3/4 mx-auto mb-10 h-8 bg-gradient-to-b from-primary-500/20 to-transparent border-t-2 border-primary-500 rounded-t-[100%] flex items-center justify-center text-sm font-medium text-primary-700 dark:text-primary-400">
                  STAGE
                </div>
                
                {Array.from(new Set(seats.map(s => s.rowNum))).sort().map(rowNum => {
                  const rowSeats = seats.filter(s => s.rowNum === rowNum).sort((a, b) => a.seatNumber.localeCompare(b.seatNumber));
                  return (
                    <div key={rowNum} className="flex justify-center gap-2">
                      <div className="w-8 flex items-center justify-center font-mono text-sm text-slate-400 font-medium">
                        {String.fromCharCode(64 + parseInt(rowNum))}
                      </div>
                      {rowSeats.map(seat => {
                        const isSelected = selectedSeats.includes(seat.id.toString());
                        const isBooked = seat.status === 'BOOKED';
                        const isVip = seat.seatType === 'VIP';

                        let baseClass = "w-8 h-8 rounded-t-lg rounded-b-sm border transition-all text-[10px] flex items-center justify-center cursor-pointer";
                        let colorClass = "";

                        if (isSelected) {
                          colorClass = "bg-primary-600 border-primary-700 text-white transform scale-110 shadow-lg shadow-primary-500/30";
                        } else if (isBooked) {
                          colorClass = "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400 cursor-not-allowed opacity-50";
                        } else if (isVip) {
                          colorClass = "bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:border-amber-700/50 dark:text-amber-300 dark:hover:bg-amber-900/50";
                        } else {
                          colorClass = "bg-white border-slate-300 text-slate-600 hover:border-primary-400 hover:bg-primary-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:border-primary-500/50 dark:hover:bg-primary-900/20";
                        }

                        return (
                          <div 
                            key={seat.id}
                            onClick={() => handleSeatClick(seat.id.toString(), seat.status)}
                            className={`${baseClass} ${colorClass}`}
                            title={`Seat ${seat.seatNumber} - ₹${seat.price}`}
                          >
                            {seat.seatNumber}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold mb-4">Direct Booking (Admin Bypass)</h3>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Input 
                    label="User Email (Optional)" 
                    placeholder="Enter email to assign ticket, or leave empty for admin"
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleDirectBook} 
                  disabled={selectedSeats.length === 0 || bookingLoading}
                  className="mb-1"
                >
                  {bookingLoading ? 'Booking...' : `Book ${selectedSeats.length} Seats`}
                </Button>
              </div>
              {successMsg && (
                <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
                  <Check className="w-5 h-5" /> {successMsg}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
