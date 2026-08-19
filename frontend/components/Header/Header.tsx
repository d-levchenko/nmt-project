'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { logoutUser } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const Header = () => {
  const router = useRouter();
  const { user, clear, initialized } = useAuthStore();

  const logout = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      clear();
      router.push('/');
    },
  });

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold">
          Quiz Builder
        </Link>

        <div className="flex items-center gap-5 text-sm">
          <Link href="/quizzes" className="hover:underline">
            Quizzes
          </Link>

          {initialized && user && (
            <Link href="/history" className="hover:underline">
              History
            </Link>
          )}

          {initialized &&
            (user?.role === 'teacher' || user?.role === 'admin') && (
              <Link
                href="/create"
                className="rounded-lg bg-slate-900 px-4 py-2 text-white">
                + Create Quiz
              </Link>
            )}

          {!initialized ? (
            <span className="text-slate-400">...</span>
          ) : user ? (
            <>
              <span className="hidden text-slate-500 sm:inline">
                {user.username}
              </span>

              <button
                type="button"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                className="hover:underline disabled:opacity-50">
                {logout.isPending ? 'Logging out...' : 'Logout'}
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>

              <Link href="/register" className="rounded-lg border px-4 py-2">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
