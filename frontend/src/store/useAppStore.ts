import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Seat, Event } from '../types';

interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  cart: {
    event: Event | null;
    seats: Seat[];
  };
  login: (user: User) => void;
  logout: () => void;
  toggleTheme: () => void;
  setCart: (event: Event, seats: Seat[]) => void;
  clearCart: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      theme: 'light',
      cart: {
        event: null,
        seats: [],
      },
      login: (user) => set({ user }),
      logout: () => set({ user: null, cart: { event: null, seats: [] } }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setCart: (event, seats) => set({ cart: { event, seats } }),
      clearCart: () => set({ cart: { event: null, seats: [] } }),
    }),
    {
      name: 'ticketverse-storage',
    }
  )
);
