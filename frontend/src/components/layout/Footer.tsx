import { Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-primary-600 dark:text-primary-500">
              <Ticket className="h-6 w-6" />
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">TicketVerse</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your premium destination for discovering and booking the best events worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-500">Twitter</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-500">Github</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-500">LinkedIn</a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Explore</h3>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/events" className="hover:text-primary-600">All Events</Link></li>
              <li><Link to="/events?category=music" className="hover:text-primary-600">Concerts</Link></li>
              <li><Link to="/events?category=sports" className="hover:text-primary-600">Sports</Link></li>
              <li><Link to="/events?category=theater" className="hover:text-primary-600">Theater</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/about" className="hover:text-primary-600">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-primary-600">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-primary-600">Contact</Link></li>
              <li><Link to="/partners" className="hover:text-primary-600">Partners</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/terms" className="hover:text-primary-600">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-primary-600">Privacy Policy</Link></li>
              <li><Link to="/refunds" className="hover:text-primary-600">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
          <p>© {new Date().getFullYear()} TicketVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
