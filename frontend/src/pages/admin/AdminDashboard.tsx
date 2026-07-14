import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Users, Calendar, Ticket as TicketIcon, IndianRupee, Layers } from 'lucide-react';
import { api } from '../../services/api';
import { useWebSocket } from '../../hooks/useWebSocket';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    events: 0,
    messages: 0
  });
  
  const [liveStats, setLiveStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalSeatsSold: 0
  });
  
  const { connected, subscribe } = useWebSocket();

  useEffect(() => {
    if (connected) {
      const unsub = subscribe('/topic/dashboard', (msg) => {
        if (msg.payload) {
          setLiveStats({
            totalBookings: msg.payload.totalBookings || 0,
            totalRevenue: msg.payload.totalRevenue || 0,
            totalSeatsSold: msg.payload.totalSeatsSold || 0
          });
        }
      });
      return () => unsub();
    }
  }, [connected, subscribe]);

  useEffect(() => {
    // In a real app, this would hit an aggregate endpoint.
    // For now, we'll fetch list lengths.
    const fetchStats = async () => {
      try {
        const [eventsRes, contactsRes] = await Promise.all([
          api.get('/events'),
          api.get('/contact')
        ]);
        
        setStats({
          events: eventsRes.data.length,
          messages: contactsRes.data.length
        });
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center gap-4 border-l-4 border-l-primary-500">
          <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Events</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.events}</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4 border-l-4 border-l-green-500">
          <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
            <TicketIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Bookings Today <span className="text-xs text-green-500 ml-1 animate-pulse">● Live</span></p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{liveStats.totalBookings}</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4 border-l-4 border-l-amber-500">
          <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Revenue Today <span className="text-xs text-green-500 ml-1 animate-pulse">● Live</span></p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{liveStats.totalRevenue}</p>
          </div>
        </Card>
        
        <Card className="p-6 flex items-center gap-4 border-l-4 border-l-purple-500">
          <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Seats Sold Today <span className="text-xs text-green-500 ml-1 animate-pulse">● Live</span></p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{liveStats.totalSeatsSold}</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Contact Messages</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.messages}</p>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Welcome to TicketVerse Admin</h3>
          <p className="text-slate-600 dark:text-slate-300">
            Use the sidebar to navigate through the administration tools. You can create and manage events, configure interactive seating charts, manage event albums, and view user contact submissions.
          </p>
        </Card>
      </div>
    </div>
  );
};
