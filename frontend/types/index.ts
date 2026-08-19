export type Role = 'student' | 'teacher' | 'admin';

export type QuestionType = 'boolean' | 'input' | 'checkbox';

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
}

export interface Answer {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  text: string;
  answers: Answer[];
}

export interface QuizSummary {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  createdAt: string;
}

export interface QuizDetails extends QuizSummary {
  questions: QuizQuestion[];
}

export interface AttemptResultAnswer {
  questionId: string;
  questionText: string;
  type: QuestionType;
  selectedAnswerIds: string[];
  answerText: string;
  correctAnswerIds: string[];
  correctAnswerText: string;
  correctAnswerTexts: string[];
  selectedAnswerTexts: string[];
  correct: boolean;
  answerTime: number;
}

export interface AttemptResult {
  attemptId: string;
  quizId: string;
  quizTitle: string;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  averageAnswerTime: number;
  scorePercentile: number | null;
  timePercentile: number | null;
  answers: AttemptResultAnswer[];
}

export interface HistoryItem {
  _id: string;
  quiz: {
    _id: string;
    title: string;
  };
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  averageAnswerTime: number;
  createdAt: string;
  completedAt: string;
  totalTime: number;
}
