import { Event, EventCategory } from '../types';
import { api } from './api';

export const eventService = {
  getEvents: async (): Promise<Event[]> => {
    const response = await api.get('/events');
    const events: Event[] = response.data;
    
    const eventsWithPrices = await Promise.all(
      events.map(async (event) => {
        try {
          const seatsRes = await api.get(`/events/${event.id}/seats`);
          const seats = seatsRes.data;
          const prices = seats.map((s: any) => s.price);
          const minPrice = prices.length > 0 ? Math.min(...prices) : undefined;
          return { ...event, price: minPrice };
        } catch (e) {
          return event;
        }
      })
    );
    
    return eventsWithPrices;
  },

  getEventById: async (id: string): Promise<Event | undefined> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  getCategories: async (): Promise<EventCategory[]> => {
    const response = await api.get('/events/categories');
    return response.data;
  },

  getCities: async (): Promise<string[]> => {
    // The backend doesn't have an explicit /cities endpoint yet, 
    // so we'll fetch events and extract unique cities as a fallback.
    const response = await api.get('/events');
    const events: Event[] = response.data;
    const cities = new Set(events.map(e => e.city));
    return Array.from(cities).filter(Boolean);
  },

  getSeats: async (eventId: string) => {
    const response = await api.get(`/events/${eventId}/seats`);
    return response.data.map((seat: any) => ({
      ...seat,
      row: seat.rowNum,
      number: seat.seatNumber,
      tier: seat.type ? seat.type.toLowerCase() : 'regular',
      status: seat.status ? seat.status.toLowerCase() : 'available'
    }));
  },

  reserveSeats: async (eventId: string, seatIds: string[]) => {
    const response = await api.post(`/bookings`, { eventId, seatIds }); 
    return { success: true, data: response.data };
  }
};
