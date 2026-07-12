import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Music, Trophy, Laugh, MonitorPlay, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const getIconForCategory = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('music') || lower.includes('concert')) return Music;
  if (lower.includes('sport') || lower.includes('match')) return Trophy;
  if (lower.includes('comedy')) return Laugh;
  if (lower.includes('tech') || lower.includes('conference')) return MonitorPlay;
  return Star;
};

export const CategoriesSection = () => {
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/events/categories');
        if (response.data && response.data.length > 0) {
           setCategories(response.data);
        } else {
           // Fallback if db is empty
           setCategories(['Music', 'Sports', 'Comedy', 'Tech']);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories(['Music', 'Sports', 'Comedy', 'Tech']);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/20 border-b border-slate-200 dark:border-slate-800/60 transition-colors">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Explore Categories</h2>
            <p className="text-slate-600 dark:text-slate-400">Find events curated specifically for your interests.</p>
          </div>
          <Link to="/categories" className="inline-flex items-center text-sm font-medium text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors group">
            Browse all categories
            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((catName, index) => {
            const Icon = getIconForCategory(catName);
            return (
              <motion.div 
                key={catName}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
              >
                <Link to={`/events?category=${catName.toLowerCase()}`} className="block h-full group">
                  <div className="p-6 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{catName}</h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
