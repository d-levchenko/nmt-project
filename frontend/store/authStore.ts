import { User } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      isAuthenticated: false,
      user: null,
      setUser: user => set({ user, isAuthenticated: true }),
      clearIsAuthenticated: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: 'authStore',
      partialize: state => ({ isAuthenticated: state.isAuthenticated }),
    },
  ),
);
