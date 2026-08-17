import * as z from 'zod';
import objectIdValidator from './objectIdValidator.js';

export const startAttemptSchema = z.object({
  quizId: objectIdValidator,
  questionCount: z.number().int().min(1).max(1000),
});

export const finishAttemptSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: objectIdValidator,
        selectedAnswerId: objectIdValidator,
        answerTime: z.number().min(0).max(3600),
      }),
    )
    .min(1),
});

export const getMyHistorySchema = z.object({
  query: z.object({
    page: z.number().int().min(1).default(1),
    perPage: z.number().int().min(1).max(100).default(10),
    totalPages: z.number().int().min(1).default(1),
    totalAttempts: z.number().int().min(0).default(0),
    attempts: z.array(z.any()).default([]),
  }),
});
