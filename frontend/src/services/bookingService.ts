import { Booking } from '../types';
import { api } from './api';

export const bookingService = {
  createBooking: async (eventId: string, seatIds: string[], totalPrice: number): Promise<Booking> => {
    // API logic assuming backend has a /bookings endpoint
    const response = await api.post('/bookings', { eventId, seatIds, totalPrice });
    return response.data;
  },

  getUserBookings: async (userId: string): Promise<Booking[]> => {
    // API logic assuming backend has a /bookings/user/{userId} or similar endpoint
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
  }
};
