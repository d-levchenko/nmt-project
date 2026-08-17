import { apiClient } from './apiClient';
import type { CreateQuizPayload, PaginatedQuizzes, Quiz } from '@/types/quiz';

export const createQuiz = async (payload: CreateQuizPayload) => {
  const { data } = await apiClient.post<Quiz>('/quizzes', payload);

  return data;
};

export const getQuizzes = async (page = 1, perPage = 10) => {
  const { data } = await apiClient.get<PaginatedQuizzes>('/quizzes', {
    params: {
      page,
      perPage,
    },
  });

  return data;
};

export const getQuizById = async (quizId: string) => {
  const { data } = await apiClient.get<Quiz>(`/quizzes/${quizId}`);

  return data;
};

export const deleteQuiz = async (quizId: string) => {
  const { data } = await apiClient.delete<Quiz>(`/quizzes/${quizId}`);

  return data;
};
