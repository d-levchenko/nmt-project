import { z } from 'zod';
import objectIdValidator from './objectIdValidator.js';

const questionSchema = z
  .object({
    text: z.string().trim().min(1).max(1000),
    answers: z.array(z.string().trim().min(1).max(500)).min(2).max(8),
    correctAnswerIndex: z.number().int().min(0),
  })
  .superRefine((question, ctx) => {
    if (question.correctAnswerIndex >= question.answers.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['correctAnswerIndex'],
        message: 'Invalid correct answer index.',
      });
    }
  });

export const createQuizSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(150),
    description: z.string().trim().max(1000).default(''),
    questions: z.array(questionSchema).min(1),
  }),
});

export const getAllQuizzesSchema = z.object({
  query: z.object({
    page: z.number().int().min(1).default(1),
    perPage: z.number().int().min(1).max(100).default(10),
    totalQuizzes: z.boolean().default(false),
    totalPages: z.number().int().min(1).default(1),
    quizzes: z.array(questionSchema).default([]),
  }),
});

export const getQuizByIdSchema = z.object({
  params: z.object({
    quizId: objectIdValidator,
  }),
});

export const deleteQuizByIdSchema = z.object({
  params: z.object({
    quizId: objectIdValidator,
  }),
});

export const updateQuizByIdSchema = z.object({
  params: z.object({
    quizId: objectIdValidator,
  }),
  body: z.object({
    title: z.string().trim().min(1).max(150).optional(),
    description: z.string().trim().max(1000).optional(),
    questions: z.array(questionSchema).optional(),
  }),
});
