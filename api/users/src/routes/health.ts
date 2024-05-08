import express, { Router } from 'express';

const router: Router = express.Router();

export const healthRoutes = (): Router => {
  router.get('/user-health', () => console.log('TODO route'));

  return router;
};
