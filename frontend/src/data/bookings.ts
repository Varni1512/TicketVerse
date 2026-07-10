import { Booking } from '../types';

export let mockBookings: Booking[] = [];

export const addMockBooking = (booking: Booking) => {
  mockBookings = [booking, ...mockBookings];
};

export const getMockBookingsByUserId = (userId: string) => {
  return mockBookings.filter(b => b.userId === userId);
};
