import React from 'react';
import { Button } from '../components/ui/Button';
import { ArrowRight, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        <div className="container relative mx-auto px-4 text-center">
          <Badge className="mb-6 bg-primary-500/20 text-primary-300 backdrop-blur-md border border-primary-500/30">
            Premium Ticket Experience
          </Badge>
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Experience the Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-600">Events Worldwide</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Discover and book tickets for the most anticipated concerts, sports games, and theater shows. Secure your spot in just a few clicks.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/events">
              <Button size="lg" className="rounded-full px-8 bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/30">
                Explore Events <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/categories">
              <Button size="lg" variant="outline" className="rounded-full px-8 text-white border-white/20 hover:bg-white/10 backdrop-blur-md">
                Browse Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Placeholder for trending events */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Trending Now</h2>
            <Link to="/events" className="text-primary-600 font-medium hover:text-primary-700 flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Event Cards will go here */}
            <div className="h-64 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-400 dark:border-slate-800 dark:bg-slate-900">
              Event Card Placeholder
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Temp inline Badge for Hero
const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${className}`}>
    {children}
  </span>
);
