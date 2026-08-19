'use client';
import { useEffect } from 'react';
import { getMe, refreshUserSession } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const setUser = useAuthStore(s => s.setUser);
  const setInitialized = useAuthStore(s => s.setInitialized);
  const clear = useAuthStore(s => s.clear);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const isAuth = await refreshUserSession();

        if (!isAuth) {
          clear();
          return;
        }

        const user = await getMe();
        if (!user) {
          clear();
          return;
        }

        setUser(user);
        setInitialized(true);
      } catch {
        clear();
      }
    };

    fetchUser();
  }, [setUser, setInitialized, clear]);

  return <>{children}</>;
};

export default AuthProvider;
