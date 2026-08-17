import * as z from 'zod';
import { isValidObjectId } from 'mongoose';

const objectIdValidator = z
  .string()
  .refine(value => isValidObjectId(value), { message: 'Invalid ObjectId' });

export default objectIdValidator;
