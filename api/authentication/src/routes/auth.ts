import { create } from '@authentication/controllers/signup';
import { validateRequest } from '@authentication/middleware/validator';
import express, { Router } from 'express';

const router: Router = express.Router();

export const authRoutes = () => {
  router.post('/signup', validateRequest, create);

  return router;
};
