import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Users, Calendar, Ticket as TicketIcon, IndianRupee, Layers } from 'lucide-react';
import { api } from '../../services/api';
import { useWebSocket } from '../../hooks/useWebSocket';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  
  const [analytics, setAnalytics] = useState([]);
  
  const { connected, subscribe } = useWebSocket();

  useEffect(() => {
    if (connected) {
      const unsub = subscribe('/topic/dashboard', (msg) => {
        if (msg.payload) {
          // Increment the current stats instead of replacing (since backend might send total or just diff, let's assume total for now since the existing code replaced it)
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
    const fetchStats = async () => {
      try {
        const [eventsRes, contactsRes, adminStatsRes, analyticsRes] = await Promise.all([
          api.get('/events'),
          api.get('/contact'),
          api.get('/bookings/admin/stats'),
          api.get('/bookings/admin/analytics')
        ]);
        
        setStats({
          events: eventsRes.data.length,
          messages: contactsRes.data.length
        });
        
        setLiveStats({
          totalBookings: adminStatsRes.data.totalBookings || 0,
          totalRevenue: adminStatsRes.data.totalRevenue || 0,
          totalSeatsSold: adminStatsRes.data.totalSeatsSold || 0
        });
        
        setAnalytics(analyticsRes.data || []);
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
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Revenue & Bookings Analytics</h3>
          <div className="h-[350px] w-full">
            {analytics.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis yAxisId="left" stroke="#94a3b8" tickFormatter={(value) => `₹${value}`} />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue (₹)" />
                  <Area yAxisId="right" type="monotone" dataKey="tickets" stroke="#10b981" fill="#10b981" fillOpacity={0.1} name="Tickets Sold" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                No analytics data available yet.
              </div>
            )}
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
