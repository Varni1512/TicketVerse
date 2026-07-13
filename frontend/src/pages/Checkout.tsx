import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { bookingService } from '../services/bookingService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CreditCard, Calendar, Lock } from 'lucide-react';

export const Checkout = () => {
  const { cart, clearCart } = useAppStore();
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(false);
  
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  // OTP State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setExpiry(value);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    setCvc(value);
  };

  // If no cart, redirect to events
  if (!cart.event || cart.seats.length === 0) {
    return (
      <div className="container mx-auto p-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate('/events')}>Browse Events</Button>
      </div>
    );
  }

  const subtotal = cart.seats.reduce((sum, seat) => sum + seat.price, 0);
  const taxes = subtotal * 0.1; // 10% tax
  const fees = cart.seats.length * 5; // $5 fee per ticket
  const total = subtotal + taxes + fees;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingOtp(true);
    try {
      await bookingService.sendPaymentOtp();
      setShowOtpModal(true);
    } catch (error) {
      console.error(error);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!otpCode || otpCode.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }
    
    setIsVerifying(true);
    try {
      const seatIds = cart.seats.map(s => s.id);
      const apiBooking = await bookingService.createBooking(cart.event!.id, seatIds, total, otpCode);
      
      const booking = {
        ...apiBooking,
        event: cart.event,
        seats: cart.seats,
        totalPrice: total
      };
      
      clearCart();
      setShowOtpModal(false);
      navigate('/success', { state: { booking } });
    } catch (error: any) {
      console.error(error);
      let msg = 'Payment verification failed. Invalid OTP or seats might no longer be available.';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          msg = error.response.data;
        } else if (error.response.data.message) {
          msg = error.response.data.message;
        } else {
          msg = JSON.stringify(error.response.data);
        }
      }
      alert(`Error: ${msg}`);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          {/* Payment Info */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Payment Method</h2>
            
            <form id="payment-form" onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cardholder Name</label>
                <Input required placeholder="JOHN DOE" value={cardName} onChange={(e) => setCardName(e.target.value.toUpperCase())} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Card Number</label>
                <Input required icon={<CreditCard className="h-4 w-4" />} placeholder="0000 0000 0000 0000" value={cardNumber} onChange={handleCardNumberChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expiry Date</label>
                  <Input required icon={<Calendar className="h-4 w-4" />} placeholder="MM/YY" value={expiry} onChange={handleExpiryChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CVC</label>
                  <Input required type="password" icon={<Lock className="h-4 w-4" />} placeholder="123" value={cvc} onChange={handleCvcChange} />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96 flex-shrink-0">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Order Summary</h3>
            
            <div className="flex gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
              <img src={cart.event.imageUrl} alt={cart.event.title} className="w-20 h-20 object-cover rounded-lg" />
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{cart.event.title}</h4>
                <p className="text-sm text-slate-500">{cart.event.eventDate ? new Date(cart.event.eventDate).toLocaleDateString() : 'TBD'}</p>
                <p className="text-sm text-slate-500">{cart.event.venue}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tickets ({cart.seats.length})</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Taxes</span>
                <span>₹{taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Processing Fees</span>
                <span>₹{fees.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mb-6 flex justify-between items-end">
              <span className="font-medium text-slate-900 dark:text-white">Total</span>
              <span className="text-2xl font-extrabold text-primary-600 dark:text-primary-400">₹{total.toFixed(2)}</span>
            </div>

            <Button type="submit" form="payment-form" className="w-full" size="lg" isLoading={isSendingOtp}>
              Pay ₹{total.toFixed(2)}
            </Button>
            <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" /> Payments are secure and encrypted.
            </p>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800 p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">Verify Payment</h2>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-6">
              We've sent a 6-digit verification code to your email. Please enter it below to confirm your booking.
            </p>
            
            <div className="space-y-4">
              <Input 
                type="text" 
                placeholder="Enter 6-digit OTP" 
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center tracking-widest text-lg font-bold"
              />
              <Button 
                onClick={handleConfirmBooking} 
                className="w-full" 
                size="lg" 
                isLoading={isVerifying}
                disabled={otpCode.length !== 6}
              >
                Confirm Booking
              </Button>
              <Button 
                onClick={() => setShowOtpModal(false)} 
                variant="ghost" 
                className="w-full" 
                disabled={isVerifying}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
