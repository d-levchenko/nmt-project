import * as z from 'zod';

export const registerUserSchema = z.object({
  body: z.object({
    username: z.string().trim().min(2).max(60),
    email: z.string().trim().email(),
    password: z.string().min(8).max(100),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(8).max(100),
  }),
});
