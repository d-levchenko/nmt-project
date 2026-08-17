export type Role = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface QuizSummary {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  answers: { id: string; text: string }[];
}

export interface QuizDetails extends QuizSummary {
  questions: QuizQuestion[];
}

export type RunQuestion = QuizQuestion;

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
  answers: {
    questionId: string;
    questionText: string;
    selectedAnswerId: string;
    correctAnswerId: string;
    correctAnswerText: string;
    correct: boolean;
    answerTime: number;
  }[];
}

export interface HistoryItem {
  id: string;
  quizId: string;
  quizTitle: string;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  averageAnswerTime: number;
  createdAt: string;
}
