import { Booking } from '../types';
import { addMockBooking, getMockBookingsByUserId } from '../data/bookings';
import { eventService } from './eventService';
import { getCurrentUser } from '../data/users';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const bookingService = {
  createBooking: async (eventId: string, seatIds: string[], totalPrice: number): Promise<Booking> => {
    await delay(800);
    
    // First reserve seats
    await eventService.reserveSeats(eventId, seatIds);

    const event = await eventService.getEventById(eventId);
    if (!event) throw new Error('Event not found');

    const allSeats = await eventService.getSeats(eventId);
    const bookedSeats = allSeats.filter(s => seatIds.includes(s.id));

    const user = getCurrentUser();
    
    const newBooking: Booking = {
      id: `b_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      eventId: event.id,
      event: event,
      seats: bookedSeats,
      totalPrice,
      bookingDate: new Date().toISOString(),
      status: 'confirmed'
    };

    addMockBooking(newBooking);
    return newBooking;
  },

  getUserBookings: async (userId: string): Promise<Booking[]> => {
    await delay(500);
    return getMockBookingsByUserId(userId);
  }
};
