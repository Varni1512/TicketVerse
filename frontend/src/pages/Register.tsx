import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Ticket, Eye, EyeOff } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import api from '../services/api';

export const Register = () => {
  const navigate = useNavigate();
  const login = useAppStore(state => state.login);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Split fullName into firstName and lastName for the backend DTO
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'User';

    // Clear any old/invalid token from local storage that might cause a 401 Unauthorized
    localStorage.removeItem('token');

    try {
      // 1. Register the user
      await api.post('/auth/register', { 
        firstName, 
        lastName, 
        email, 
        password 
      });

      // 2. Automatically login after registration
      const response = await api.post('/auth/login', { email, password });
      const { accessToken } = response.data;
      
      localStorage.setItem('token', accessToken);
      
      login({
        id: email, // Using email as unique ID
        name: fullName,
        email: email,
        avatar: 'https://ui-avatars.com/api/?name=' + firstName,
      });

      navigate('/');
    } catch (err: any) {
      console.error("Registration error:", err);
      let errorMsg = 'Failed to register. Email might already exist.';
      
      if (err.response?.data) {
        if (err.response.data.message) {
          errorMsg = err.response.data.message;
        } else if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (typeof err.response.data === 'object') {
          const validationErrors = Object.values(err.response.data).join(', ');
          if (validationErrors) {
            errorMsg = validationErrors;
          }
        }
      } else if (err.message) {
        errorMsg = `Network/Browser Error: ${err.message}. Please check if backend is running on port 8080.`;
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 text-primary-600 dark:text-primary-500">
            <Ticket className="h-8 w-8" />
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">TicketVerse</span>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Join TicketVerse to book your next experience.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <Input 
                type="text" 
                required 
                placeholder="John Doe" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email address</label>
              <Input 
                type="email" 
                required 
                placeholder="john@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" isLoading={loading}>
              Sign up
            </Button>
          </div>
          
          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

