import express, { Router } from 'express';

import { health } from '@review/controllers/health';

const router: Router = express.Router();

export const healthRoutes = (): Router => {
  router.get('/review-health', health);

  return router;
};
