import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const CTASection = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-4 max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-slate-900 dark:bg-slate-900 rounded-3xl p-10 md:p-16 border border-slate-800 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle grid in background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready for your next experience?</h2>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of users who book with TicketVerse every day. Discover, book, and enjoy the best events around the world.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 h-12 px-8 font-medium text-base rounded-lg border border-transparent shadow-sm">
                  Create Account
                </Button>
              </Link>
              <Link to="/events">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-700 text-white hover:bg-slate-800 h-12 px-8 font-medium text-base rounded-lg">
                  Browse Events
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
