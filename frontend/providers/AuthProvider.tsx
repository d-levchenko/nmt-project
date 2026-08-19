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
  const initialized = useAuthStore(state => state.initialized);

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

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Checking authentication…
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
