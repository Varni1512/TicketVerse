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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const seatIds = cart.seats.map(s => s.id);
      const booking = await bookingService.createBooking(cart.event!.id, seatIds, total);
      clearCart();
      navigate('/success', { state: { booking } });
    } catch (error) {
      console.error(error);
      alert('Payment failed. Seats might no longer be available.');
    } finally {
      setLoading(false);
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
                <Input required placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Card Number</label>
                <Input required icon={<CreditCard className="h-4 w-4" />} placeholder="0000 0000 0000 0000" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expiry Date</label>
                  <Input required icon={<Calendar className="h-4 w-4" />} placeholder="MM/YY" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CVC</label>
                  <Input required type="password" icon={<Lock className="h-4 w-4" />} placeholder="123" />
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
                <p className="text-sm text-slate-500">{new Date(cart.event.date).toLocaleDateString()}</p>
                <p className="text-sm text-slate-500">{cart.event.venue}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tickets ({cart.seats.length})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Taxes</span>
                <span>${taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Processing Fees</span>
                <span>${fees.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mb-6 flex justify-between items-end">
              <span className="font-medium text-slate-900 dark:text-white">Total</span>
              <span className="text-2xl font-extrabold text-primary-600 dark:text-primary-400">${total.toFixed(2)}</span>
            </div>

            <Button type="submit" form="payment-form" className="w-full" size="lg" isLoading={loading}>
              Pay ${total.toFixed(2)}
            </Button>
            <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" /> Payments are secure and encrypted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
