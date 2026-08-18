import * as z from 'zod';
import objectIdValidator from './objectIdValidator.js';

export const startAttemptSchema = z.object({
  body: z.object({
    quizId: objectIdValidator,
    questionCount: z.coerce.number().int().min(1).max(1000),
  }),
});

export const finishAttemptSchema = z.object({
  params: z.object({ id: objectIdValidator }),
  body: z.object({
    answers: z
      .array(
        z.object({
          questionId: objectIdValidator,
          selectedAnswerIds: z.array(objectIdValidator).default([]),
          answerText: z.string().max(500).optional().default(''),
          answerTime: z.coerce.number().min(0).max(3600),
        }),
      )
      .min(1),
  }),
});

export const historySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(100).default(10),
  }),
});
