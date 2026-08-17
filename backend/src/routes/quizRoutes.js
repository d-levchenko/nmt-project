import { celebrate } from 'celebrate';
import { Router } from 'express';
import {
  createQuiz,
  deleteQuizById,
  getAllQuizzes,
  getQuizById,
} from '../controllers/quizController.js';
import {
  createQuizSchema,
  getAllQuizzesSchema,
  quizIdSchema,
} from '../validations/quizValidation.js';

const quizRouter = Router();

quizRouter.get('/quizzes', celebrate(getAllQuizzesSchema), getAllQuizzes);
quizRouter.get('/quizzes/:quizId', celebrate(quizIdSchema), getQuizById);
quizRouter.post('/quizzes', celebrate(createQuizSchema), createQuiz);
quizRouter.delete('/quizzes/:quizId', celebrate(quizIdSchema), deleteQuizById);

export default quizRouter;
