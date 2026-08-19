'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
const Protected = ({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: ('student' | 'teacher' | 'admin')[];
}) => {
  const router = useRouter();
  const { user, initialized } = useAuthStore();

  useEffect(() => {
    if (initialized && (!user || (roles && !roles.includes(user.role))))
      router.replace(user ? '/quizzes' : '/login');
  }, [initialized, user, roles, router]);

  if (!initialized || !user || (roles && !roles.includes(user.role)))
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        Перевірка доступу...
      </div>
    );

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        Доступ заборонено для вашої ролі.
      </div>
    );
  }

  return <>{children}</>;
};

export default Protected;
