import { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { ArrowRight, Music, MonitorPlay, Laugh, Trophy, ShieldCheck, Zap, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { eventService } from '../services/eventService';
import { Event } from '../types';
import { EventCard } from '../components/shared/EventCard';

export const Home = () => {
  const [trendingEvents, setTrendingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await eventService.getEvents();
        // Just take the first 4 for trending
        setTrendingEvents(events.slice(0, 4));
      } catch (error) {
        console.error('Error fetching trending events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const categories = [
    { name: 'Music', icon: <Music className="h-8 w-8 mb-4 text-primary-500" />, color: 'bg-primary-50 dark:bg-primary-900/20' },
    { name: 'Sports', icon: <Trophy className="h-8 w-8 mb-4 text-emerald-500" />, color: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { name: 'Comedy', icon: <Laugh className="h-8 w-8 mb-4 text-amber-500" />, color: 'bg-amber-50 dark:bg-amber-900/20' },
    { name: 'Tech', icon: <MonitorPlay className="h-8 w-8 mb-4 text-blue-500" />, color: 'bg-blue-50 dark:bg-blue-900/20' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 pt-24 pb-24 lg:pt-36 lg:pb-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent"></div>
        <div className="container relative mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold bg-primary-500/20 text-primary-300 backdrop-blur-md border border-primary-500/30 mb-8">
              ✨ Premium Ticket Experience
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Experience the Best <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-600">Events Worldwide</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-slate-300"
          >
            Discover and book tickets for the most anticipated concerts, sports games, and theater shows. Secure your spot in just a few clicks.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/events">
              <Button size="lg" className="w-full sm:w-auto rounded-full px-8 bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/30 text-lg h-14">
                Explore Events <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white dark:bg-slate-950 relative -mt-10 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Browse by Category</h2>
            <p className="text-slate-600 dark:text-slate-400">Find exactly what you're looking for across our diverse range of events.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <motion.div 
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/events?category=${cat.name.toLowerCase()}`} className={`flex flex-col items-center justify-center p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all hover:-translate-y-1 ${cat.color}`}>
                  {cat.icon}
                  <span className="font-semibold text-slate-900 dark:text-white text-lg">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Events Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Trending Now</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">The most popular events people are booking right now.</p>
            </div>
            <Link to="/events" className="mt-4 md:mt-0 text-primary-600 font-medium hover:text-primary-700 dark:hover:text-primary-400 flex items-center group">
              View all events <ArrowRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Why TicketVerse?</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">We provide the most seamless and secure ticketing experience in the industry.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mx-auto h-20 w-20 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full flex items-center justify-center mb-6">
                <Zap className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Instant Booking</h3>
              <p className="text-slate-600 dark:text-slate-400">Select your seats and get your tickets delivered instantly to your email and dashboard.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="mx-auto h-20 w-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">100% Secure</h3>
              <p className="text-slate-600 dark:text-slate-400">Your payments are encrypted and secure. We guarantee the authenticity of every ticket.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="mx-auto h-20 w-20 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full flex items-center justify-center mb-6">
                <Ticket className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Best Seats</h3>
              <p className="text-slate-600 dark:text-slate-400">Our interactive seat map lets you pick the exact spot you want for the ultimate experience.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-600 dark:bg-primary-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready for your next experience?</h2>
          <p className="text-primary-100 text-xl max-w-2xl mx-auto mb-10">
            Join millions of users who book with TicketVerse every day.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-slate-100 h-14 px-10 text-lg rounded-full">
              Create an Account for Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
