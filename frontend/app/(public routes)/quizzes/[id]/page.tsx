'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getQuiz } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const QuizDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore(s => s.user);
  const { data, isLoading, error } = useQuery({
    queryKey: ['quiz', id],
    queryFn: () => getQuiz(id),
    enabled: !!id,
  });

  if (isLoading)
    return <main className="mx-auto max-w-4xl px-4 py-10">Loading quiz…</main>;

  if (error || !data)
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-red-600">Quiz not found.</p>
      </main>
    );

  const runHref = user
    ? `/run-quiz?quizId=${data.id}`
    : `/login?next=${encodeURIComponent(`/run-quiz?quizId=${data.id}`)}`;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-2xl border bg-white p-7 shadow-sm">
        <h1 className="text-4xl font-bold">{data.title}</h1>
        <p className="mt-3 text-slate-600">{data.description}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            {data.questionCount} questions
          </span>
          <Link
            href={runHref}
            className="rounded-lg bg-slate-900 px-5 py-3 font-medium text-white">
            Train this quiz
          </Link>
        </div>
      </div>
      <section className="mt-8 space-y-4">
        <h2 className="text-2xl font-bold">Questions</h2>
        {data.questions.map((q, i) => (
          <article key={q.id} className="rounded-xl border bg-white p-5">
            <p className="font-medium">
              {i + 1}. {q.text}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
              {q.type}
            </p>
            {q.answers.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm text-slate-600">
                {q.answers.map(a => (
                  <li key={a.id}>• {a.text}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </section>
    </main>
  );
};

export default QuizDetailsPage;
