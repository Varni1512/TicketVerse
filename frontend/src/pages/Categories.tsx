import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Music, Trophy, Laugh, MonitorPlay } from 'lucide-react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/eventService';

export const Categories = () => {
  const [categories, setCategories] = useState<{name: string, description: string, image: string, icon: any, eventCount: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcessCategories = async () => {
      try {
        const events = await eventService.getEvents();
        const categoryMap = new Map();
        
        events.forEach(event => {
          const cat = event.category || 'Other';
          if (!categoryMap.has(cat)) {
            categoryMap.set(cat, {
              count: 0,
              image: event.imageUrl || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200&auto=format&fit=crop'
            });
          }
          categoryMap.get(cat).count += 1;
        });

        const allCats = await eventService.getCategories();
        
        allCats.forEach(cat => {
            if (!categoryMap.has(cat)) {
                categoryMap.set(cat, { count: 0, image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200&auto=format&fit=crop' });
            }
        });

        const getIconForCategory = (name: string) => {
          const lower = name.toLowerCase();
          if (lower.includes('music') || lower.includes('concert')) return Music;
          if (lower.includes('sport') || lower.includes('match')) return Trophy;
          if (lower.includes('comedy')) return Laugh;
          if (lower.includes('tech') || lower.includes('conference')) return MonitorPlay;
          return Music;
        };
        
        const getDescriptionForCategory = (name: string) => {
          const lower = name.toLowerCase();
          if (lower.includes('music')) return 'Live Concerts & Music Festivals';
          if (lower.includes('sport')) return 'Major Leagues & Championships';
          if (lower.includes('comedy')) return 'Stand-up & Special Shows';
          if (lower.includes('tech')) return 'Conferences & Summits';
          if (lower.includes('theater')) return 'Musicals, Plays & Opera';
          return 'Explore amazing events';
        };

        const processedCategories = Array.from(categoryMap.entries()).map(([name, data]) => ({
          name,
          description: getDescriptionForCategory(name),
          image: data.image,
          icon: getIconForCategory(name),
          eventCount: `${data.count} Events`
        }));
        
        setCategories(processedCategories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAndProcessCategories();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-32 transition-colors">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-16 border-b border-slate-200 dark:border-slate-800 pb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
            Directory
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Event Categories
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Browse our comprehensive directory of live experiences. From stadium tours to intimate tech meetups, find exactly what you're looking for.
          </p>
        </motion.div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400">
            No categories found.
          </div>
        )}

        {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
              >
                <Link to={`/events?category=${cat.name.toLowerCase()}`} className="group block h-full">
                  <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm hover:shadow-md">
                    
                    {/* Top Image Portion */}
                    <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-md shadow-sm flex items-center gap-2">
                        <Icon className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{cat.name}</span>
                      </div>
                    </div>
                    
                    {/* Bottom Content Portion */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {cat.name}
                      </h2>
                      <p className="text-base text-slate-600 dark:text-slate-400 mb-6">
                        {cat.description}
                      </p>
                      
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                          {cat.eventCount}
                        </span>
                        <div className="text-sm font-medium text-slate-900 dark:text-white flex items-center group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          Browse <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>

                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
};
