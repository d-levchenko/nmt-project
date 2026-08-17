'use client';

import { useState } from 'react';
import Link from 'next/link';
import { deleteQuiz } from '@/lib/quizApi';
import type { Quiz } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import css from './QuizList.module.css';

interface Props {
  initialQuizzes: Quiz[];
}

const QuizList = ({ initialQuizzes }: Props) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteQuiz,

    onMutate: id => {
      setDeletingId(id);
      setError(null);
    },

    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(
        ['quizzes'],
        (old: { quizzes: Quiz[] } | undefined) =>
          old && {
            ...old,
            quizzes: old.quizzes.filter(quiz => quiz._id !== deletedId),
          },
      );
    },

    onError: () => {
      setError('Could not delete that quiz. Try again.');
    },

    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleDelete = (id: string) => {
    mutation.mutate(id);
  };

  if (initialQuizzes.length === 0) {
    return (
      <p>
        No quizzes yet. <Link href="/create">Create one</Link>.
      </p>
    );
  }

  return (
    <>
      {error && <p className={css.error}>{error}</p>}

      <ul className={css.list}>
        {initialQuizzes.map(quiz => (
          <li key={quiz._id} className={css.card}>
            <Link href={`/quizzes/${quiz._id}`} className={css.link}>
              <h2 className={css.title}>{quiz.title}</h2>

              <p className={css.count}>
                {quiz.questions.length}{' '}
                {quiz.questions.length === 1 ? 'question' : 'questions'}
              </p>
            </Link>

            <button
              type="button"
              className={css.deleteButton}
              aria-label={`Delete ${quiz.title}`}
              disabled={deletingId === quiz._id}
              onClick={() => handleDelete(quiz._id)}>
              {deletingId === quiz._id ? 'Deleting...' : '🗑'}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default QuizList;
