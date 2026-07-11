import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Ticket, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const HeroSection = () => {
  return (
    <section className="relative bg-white dark:bg-slate-950 pt-20 pb-24 md:pt-32 md:pb-32 border-b border-slate-200 dark:border-slate-800/60 overflow-hidden transition-colors">
      {/* Subtle grid pattern background for the "Senior Engineer" SaaS look */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Subtle glowing orb for depth (very muted) */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-primary-500/5 blur-3xl"></div>

      <div className="container relative mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
          
          {/* Left Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full lg:w-1/2 lg:pr-8 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span className="flex h-2 w-2 rounded-full bg-primary-500"></span>
              TicketVerse 2.0 is live
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
              The modern standard for <span className="text-primary-600 dark:text-primary-500">live events.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              A high-performance ticketing infrastructure designed for fans and organizers. Secure, fast, and completely transparent pricing.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/events" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 rounded-lg font-medium text-base">
                  Browse Events
                </Button>
              </Link>
              <Link to="/about" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-lg font-medium text-base group">
                  How it works
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> 100% Secure</div>
              <div className="flex items-center gap-1.5"><Zap className="h-4 w-4" /> Instant Delivery</div>
              <div className="flex items-center gap-1.5"><Ticket className="h-4 w-4" /> Verified Resale</div>
            </div>
          </motion.div>

          {/* Right Visual / App Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="w-full lg:w-1/2 relative"
          >
            {/* Minimalist Card Stack */}
            <div className="relative w-full max-w-lg mx-auto aspect-[4/3]">
              {/* Back Card */}
              <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800/50 rounded-2xl transform translate-x-4 translate-y-4 border border-slate-200 dark:border-slate-800"></div>
              {/* Middle Card */}
              <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 rounded-2xl transform translate-x-2 translate-y-2 border border-slate-200 dark:border-slate-700 shadow-sm"></div>
              {/* Front Card (Main Image) */}
              <div className="absolute inset-0 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden bg-white dark:bg-slate-950 flex flex-col">
                <div className="h-10 border-b border-slate-100 dark:border-slate-800 flex items-center px-4 gap-2 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                  </div>
                </div>
                <div className="flex-1 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1540039155732-676229ebca02?q=80&w=1200&auto=format&fit=crop" 
                    alt="Event Showcase" 
                    className="w-full h-full object-cover"
                  />
                  {/* Floating Ticket UI Element */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">The Weeknd - After Hours</h4>
                      <p className="text-xs text-slate-500">Madison Square Garden</p>
                    </div>
                    <div className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-md text-xs font-semibold">
                      Admit 1
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
