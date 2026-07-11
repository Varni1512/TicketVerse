import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const Contact = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors pt-20 pb-24">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-400">
            Support & Sales
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Contact our team.</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Whether you need help with an existing booking or want to migrate your venue to TicketVerse, we are here to assist.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Contact Information (Left Column) */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="lg:col-span-2 space-y-10"
          >
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Direct Communication</h3>
              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                    <Mail className="h-4 w-4 text-slate-400" /> Support
                  </div>
                  <a href="mailto:support@ticketverse.com" className="text-primary-600 dark:text-primary-400 text-sm hover:underline">
                    support@ticketverse.com
                  </a>
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                    <Phone className="h-4 w-4 text-slate-400" /> Phone
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    +1 (555) 123-4567 <span className="text-slate-400 text-xs ml-1">(Mon-Fri, 9am-6pm PST)</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Headquarters</h3>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                  <MapPin className="h-4 w-4 text-slate-400" /> San Francisco
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  123 Innovation Drive<br />
                  Tech District<br />
                  San Francisco, CA 94105
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form (Right Column) */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            className="lg:col-span-3 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-slate-800 p-8"
          >
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-1.5">First name</label>
                  <Input placeholder="Jane" className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-1.5">Last name</label>
                  <Input placeholder="Doe" className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-1.5">Work email</label>
                <Input type="email" placeholder="jane@company.com" className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-1.5">How can we help?</label>
                <textarea 
                  className="w-full h-32 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors resize-none"
                  placeholder="Provide details about your inquiry..."
                ></textarea>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full h-11 text-sm font-medium group">
                  Submit Request
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </form>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
};
