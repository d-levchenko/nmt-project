import type { CreateQuizPayload, Question, QuestionType } from './quiz';

export interface QuestionFormValues {
  questionText: string;
  type: QuestionType;
  options: string[]; // checkbox only
  correctAnswerBoolean: boolean;
  correctAnswerText: string;
  correctAnswerCheckboxIndexes: number[];
}

export interface QuizFormValues {
  title: string;
  questions: QuestionFormValues[];
}

export function createEmptyQuestion(type: QuestionType): QuestionFormValues {
  return {
    questionText: '',
    type,
    options: type === 'checkbox' ? ['', ''] : [],
    correctAnswerBoolean: true,
    correctAnswerText: '',
    correctAnswerCheckboxIndexes: [],
  };
}

export const toCreateQuizPayload = (
  values: QuizFormValues,
): CreateQuizPayload => {
  return {
    title: values.title.trim(),
    questions: values.questions.map((q): Question => {
      if (q.type === 'boolean') {
        return {
          questionText: q.questionText.trim(),
          type: 'boolean',
          correctAnswer: q.correctAnswerBoolean,
        };
      }

      if (q.type === 'input') {
        return {
          questionText: q.questionText.trim(),
          type: 'input',
          correctAnswer: q.correctAnswerText.trim(),
        };
      }

      const options = q.options.map(option => option.trim());
      const correctAnswer = q.correctAnswerCheckboxIndexes.map(
        index => options[index],
      );

      return {
        questionText: q.questionText.trim(),
        type: 'checkbox',
        options,
        correctAnswer,
      };
    }),
  };
};
