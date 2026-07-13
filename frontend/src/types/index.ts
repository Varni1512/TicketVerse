export type EventCategory = 'Music' | 'Comedy' | 'Sports' | 'Theater' | 'Tech';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  imageUrl: string;
  category: EventCategory;
  price: number;
  availableSeats: number;
  organizer: string;
  rating: number;
  eventDate?: string;
  startTime?: string;
  status?: string;
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  avatar?: string;
  role?: string;
}

export type SeatStatus = 'available' | 'booked' | 'selected';
export type SeatTier = 'regular' | 'premium' | 'vip';

export interface Seat {
  id: string;
  row: string;
  number: number;
  tier: SeatTier;
  status: SeatStatus;
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  event: Event;
  seats: Seat[];
  totalPrice: number;
  bookingDate: string;
  status: 'confirmed' | 'cancelled';
}

export interface Review {
  id: string;
  eventId: string;
  user: User;
  rating: number;
  comment: string;
  date: string;
}
