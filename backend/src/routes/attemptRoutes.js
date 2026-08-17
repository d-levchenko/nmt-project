import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import {
  finishAttemptSchema,
  startAttemptSchema,
} from '../validations/attemptValidation.js';
import {
  finishAttempt,
  getMyHistory,
  startAttempt,
} from '../controllers/attemptController.js';

const attemptRouter = Router();
attemptRouter.use(authenticate);

attemptRouter.post('/start', validate(startAttemptSchema), startAttempt);
attemptRouter.post('/:id/finish', validate(finishAttemptSchema), finishAttempt);
attemptRouter.get('/me', getMyHistory);

export default attemptRouter;
