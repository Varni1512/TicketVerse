import { motion } from 'framer-motion';
import { Target, Heart, Globe, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-20 pb-0 transition-colors">
      
      {/* Header Section */}
      <div className="container mx-auto px-4 max-w-5xl mb-24">
        <div className="max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-400">
              Company
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
              Building the infrastructure for live events.
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              TicketVerse is a high-performance ticketing platform engineered to eliminate friction between artists, organizers, and fans.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800/60 py-24 mb-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col lg:flex-row gap-16">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-full lg:w-1/2"
            >
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 aspect-[4/3]">
                <img 
                  src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200&auto=format&fit=crop" 
                  alt="Concert crowd" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              className="w-full lg:w-1/2 flex flex-col justify-center space-y-6"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">The Problem We Are Solving</h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-400">
                <p>
                  Historically, ticketing platforms have been plagued by legacy architecture, leading to crashed servers during high-demand drops, opaque pricing structures, and rampant fraud.
                </p>
                <p>
                  We founded TicketVerse to rethink this process from the ground up. By leveraging edge computing and modern cryptography, we ensure that transactions are instant, verifiable, and capable of handling massive concurrent loads without breaking a sweat.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="container mx-auto px-4 max-w-5xl mb-24">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Our Core Values</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex items-start gap-4"
          >
            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0">
              <Target className="h-5 w-5 text-slate-900 dark:text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Transparency</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                We believe in upfront pricing. What you see on the event page is exactly what you pay at checkout. No hidden convenience fees added at the last second.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
            className="flex items-start gap-4"
          >
            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0">
              <Heart className="h-5 w-5 text-slate-900 dark:text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Fan Experience First</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Our infrastructure is designed to handle extreme scale so fans never have to stare at a crashing loading screen when their favorite artist announces a tour.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            className="flex items-start gap-4"
          >
            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0">
              <Globe className="h-5 w-5 text-slate-900 dark:text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Global Architecture</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Deployed across global edge networks, TicketVerse provides low-latency experiences whether you are booking a local theater show or a festival halfway across the world.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
            className="flex items-start gap-4"
          >
            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0">
              <Users className="h-5 w-5 text-slate-900 dark:text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Organizer Control</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                We empower organizers with granular data access, dynamic pricing APIs, and robust anti-scalping mechanisms to ensure tickets go to real fans.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Album / Gallery Section */}
      <div className="bg-slate-50 dark:bg-slate-900/20 border-t border-slate-200 dark:border-slate-800/60 py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Unforgettable Moments</h2>
              <p className="text-slate-600 dark:text-slate-400">A glimpse into the events powered by our infrastructure.</p>
            </div>
            <Link to="/album" className="inline-flex items-center text-sm font-medium text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors group">
              View Full Gallery
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          {/* Crisp Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-[200px_200px_200px] gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="md:col-span-2 md:row-span-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900"
            >
              <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500" alt="Concert" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
              className="md:col-span-1 md:row-span-1 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900"
            >
              <img src="https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500" alt="Sports" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              className="md:col-span-1 md:row-span-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900"
            >
              <img src="https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500" alt="Theater" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
              className="md:col-span-1 md:row-span-1 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900"
            >
              <img src="https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500" alt="Comedy" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
              className="md:col-span-3 md:row-span-1 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900"
            >
              <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500" alt="Festival" />
            </motion.div>
          </div>
        </div>
      </div>

    </div>
  );
};
