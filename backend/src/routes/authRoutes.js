import { Router } from 'express';
import {
  getUser,
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
} from '../controllers/authController.js';
import {
  loginUserSchema,
  registerUserSchema,
} from '../validations/authValidation.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';

const authRouter = Router();

authRouter.post('/register', validate(registerUserSchema), registerUser);
authRouter.post('/login', validate(loginUserSchema), loginUser);
authRouter.post('/logout', logoutUser);
authRouter.post('/refresh', refreshUserSession);
authRouter.get('/me', authenticate, getUser);

export default authRouter;
