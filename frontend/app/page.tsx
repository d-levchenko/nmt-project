'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const HomePageContent = () => {
  const router = useRouter();

  useEffect(() => {
    const user = useAuthStore.getState().user;
    if (user) {
      router.push('/history');
    }
  }, [router]);

  return (
    <section className="py-20 text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
        Платформа для підготовки до НМТ
      </p>
      <h1 className="text-4xl font-bold sm:text-6xl">
        Практикуйся. Аналізуй. Вдосконалюйся
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
        Оберіть тест, потренуйтеся, відповідаючи на стільки питань, скільки
        захочете, і порівняйте свій результат та швидкість з результатами інших
        учнів.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/quizzes"
          className="rounded-lg bg-black px-5 py-3 text-white">
          Переглянути тести
        </Link>
        <Link href="/register" className="rounded-lg border bg-white px-5 py-3">
          Створити аккаунт
        </Link>
      </div>
    </section>
  );
};

export default HomePageContent;
