import { Event, EventCategory } from '../types';
import { mockEvents, mockCategories, mockCities } from '../data/events';
import { getSeatsForEvent, eventSeatsMap } from '../data/seats';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const eventService = {
  getEvents: async (): Promise<Event[]> => {
    await delay(500);
    return mockEvents;
  },

  getEventById: async (id: string): Promise<Event | undefined> => {
    await delay(300);
    return mockEvents.find(e => e.id === id);
  },

  getCategories: async (): Promise<EventCategory[]> => {
    await delay(200);
    return mockCategories;
  },

  getCities: async (): Promise<string[]> => {
    await delay(200);
    return mockCities;
  },

  getSeats: async (eventId: string) => {
    await delay(400);
    return getSeatsForEvent(eventId);
  },

  reserveSeats: async (eventId: string, seatIds: string[]) => {
    await delay(600);
    const seats = getSeatsForEvent(eventId);
    let success = true;

    // Check availability
    const seatsToBook = seats.filter(s => seatIds.includes(s.id));
    if (seatsToBook.some(s => s.status !== 'available')) {
      throw new Error('One or more seats are no longer available');
    }

    // Update status
    seats.forEach(s => {
      if (seatIds.includes(s.id)) {
        s.status = 'booked';
      }
    });
    return { success: true };
  }
};
