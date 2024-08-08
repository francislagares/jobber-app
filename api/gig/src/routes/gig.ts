import express, { Router } from 'express';

import { validateRequest } from '@francislagares/jobber-shared';

import { create as createGig } from '@gig/controllers/gig/create';
import { gigCreateSchema } from '@gig/schemes/gig';

const router: Router = express.Router();

const gigRoutes = (): Router => {
  router.post('/create', validateRequest(gigCreateSchema), createGig);

  return router;
};

export { gigRoutes };
