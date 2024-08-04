import express, { Router } from 'express';

import { health } from '@gig/controllers/health';

const router: Router = express.Router();

export const healthRoutes = (): Router => {
  router.get('/gig-health', health);

  return router;
};
