import type { QuestionType } from '@/types';

export type QuestionFormValues =
  | { type: 'boolean'; questionText: string; correctAnswerBoolean: boolean }
  | { type: 'input'; questionText: string; correctAnswerText: string }
  | {
      type: 'checkbox';
      questionText: string;
      options: string[];
      correctAnswerCheckboxIndexes: number[];
    };

export interface QuizFormValues {
  title: string;
  description: string;
  questions: QuestionFormValues[];
}

export const createEmptyQuestion = (type: QuestionType): QuestionFormValues =>
  type === 'boolean'
    ? { type, questionText: '', correctAnswerBoolean: true }
    : type === 'input'
      ? { type, questionText: '', correctAnswerText: '' }
      : {
          type,
          questionText: '',
          options: ['', ''],
          correctAnswerCheckboxIndexes: [],
        };

export const toCreateQuizPayload = (values: QuizFormValues) => values;
