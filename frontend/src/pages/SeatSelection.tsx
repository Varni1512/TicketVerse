import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Seat, Event } from '../types';
import { eventService } from '../services/eventService';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';
import { useWebSocket } from '../hooks/useWebSocket';

export const SeatSelection = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { setCart, user } = useAppStore();
  const { connected, subscribe } = useWebSocket();
  const [viewers, setViewers] = useState(0);
  const [locks, setLocks] = useState<Record<string, { userId: string; expiresAt: number }>>({});
  const [, setTick] = useState(0);

  // Force re-render for countdown timers
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // WebSocket Subscriptions
  useEffect(() => {
    if (connected && id) {
      const unsubSeats = subscribe(`/topic/events/${id}/seats`, (msg) => {
        const { eventType, payload } = msg;
        if (eventType === 'SEAT_LOCKED') {
          setLocks(prev => ({
            ...prev,
            [payload.seatId]: {
              userId: payload.userId?.toString(),
              expiresAt: Date.now() + payload.remainingLockTimeSeconds * 1000
            }
          }));
        } else if (eventType === 'SEAT_UNLOCKED') {
          setLocks(prev => {
            const newLocks = { ...prev };
            delete newLocks[payload.seatId];
            return newLocks;
          });
        } else if (eventType === 'SEAT_BOOKED') {
          setSeats(prev => prev.map(s => s.id === payload.seatId ? { ...s, status: 'booked' } : s));
          setLocks(prev => {
            const newLocks = { ...prev };
            delete newLocks[payload.seatId];
            return newLocks;
          });
        }
      });

      const unsubPresence = subscribe(`/topic/events/${id}/presence`, (msg) => {
        setViewers(msg.payload.viewerCount);
      });

      return () => {
        unsubSeats();
        unsubPresence();
      };
    }
  }, [connected, id, subscribe]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [eventData, seatsData] = await Promise.all([
          eventService.getEventById(id),
          eventService.getSeats(id)
        ]);
        if (eventData) setEvent(eventData);
        if (seatsData) setSeats(seatsData);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') return;
    
    const lock = locks[seat.id];
    if (lock && lock.expiresAt > Date.now() && lock.userId !== user?.id?.toString()) {
      // It is locked by someone else
      return;
    }

    setSelectedSeatIds(prev => {
      if (prev.includes(seat.id)) {
        return prev.filter(sId => sId !== seat.id);
      } else {
        if (prev.length >= 10) {
          alert('You can only select up to 10 seats.');
          return prev;
        }
        return [...prev, seat.id];
      }
    });
  };

  const handleProceed = () => {
    if (!event || selectedSeatIds.length === 0) return;
    const selectedSeatsData = seats.filter(s => selectedSeatIds.includes(s.id));
    setCart(event, selectedSeatsData);
    navigate('/checkout');
  };

  const getSeatColor = (seat: Seat) => {
    if (seat.status === 'booked') return 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-50';
    if (selectedSeatIds.includes(seat.id)) return 'bg-primary-600 border-primary-700 text-white shadow-lg shadow-primary-500/50 scale-110';
    
    const lock = locks[seat.id];
    if (lock && lock.expiresAt > Date.now()) {
      if (lock.userId === user?.id?.toString()) {
        return 'bg-primary-500 border-primary-600 animate-pulse text-white'; // My lock
      } else {
        return 'bg-slate-400 dark:bg-slate-600 cursor-not-allowed border-slate-500'; // Someone else's lock
      }
    }

    switch (seat.tier) {
      case 'vip': return 'bg-amber-400 border-amber-500 hover:bg-amber-300';
      case 'premium': return 'bg-emerald-400 border-emerald-500 hover:bg-emerald-300';
      default: return 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-primary-400 dark:hover:border-primary-500';
    }
  };

  if (loading) {
    return <div className="container mx-auto p-8 text-center animate-pulse">Loading seating chart...</div>;
  }

  if (!event) return <div className="text-center p-8">Event not found</div>;

  const selectedSeatsData = seats.filter(s => selectedSeatIds.includes(s.id));
  const totalPrice = selectedSeatsData.reduce((sum, seat) => sum + seat.price, 0);

  // Group seats by row
  const rows = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Select Your Seats</h1>
          <p className="text-slate-600 dark:text-slate-400">{event.title} • {event.venue}</p>
        </div>
        <div className="flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-full font-medium">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
          </span>
          {viewers} users viewing this event
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Seat Map */}
        <div className="flex-1 overflow-x-auto bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          
          <div className="flex flex-col gap-4 items-center min-w-max pb-8 px-4">
            <div className="w-full mb-12">
              <div className="h-12 bg-gradient-to-b from-slate-200 to-transparent dark:from-slate-800 border-t-4 border-slate-300 dark:border-slate-600 rounded-t-[50%] flex items-center justify-center">
                <span className="text-slate-500 dark:text-slate-400 font-medium text-sm tracking-widest uppercase">Stage</span>
              </div>
            </div>

            {Object.keys(rows).sort().map(rowStr => (
              <div key={rowStr} className="flex items-center gap-4 w-full">
                <div className="w-8 sticky left-0 bg-white dark:bg-slate-900 z-10 flex items-center justify-center font-bold text-slate-400 py-1">{rowStr}</div>
                <div className="flex gap-2 flex-1 justify-center">
                  {rows[rowStr].sort((a, b) => a.number - b.number).map(seat => {
                    const isBooked = seat.status === 'booked';
                    const lock = locks[seat.id];
                    const isLockedByOther = lock && lock.expiresAt > Date.now() && lock.userId !== user?.id?.toString();
                    
                    return (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        disabled={isBooked || !!isLockedByOther}
                        title={`${seat.tier.toUpperCase()} - ₹${seat.price}`}
                        className={`
                          w-8 h-8 md:w-10 md:h-10 flex-shrink-0 rounded-t-lg rounded-b-sm border-b-4 transition-all duration-200 flex items-center justify-center text-xs font-medium
                          ${getSeatColor(seat)}
                        `}
                      >
                        {seat.number}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 pt-8 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-amber-400 border border-amber-500"></div><span className="text-sm text-slate-600 dark:text-slate-400">VIP</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-emerald-400 border border-emerald-500"></div><span className="text-sm text-slate-600 dark:text-slate-400">Premium</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600"></div><span className="text-sm text-slate-600 dark:text-slate-400">Regular</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-primary-600 border border-primary-700"></div><span className="text-sm text-slate-600 dark:text-slate-400">Selected</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-slate-400 border border-slate-500"></div><span className="text-sm text-slate-600 dark:text-slate-400">Locked</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-slate-300 dark:bg-slate-700 opacity-50"></div><span className="text-sm text-slate-600 dark:text-slate-400">Booked</span></div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="sticky top-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Booking Summary</h3>
            
            <div className="min-h-[150px]">
              {selectedSeatsData.length === 0 ? (
                <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                  No seats selected yet.<br/>Click on the map to select seats.
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  {selectedSeatsData.map(seat => {
                    const lock = locks[seat.id];
                    const isMyLock = lock && lock.userId === user?.id?.toString() && lock.expiresAt > Date.now();
                    const timeLeft = isMyLock ? Math.max(0, Math.floor((lock.expiresAt - Date.now()) / 1000)) : 0;
                    
                    return (
                      <div key={seat.id} className="flex flex-col mb-3 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-600 dark:text-slate-300">
                            Row {seat.row} - Seat {seat.number} <span className="text-xs text-slate-400 uppercase ml-1">({seat.tier})</span>
                          </span>
                          <span className="font-medium text-slate-900 dark:text-white">₹{seat.price}</span>
                        </div>
                        {isMyLock && (
                          <div className="text-xs text-amber-500 font-medium mt-1 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                            Reserved for {timeLeft}s
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mb-6">
              <div className="flex justify-between items-end">
                <span className="text-slate-500 dark:text-slate-400">Total</span>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">₹{totalPrice}</span>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full" 
              disabled={selectedSeatsData.length === 0}
              onClick={handleProceed}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
