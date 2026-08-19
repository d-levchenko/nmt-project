import { apiClient } from './apiClient';
import type {
  AttemptResult,
  HistoryItem,
  QuizDetails,
  QuizSummary,
  User,
} from '@/types';

interface SessionResponse {
  success: boolean;
}

export const getMe = async () => {
  const { data } = await apiClient.get<{ user: User }>('/auth/me');

  return data.user;
};

export const loginUser = async (payload: {
  email: string;
  password: string;
}) => {
  const { data } = await apiClient.post<{ user: User }>('/auth/login', payload);

  return data.user;
};

export const registerUser = async (payload: {
  username: string;
  email: string;
  password: string;
}) => {
  const { data } = await apiClient.post<{ user: User }>(
    '/auth/register',
    payload,
  );

  return data.user;
};

export const logoutUser = async () => {
  await apiClient.post('/auth/logout');
};

export const refreshUserSession = async (): Promise<boolean> => {
  const response = await apiClient.post<SessionResponse>('/auth/refresh');

  return response.data.success;
};

export const getQuizzes = async () => {
  const { data } = await apiClient.get<{ quizzes: QuizSummary[] }>('/quizzes');

  return data.quizzes;
};

export const getQuiz = async (id: string) => {
  const { data } = await apiClient.get<{ quiz: QuizDetails }>(`/quizzes/${id}`);

  return data.quiz;
};

export const createQuiz = async (payload: unknown) => {
  const { data } = await apiClient.post<{ quiz: QuizSummary }>(
    '/quizzes',
    payload,
  );

  return data.quiz;
};

export const startAttempt = async (payload: {
  quizId: string;
  questionCount: number;
}) => {
  const { data } = await apiClient.post('/quiz-attempts/start', payload);

  return data.attempt as {
    id: string;
    quizId: string;
    quizTitle: string;
    questions: QuizDetails['questions'];
  };
};

export const finishAttempt = async (
  id: string,
  answers: {
    questionId: string;
    selectedAnswerIds: string[];
    answerText?: string;
    answerTime: number;
  }[],
) => {
  const { data } = await apiClient.post<{ result: AttemptResult }>(
    `/quiz-attempts/${id}/finish`,
    { answers },
  );

  return data.result;
};

export const getHistory = async () => {
  const { data } = await apiClient.get<{ attempts: HistoryItem[] }>(
    '/quiz-attempts/me',
  );

  return data.attempts;
};
