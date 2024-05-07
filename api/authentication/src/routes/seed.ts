import express, { Router } from 'express';

import { createUsers } from '@authentication/controllers/seeds';

const router: Router = express.Router();

export function seedRoutes(): Router {
  router.post('/seed/:count', createUsers);

  return router;
}
