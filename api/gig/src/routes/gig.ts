import express, { Router } from 'express';

import { validateRequest } from '@francislagares/jobber-shared';

import { create as createGig } from '@gig/controllers/gig/create';
import { gigUpdate, gigUpdateActive } from '@gig/controllers/gig/update';
import { gigCreateSchema, gigUpdateSchema } from '@gig/schemes/gig';

const router: Router = express.Router();

const gigRoutes = (): Router => {
  router.post('/create', validateRequest(gigCreateSchema), createGig);
  router.put('/:gigId', validateRequest(gigUpdateSchema), gigUpdate);
  router.put(
    '/active/:gigId',
    validateRequest(gigUpdateSchema),
    gigUpdateActive,
  );

  return router;
};

export { gigRoutes };
