import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Ticket, ArrowLeft, Mail, CheckCircle2, KeyRound, Eye, EyeOff } from 'lucide-react';

type Step = 'email' | 'otp' | 'password' | 'success';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    // Simulate sending OTP API call
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1]; // Only take last char
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value !== '' && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to focus previous input
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }
    
    setError('');
    setLoading(true);
    
    // Simulate verifying OTP API call
    setTimeout(() => {
      setLoading(false);
      if (otpValue === '123456') { // Dummy check for testing, ideally backend verifies
        setStep('password');
      } else {
        // Accept any 6 digit code for demo purposes to avoid blocking the user
        setStep('password');
      }
    }, 1000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    // Simulate password reset API call
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 text-primary-600 dark:text-primary-500 mb-6">
            <Ticket className="h-8 w-8" />
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">TicketVerse</span>
          </Link>
          
          {step === 'email' && (
            <>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Forgot Password
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Enter your email address and we'll send you an OTP to reset your password.
              </p>

              <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
                <div>
                  <label className="block text-left text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email address
                  </label>
                  <Input 
                    type="email" 
                    required 
                    placeholder="example@gmail.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <Button type="submit" className="w-full" isLoading={loading}>
                    Send OTP
                  </Button>
                </div>
                
                <div className="text-center mt-4">
                  <Link to="/login" className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to login
                  </Link>
                </div>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="mx-auto w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Check your email</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                We've sent a 6-digit OTP to <br/><strong className="text-slate-900 dark:text-white">{email}</strong>
              </p>

              <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/10 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 text-left">
                    {error}
                  </div>
                )}
                
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                  ))}
                </div>

                <div>
                  <Button type="submit" className="w-full" isLoading={loading}>
                    Verify OTP
                  </Button>
                </div>
                
                <div className="text-center mt-4">
                  <button 
                    type="button" 
                    onClick={() => setStep('email')}
                    className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    Change email address
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 'password' && (
            <>
              <div className="mx-auto w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                <KeyRound className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Set New Password</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Your OTP was verified. Now create a new password.
              </p>

              <form className="space-y-6 text-left" onSubmit={handlePasswordSubmit}>
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/10 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                    {error}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      New Password
                    </label>
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
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Input 
                        type={showConfirmPassword ? "text" : "password"} 
                        required 
                        placeholder="••••••••" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <Button type="submit" className="w-full" isLoading={loading}>
                    Update Password
                  </Button>
                </div>
              </form>
            </>
          )}

          {step === 'success' && (
            <div className="space-y-6">
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Password Reset Successfully</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your password has been successfully updated. You can now log in with your new credentials.
              </p>
              <div className="pt-4">
                <Button className="w-full" onClick={() => navigate('/login')}>
                  Go to Login
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
