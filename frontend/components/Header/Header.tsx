'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutUser } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const Header = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);
  const initialized = useAuthStore(state => state.initialized);
  const clear = useAuthStore(state => state.clear);

  const logout = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      clear();
      queryClient.removeQueries({ queryKey: ['history'] });
      router.push('/quizzes');
    },
  });

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold">
          Підготовка до НМТ
        </Link>

        <div className="flex items-center gap-5 text-sm">
          <Link href="/quizzes" className="hover:underline">
            Тести
          </Link>

          {!initialized ? (
            <span
              className="text-slate-400"
              aria-label="Checking authentication">
              Перевірка авторизації...
            </span>
          ) : user ? (
            <>
              <Link href="/history" className="hover:underline">
                Історія
              </Link>

              {(user.role === 'teacher' || user.role === 'admin') && (
                <Link
                  href="/create"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-white">
                  + Створити тест
                </Link>
              )}

              <span className="hidden text-slate-500 sm:inline">
                {user.username}
              </span>

              <button
                type="button"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                className="hover:underline disabled:opacity-50">
                {logout.isPending ? 'Вихід...' : 'Вийти'}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Вхід
              </Link>
              <Link href="/register" className="rounded-lg border px-4 py-2">
                Реєстрація
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
