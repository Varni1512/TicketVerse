import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Ticket, BarChart3, Users, Globe } from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
    {
      title: 'Instant Delivery',
      description: 'Your tickets are delivered to your wallet the exact second your payment goes through.',
      icon: Zap
    },
    {
      title: '100% Secure',
      description: 'Bank-level encryption ensures that your payments and personal data are always safe.',
      icon: ShieldCheck
    },
    {
      title: 'Interactive Maps',
      description: 'Pick the perfect spot using our high-fidelity venue mapping technology.',
      icon: Ticket
    },
    {
      title: 'Global Reach',
      description: 'Book events across the globe with support for 50+ currencies and 20+ languages.',
      icon: Globe
    },
    {
      title: 'For Organizers',
      description: 'Powerful analytics, real-time sales tracking, and dynamic pricing algorithms.',
      icon: BarChart3
    },
    {
      title: 'Community First',
      description: 'Join thousands of fans sharing reviews, tips, and photos from past events.',
      icon: Users
    }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/20 transition-colors border-b border-slate-200 dark:border-slate-800/60">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="max-w-2xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Everything you need.</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            A comprehensive ticketing infrastructure built with modern web technologies to ensure maximum reliability and performance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
                className="flex items-start gap-4"
              >
                <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
                  <Icon className="h-5 w-5 text-slate-900 dark:text-slate-100" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
