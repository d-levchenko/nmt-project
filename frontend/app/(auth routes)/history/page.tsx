'use client';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getHistory } from '@/lib/api';
import Protected from '@/components/Protected/Protected';

const History = () => {
  return (
    <Protected>
      <HistoryContent />
    </Protected>
  );
};

function HistoryContent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['history'],
    queryFn: getHistory,
  });

  console.log(data);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-4xl font-bold">Історія тестів</h1>
      <p className="mt-2 text-slate-500">Ваші попередні завершені спроби.</p>
      {isLoading && <p className="mt-8">Завантаження історіі...</p>}
      {error && (
        <p className="mt-8 text-red-600">
          Не вдалося завантажити історію, спробуйте пізніше
        </p>
      )}
      {data && data.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-2xl border bg-white">
          <div className="divide-y">
            {data.map(item => (
              <Link
                key={item._id}
                href={`/quizzes/${item.quiz._id}`}
                className="grid gap-3 p-5 hover:bg-slate-50 sm:grid-cols-[2fr_repeat(3,1fr)]">
                <div>
                  <p className="font-semibold">{item.quiz.title}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Результат</p>
                  <p className="font-semibold">
                    {item.correctAnswers}/{item.totalQuestions} (
                    {item.percentage.toFixed(2)}%)
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Середній час</p>
                  <p className="font-semibold">
                    {item.averageAnswerTime.toFixed(2)}s
                  </p>
                </div>
                <div className="text-sm text-slate-500">
                  Переглянути результат →
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      {data?.length === 0 && (
        <p className="mt-8 text-slate-500">
          У вас поки немає завершених тестів.
        </p>
      )}
    </main>
  );
}

export default History;
