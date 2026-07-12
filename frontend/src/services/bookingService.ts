import { Booking } from '../types';
import { api } from './api';

export const bookingService = {
  sendPaymentOtp: async (): Promise<void> => {
    await api.post('/bookings/send-otp');
  },

  createBooking: async (eventId: string, seatIds: string[], totalPrice: number, otpCode: string): Promise<Booking> => {
    const response = await api.post('/bookings', { eventId, seatIds, otpCode });
    return response.data;
  },

  getUserBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings');
    const bookings = response.data;
    
    // The backend only returns eventId, so we need to fetch the full Event object for each booking
    const bookingsWithEvents = await Promise.all(
      bookings.map(async (booking: any) => {
        // Map backend fields to frontend fields
        const mappedSeats = (booking.seats || []).map((seat: any) => ({
          ...seat,
          row: seat.rowNum || seat.row,
          number: seat.seatNumber || seat.number
        }));

        const mappedBooking = {
          ...booking,
          status: booking.bookingStatus ? booking.bookingStatus.toLowerCase() : 'confirmed',
          totalPrice: booking.totalAmount || 0,
          seats: mappedSeats
        };

        try {
          const eventRes = await api.get(`/events/${booking.eventId}`);
          return { ...mappedBooking, event: eventRes.data };
        } catch (e) {
          return { ...mappedBooking, event: { id: booking.eventId, title: 'Unknown Event', imageUrl: '', date: new Date().toISOString(), time: 'TBD', venue: 'TBD', city: 'TBD' } };
        }
      })
    );
    
    return bookingsWithEvents;
  }
};
