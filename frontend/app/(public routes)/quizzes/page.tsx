'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getQuizzes } from '@/lib/api';

const Quizzes = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['quizzes'],
    queryFn: getQuizzes,
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Quizzes</h1>
        <p className="mt-2 text-slate-500">
          Choose a quiz and train at your own pace.
        </p>
      </div>
      {isLoading && <p>Loading quizzes…</p>}
      {error && <p className="text-red-600">Could not load quizzes.</p>}
      <div className="grid gap-5 md:grid-cols-2">
        {data?.map(quiz => (
          <article
            key={quiz.id}
            className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">{quiz.title}</h2>
            <p className="mt-2 line-clamp-3 text-slate-600">
              {quiz.description || 'No description.'}
            </p>
            <p className="mt-4 text-sm text-slate-500">
              {quiz.questionCount} questions
            </p>
            <Link
              href={`/quizzes/${quiz.id}`}
              className="mt-5 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
              View quiz
            </Link>
          </article>
        ))}
      </div>
      {data?.length === 0 && (
        <p className="text-slate-500">No quizzes have been created yet.</p>
      )}
    </main>
  );
};

export default Quizzes;
