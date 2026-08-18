'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import Protected from '@/components/Protected/Protected';
import { finishAttempt, getQuiz, startAttempt } from '@/lib/api';
import type { AttemptResult, QuizQuestion } from '@/types';
import { getApiError } from '@/lib/error';

interface DraftAnswer {
  selectedAnswerIds: string[];
  answerText: string;
  answerTime: number;
}

const RunQuizPage = () => {
  return (
    <Protected>
      <Runner />
    </Protected>
  );
};

function Runner() {
  const params = useSearchParams();
  const quizId = params.get('quizId') || '';

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => getQuiz(quizId),
    enabled: !!quizId,
  });

  const [count, setCount] = useState(5);
  const [attempt, setAttempt] = useState<{
    id: string;
    quizTitle: string;
    questions: QuizQuestion[];
  } | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, DraftAnswer>>({});
  const [startedAt, setStartedAt] = useState<number>(0);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [error, setError] = useState('');

  const start = useMutation({
    mutationFn: () => startAttempt({ quizId, questionCount: count }),
    onSuccess: data => {
      setAttempt(data);
      setCurrent(0);
      setAnswers({});
      setResult(null);
      setStartedAt(Date.now());
    },
    onError: e => setError(getApiError(e)),
  });

  const finish = useMutation({
    mutationFn: (
      payload: {
        questionId: string;
        selectedAnswerIds: string[];
        answerText?: string;
        answerTime: number;
      }[],
    ) => finishAttempt(attempt!.id, payload),
    onSuccess: setResult,
    onError: e => setError(getApiError(e)),
  });

  const question = attempt?.questions[current];
  const currentDraft = question ? answers[question.id] : undefined;

  const setDraft = (draft: Partial<DraftAnswer>) => {
    if (!question) return;
    setAnswers(prev => ({
      ...prev,
      [question.id]: {
        selectedAnswerIds: prev[question.id]?.selectedAnswerIds ?? [],
        answerText: prev[question.id]?.answerText ?? '',
        answerTime: prev[question.id]?.answerTime ?? 0,
        ...draft,
      },
    }));
  };

  const answerReady = question
    ? question.type === 'input'
      ? (currentDraft?.answerText.trim().length ?? 0) > 0
      : (currentDraft?.selectedAnswerIds.length ?? 0) > 0
    : false;

  const goNext = () => {
    if (!question || !answerReady) return;
    const elapsed = Number(((Date.now() - startedAt) / 1000).toFixed(2));
    const finalDraft = {
      selectedAnswerIds: currentDraft?.selectedAnswerIds ?? [],
      answerText: currentDraft?.answerText ?? '',
      answerTime: elapsed,
    };

    const nextAnswers = { ...answers, [question.id]: finalDraft };
    setAnswers(nextAnswers);

    if (current === attempt!.questions.length - 1) {
      finish.mutate(
        attempt!.questions.map(q => {
          const a = nextAnswers[q.id] ?? {
            selectedAnswerIds: [],
            answerText: '',
            answerTime: 0,
          };
          return { questionId: q.id, ...a };
        }),
      );
    } else {
      setCurrent(v => v + 1);
      setStartedAt(Date.now());
    }
  };

  if (!quizId)
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">Select a quiz first.</main>
    );

  if (isLoading || !quiz)
    return <main className="mx-auto max-w-3xl px-4 py-12">Loading…</main>;

  if (result) return <Result result={result} />;

  if (!attempt)
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-2xl border bg-white p-7 shadow-sm">
          <p className="text-sm uppercase tracking-wider text-slate-500">
            Training mode
          </p>
          <h1 className="mt-2 text-4xl font-bold">{quiz.title}</h1>
          <p className="mt-3 text-slate-600">
            Choose how many questions you want to answer.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {[1, 5, 10, 15, quiz.questionCount]
              .filter(
                (v, i, a) => v <= quiz.questionCount && a.indexOf(v) === i,
              )
              .map(v => (
                <button
                  key={v}
                  onClick={() => setCount(v)}
                  className={`rounded-lg border px-4 py-2 ${count === v ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                  {v}
                </button>
              ))}
          </div>
          <label className="mt-5 block text-sm">
            Number of questions
            <input
              type="number"
              min={1}
              max={quiz.questionCount}
              value={count}
              onChange={e =>
                setCount(
                  Math.min(
                    quiz.questionCount,
                    Math.max(1, Number(e.target.value)),
                  ),
                )
              }
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </label>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <button
            onClick={() => start.mutate()}
            disabled={start.isPending}
            className="mt-6 rounded-lg bg-slate-900 px-5 py-3 font-medium text-white">
            {start.isPending ? 'Starting…' : 'Start training'}
          </button>
        </div>
      </main>
    );
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-5 flex items-center justify-between text-sm text-slate-500">
        <span>
          Question {current + 1} of {attempt.questions.length}
        </span>
        <span>{Math.round((current / attempt.questions.length) * 100)}%</span>
      </div>
      <div className="rounded-2xl border bg-white p-7 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {question?.type}
        </p>
        <h1 className="mt-2 text-2xl font-bold">{question?.text}</h1>
        {question?.type === 'input' ? (
          <input
            autoFocus
            value={currentDraft?.answerText ?? ''}
            onChange={e => setDraft({ answerText: e.target.value })}
            className="mt-7 w-full rounded-lg border px-4 py-3"
            placeholder="Type your answer"
          />
        ) : (
          <div className="mt-7 space-y-3">
            {question?.answers.map(answer => (
              <label
                key={answer.id}
                className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 hover:bg-slate-50">
                <input
                  type={question.type === 'checkbox' ? 'checkbox' : 'radio'}
                  name={question.id}
                  checked={
                    currentDraft?.selectedAnswerIds.includes(answer.id) ?? false
                  }
                  onChange={e => {
                    const currentIds = currentDraft?.selectedAnswerIds ?? [];
                    setDraft({
                      selectedAnswerIds: e.target.checked
                        ? question.type === 'checkbox'
                          ? [...currentIds, answer.id]
                          : [answer.id]
                        : currentIds.filter(id => id !== answer.id),
                    });
                  }}
                />
                <span>{answer.text}</span>
              </label>
            ))}
          </div>
        )}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        <button
          disabled={!answerReady || finish.isPending}
          onClick={goNext}
          className="mt-7 rounded-lg bg-slate-900 px-5 py-3 font-medium text-white">
          {finish.isPending
            ? 'Submitting…'
            : current === attempt.questions.length - 1
              ? 'Finish quiz'
              : 'Next question'}
        </button>
      </div>
    </main>
  );
}

function Result({ result }: { result: AttemptResult }) {
  const router = useRouter();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-2xl border bg-white p-7 shadow-sm">
        <p className="text-sm uppercase tracking-wider text-slate-500">
          Quiz complete
        </p>
        <h1 className="mt-2 text-4xl font-bold">{result.quizTitle}</h1>
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <Stat
            label="Score"
            value={`${result.correctAnswers}/${result.totalQuestions} (${result.percentage}%)`}
            extra={
              result.scorePercentile === null
                ? 'First attempt'
                : `Better than ${result.scorePercentile}%`
            }
          />
          <Stat
            label="Average answer time"
            value={`${result.averageAnswerTime}s`}
            extra={
              result.timePercentile === null
                ? 'First attempt'
                : `Faster than ${result.timePercentile}%`
            }
          />
          <Stat
            label="Questions"
            value={String(result.totalQuestions)}
            extra="Training session"
          />
        </div>
      </div>

      <section className="mt-8 space-y-4">
        <h2 className="text-2xl font-bold">Answers</h2>
        {result.answers.map((a, i) => (
          <article
            key={a.questionId}
            className={`rounded-xl border p-5 ${a.correct ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex justify-between gap-4">
              <p className="font-semibold">
                {i + 1}. {a.questionText}
              </p>
              <span className="text-sm">{a.answerTime}s</span>
            </div>
            <p className="mt-2 text-sm">
              {a.correct ? 'Correct' : 'Incorrect'}
            </p>
            <p className="mt-2 text-sm">
              Correct answer:{' '}
              <strong>
                {a.type === 'input'
                  ? a.correctAnswerText
                  : a.correctAnswerTexts.join(', ')}
              </strong>
            </p>
            {a.type !== 'input' && (
              <p className="mt-1 text-sm text-slate-600">
                Selected:{' '}
                {a.selectedAnswerTexts.length
                  ? a.selectedAnswerTexts.join(', ')
                  : 'No answer'}
              </p>
            )}
          </article>
        ))}
      </section>
      <button
        onClick={() => router.push(`/quizzes/${result.quizId}`)}
        className="mt-7 rounded-lg border bg-white px-5 py-3">
        Back to quiz
      </button>
    </main>
  );
}

function Stat({
  label,
  value,
  extra,
}: {
  label: string;
  value: string;
  extra: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{extra}</p>
    </div>
  );
}

export default RunQuizPage;
