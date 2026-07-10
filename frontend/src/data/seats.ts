import { Seat, SeatTier } from '../types';

// Generate mock seats for an event
export const generateMockSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 10;

  rows.forEach((row, rowIndex) => {
    let tier: SeatTier = 'regular';
    let basePrice = 50;

    if (rowIndex < 2) {
      tier = 'vip';
      basePrice = 150;
    } else if (rowIndex < 5) {
      tier = 'premium';
      basePrice = 100;
    }

    for (let i = 1; i <= seatsPerRow; i++) {
      // Randomly assign some seats as booked
      const isBooked = Math.random() < 0.3;
      
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        tier,
        status: isBooked ? 'booked' : 'available',
        price: basePrice,
      });
    }
  });

  return seats;
};

// Store generated seats per event so they persist during a session
export const eventSeatsMap: Record<string, Seat[]> = {};

export const getSeatsForEvent = (eventId: string): Seat[] => {
  if (!eventSeatsMap[eventId]) {
    eventSeatsMap[eventId] = generateMockSeats();
  }
  return eventSeatsMap[eventId];
};
