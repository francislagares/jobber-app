import express, { Router } from 'express';

import { health } from '@chat/controllers/health';

const router: Router = express.Router();

export const healthRoutes = (): Router => {
  router.get('/chat-health', health);

  return router;
};
