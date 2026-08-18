import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import {
  createQuiz,
  deleteQuizById,
  getAllQuizzes,
  getQuizById,
  updateQuizById,
} from '../controllers/quizController.js';
import {
  createQuizSchema,
  deleteQuizByIdSchema,
  getAllQuizzesSchema,
  getQuizByIdSchema,
  updateQuizByIdSchema,
} from '../validations/quizValidation.js';
import { authenticate, authorize } from '../middleware/authenticate.js';

const quizRouter = Router();

quizRouter.get('/', validate(getAllQuizzesSchema), getAllQuizzes);
quizRouter.get('/:quizId', validate(getQuizByIdSchema), getQuizById);
quizRouter.delete(
  '/:quizId',
  authenticate,
  validate(deleteQuizByIdSchema),
  deleteQuizById,
);
quizRouter.post(
  '/',
  authenticate,
  authorize('teacher', 'admin'),
  validate(createQuizSchema),
  createQuiz,
);
quizRouter.patch(
  '/:quizId',
  authenticate,
  validate(updateQuizByIdSchema),
  updateQuizById,
);

export default quizRouter;
