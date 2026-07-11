import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, User as UserIcon, Menu, LogOut, Sun, Moon, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAppStore } from '../../store/useAppStore';

export const Navbar = () => {
  const { user, logout, theme, toggleTheme } = useAppStore();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80 transition-colors">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-primary-600 dark:text-primary-500">
          <Ticket className="h-6 w-6" />
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">TicketVerse</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition-colors">Home</Link>
          <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition-colors">About</Link>
          <Link to="/events" className="text-sm font-medium text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition-colors">Events</Link>
          <Link to="/contact" className="text-sm font-medium text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition-colors">Contact</Link>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 p-2 rounded-full transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-2"></div>
          
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary-600 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                  {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name} className="h-8 w-8 rounded-full" /> : <UserIcon className="h-4 w-4" />}
                </div>
                <span>{user.name.split(' ')[0]}</span>
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden py-1">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <Link 
                    to="/my-bookings" 
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={() => setShowMenu(false)}
                  >
                    My Bookings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <Button>Login / Signup</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleTheme} className="text-slate-500">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-500 focus:outline-none">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-4 shadow-lg absolute w-full top-16 left-0">
          <div className="flex flex-col space-y-3">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400">Home</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400">About</Link>
            <Link to="/events" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400">Events</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400">Contact</Link>
          </div>
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full" /> : <UserIcon className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <Link to="/my-bookings" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400">My Bookings</Link>
                <button 
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full text-left flex items-center text-base font-medium text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign out
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full">
                <Button className="w-full">Login / Signup</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
