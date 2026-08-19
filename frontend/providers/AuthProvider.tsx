'use client';

import { useEffect } from 'react';
import { getMe } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const setUser = useAuthStore(state => state.setUser);
  const setInitialized = useAuthStore(state => state.setInitialized);
  const clear = useAuthStore(state => state.clear);

  useEffect(() => {
    let cancelled = false;

    const initializeAuth = async () => {
      try {
        const user = await getMe();

        if (!cancelled) {
          setUser(user);
          setInitialized(true);
        }
      } catch {
        if (!cancelled) {
          clear();
        }
      }
    };

    initializeAuth();

    return () => {
      cancelled = true;
    };
  }, [setUser, setInitialized, clear]);

  return <>{children}</>;
};

export default AuthProvider;
