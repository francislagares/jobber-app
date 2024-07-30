import express, { Router } from 'express';

import {
  getCurrentUsername,
  getEmail,
  getUsername,
} from '@users/controllers/buyer/get';

const router: Router = express.Router();

export const buyerRoutes = (): Router => {
  router.get('/email', getEmail);
  router.get('/username', getCurrentUsername);
  router.get('/:username', getUsername);

  return router;
};
