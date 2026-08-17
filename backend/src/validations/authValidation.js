import * as z from 'zod';

export const registerUserSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().trim().email(),
  password: z.string().min(8).max(100),
});

export const loginUserSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});
