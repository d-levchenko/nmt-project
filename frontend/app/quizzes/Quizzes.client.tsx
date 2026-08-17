'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { getQuizzes } from '@/lib/quizApi';
import QuizList from '@/components/QuizList/QuizList';

import css from './QuizzesClient.module.css';
import Loader from '@/components/Loader/Loader';
import ErrorComponent from '@/components/ErrorComponent/ErrorComponent';

const QuizzesClient = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['quizzes'],
    queryFn: () => getQuizzes(),
  });

  const quizzes = data?.quizzes ?? [];

  return (
    <main className={css.page}>
      {isPending && <Loader />}
      {isError && <ErrorComponent />}
      <div className={css.header}>
        <div>
          <h1 className={css.title}>Quizzes</h1>

          <p className={css.subtitle}>
            {quizzes.length > 0
              ? `${quizzes.length} ${quizzes.length === 1 ? 'quiz' : 'quizzes'}`
              : 'No quizzes yet. Create one.'}
          </p>
        </div>

        <Link href="/create" className={css.button}>
          + New quiz
        </Link>
      </div>

      {quizzes.length > 0 && <QuizList initialQuizzes={quizzes} />}
    </main>
  );
};

export default QuizzesClient;
