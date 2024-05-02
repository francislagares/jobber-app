import express, { Router } from 'express';

import {
  getCurrentUser,
  resendEmail,
} from '@authentication/controllers/current-user';
import {
  forgotPassword,
  resetPassword,
} from '@authentication/controllers/password';
import { refreshToken } from '@authentication/controllers/refresh-token';
import { signIn } from '@authentication/controllers/signin';
import { signUp } from '@authentication/controllers/signup';
import { verifyEmail } from '@authentication/controllers/verify-email';
import { validateRequest } from '@authentication/middleware/validator';
import {
  changePasswordSchema,
  emailSchema,
} from '@authentication/schemas/password';
import { loginSchema } from '@authentication/schemas/signin';
import { signupSchema } from '@authentication/schemas/signup';

const router: Router = express.Router();

export const authRoutes = () => {
  router.post('/signup', validateRequest(signupSchema), signUp);
  router.post('/signin', validateRequest(loginSchema), signIn);
  router.get('/refresh-token/:username', refreshToken);
  router.get('/current-user', getCurrentUser);
  router.post('/resend-email', resendEmail);
  router.put('/verify-email', verifyEmail);
  router.put('/forgot-password', validateRequest(emailSchema), forgotPassword);
  router.put(
    '/reset-password/:token',
    validateRequest(changePasswordSchema),
    resetPassword,
  );

  return router;
};
