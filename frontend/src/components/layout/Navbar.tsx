import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Search, User, Menu } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-primary-600 dark:text-primary-500">
          <Ticket className="h-6 w-6" />
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">TicketVerse</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/events" className="text-sm font-medium text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400">Events</Link>
          <Link to="/categories" className="text-sm font-medium text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400">Categories</Link>
          <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400">About</Link>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <Search className="h-5 w-5" />
          </button>
          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700"></div>
          <Link to="/login">
            <Button variant="ghost" className="hidden lg:inline-flex">Log in</Button>
          </Link>
          <Link to="/register">
            <Button>Sign up</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <button className="text-slate-500">
            <Search className="h-5 w-5" />
          </button>
          <button className="text-slate-500">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};
