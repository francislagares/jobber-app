import express, { Router } from 'express';

import { health } from '@order/controllers/health';

const router: Router = express.Router();

export const healthRoutes = (): Router => {
  router.get('/order-health', health);

  return router;
};
