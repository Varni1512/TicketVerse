import { motion } from 'framer-motion';
import { ArrowRight, Music, Trophy, Laugh, MonitorPlay } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CategoriesSection = () => {
  const categories = [
    { name: 'Music', description: 'Concerts & Live Shows', icon: Music },
    { name: 'Sports', description: 'Matches & Tournaments', icon: Trophy },
    { name: 'Comedy', description: 'Stand-up & Improv', icon: Laugh },
    { name: 'Tech', description: 'Conferences & Meetups', icon: MonitorPlay },
  ];

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
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div 
                key={cat.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
              >
                <Link to={`/events?category=${cat.name.toLowerCase()}`} className="block h-full group">
                  <div className="p-6 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{cat.name}</h3>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{cat.description}</p>
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
