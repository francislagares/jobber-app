import { create } from '@authentication/controllers/signup';
import { validateRequest } from '@authentication/middleware/validator';
import { signupSchema } from '@authentication/schemas/signup';
import express, { Router } from 'express';

const router: Router = express.Router();

export const authRoutes = () => {
  router.post('/signup', validateRequest(signupSchema), create);

  return router;
};
