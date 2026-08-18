import { z } from 'zod';
import objectIdValidator from './objectIdValidator.js';

const baseQuestion = z.object({
  questionText: z.string().trim().min(5).max(1000),
});

const booleanQuestion = baseQuestion.extend({
  type: z.literal('boolean'),
  correctAnswerBoolean: z.boolean(),
});

const inputQuestion = baseQuestion.extend({
  type: z.literal('input'),
  correctAnswerText: z.string().trim().min(1).max(500),
});

const checkboxQuestion = baseQuestion
  .extend({
    type: z.literal('checkbox'),
    options: z.array(z.string().trim().min(1).max(500)).min(2).max(8),
    correctAnswerCheckboxIndexes: z.array(z.number().int().min(0)).min(1),
  })
  .superRefine((question, ctx) => {
    const unique = new Set(question.correctAnswerCheckboxIndexes);
    if (unique.size !== question.correctAnswerCheckboxIndexes.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['correctAnswerCheckboxIndexes'],
        message: 'Correct options must be unique.',
      });
    }
    for (const index of unique) {
      if (index >= question.options.length) {
        ctx.addIssue({
          code: 'custom',
          path: ['correctAnswerCheckboxIndexes'],
          message: 'Invalid correct option.',
        });
        break;
      }
    }
  });

export const questionSchema = z.discriminatedUnion('type', [
  booleanQuestion,
  inputQuestion,
  checkboxQuestion,
]);

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
  body: z
    .object({
      title: z.string().trim().min(1).max(150).optional(),
      description: z.string().trim().max(1000).optional(),
      questions: z.array(questionSchema).optional(),
    })
    .refine(
      value => Object.keys(value).length > 0,
      'At least one field must be updated.',
    ),
});
