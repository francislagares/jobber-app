import { signIn } from '@authentication/controllers/signin';
import { signUp } from '@authentication/controllers/signup';
import { verifyEmail } from '@authentication/controllers/verify-email';
import { validateRequest } from '@authentication/middleware/validator';
import { loginSchema } from '@authentication/schemas/signin';
import { signupSchema } from '@authentication/schemas/signup';
import express, { Router } from 'express';

const router: Router = express.Router();

export const authRoutes = () => {
  router.post('/signup', validateRequest(signupSchema), signUp);
  router.post('/signin', validateRequest(loginSchema), signIn);
  router.post('/verify-email', verifyEmail);

  return router;
};
