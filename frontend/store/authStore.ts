import { create } from 'zustand';
import type { User } from '@/types';
import { persist } from 'zustand/middleware';

interface AuthStore {
  user: User | null;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setInitialized: (value: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      user: null,
      initialized: false,
      setUser: user => set({ user }),
      setInitialized: initialized => set({ initialized }),
      clear: () => set({ user: null }),
    }),
    {
      name: 'auth',
    },
  ),
);
