'use client';
import { useEffect } from 'react';
import { getMe } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const AuthProvider = () => {
  const setUser = useAuthStore(s => s.setUser);
  const setInitialized = useAuthStore(s => s.setInitialized);
  const clear = useAuthStore(s => s.clear);

  useEffect(() => {
    getMe()
      .then(user => setUser(user))
      .catch(() => clear())
      .finally(() => setInitialized(true));
  }, [setUser, setInitialized, clear]);

  return null;
};

export default AuthProvider;
