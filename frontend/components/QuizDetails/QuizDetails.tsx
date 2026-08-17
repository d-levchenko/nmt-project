'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteQuiz } from '@/lib/quizApi';
import type { Question, Quiz } from '@/types';

import css from './QuizDetails.module.css';

type Props = {
  quizId: string;
  question: Question;
};

const QuizDetails = ({ quizId, question }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => deleteQuiz(quizId),

    onSuccess: () => {
      queryClient.setQueryData(
        ['quizzes'],
        (old: { quizzes: Quiz[] } | undefined) =>
          old && {
            ...old,
            quizzes: old.quizzes.filter(quiz => quiz._id !== quizId),
          },
      );

      router.push('/quizzes');
    },

    onError: () => {
      setError('Could not delete quiz.');
    },
  });

  return (
    <article className={css.card}>
      <div className={css.header}>
        <h2 className={css.question}>{question.questionText}</h2>

        <span className={css.badge}>{question.type}</span>
      </div>

      {question.type === 'boolean' && (
        <div className={css.answer}>
          <span className={css.label}>Correct answer</span>
          <strong>{question.correctAnswer ? 'True' : 'False'}</strong>
        </div>
      )}

      {question.type === 'input' && (
        <div className={css.answer}>
          <span className={css.label}>Correct answer</span>
          <strong>{question.correctAnswer}</strong>
        </div>
      )}

      {question.type === 'checkbox' && (
        <ul className={css.optionList}>
          {question.options.map(option => {
            const isCorrect = question.correctAnswer.includes(option);

            return (
              <li
                key={option}
                className={isCorrect ? css.correctOption : css.option}>
                <span>{option}</span>

                {isCorrect && <span className={css.checkmark}>✓</span>}
              </li>
            );
          })}
        </ul>
      )}

      {error && <p className={css.error}>{error}</p>}

      <button
        type="button"
        className={css.deleteButton}
        disabled={mutation.isPending}
        onClick={() => mutation.mutate()}>
        {mutation.isPending ? 'Deleting...' : 'Delete quiz'}
      </button>
    </article>
  );
};

export default QuizDetails;
