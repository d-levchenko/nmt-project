export type QuestionType = 'boolean' | 'input' | 'checkbox';

export interface BooleanQuestion {
  questionText: string;
  type: 'boolean';
  correctAnswer: boolean;
}

export interface InputQuestion {
  questionText: string;
  type: 'input';
  correctAnswer: string;
}

export interface CheckboxQuestion {
  questionText: string;
  type: 'checkbox';
  options: string[];
  correctAnswer: string[];
}

export type Question = BooleanQuestion | InputQuestion | CheckboxQuestion;

export interface Quiz {
  _id: string;
  title: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedQuizzes {
  page: number;
  perPage: number;
  totalQuizzes: number;
  totalPages: number;
  quizzes: Quiz[];
}

export interface CreateQuizPayload {
  title: string;
  questions: Question[];
}
