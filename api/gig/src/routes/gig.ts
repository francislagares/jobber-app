import express, { Router } from 'express';

import { validateRequest } from '@francislagares/jobber-shared';

import { create as createGig } from '@gig/controllers/gig/create';
import { gigDelete } from '@gig/controllers/gig/delete';
import {
  gigById,
  sellerGigs,
  sellerInactiveGigs,
} from '@gig/controllers/gig/get';
import { gigUpdate, gigUpdateActive } from '@gig/controllers/gig/update';
import { gigCreateSchema, gigUpdateSchema } from '@gig/schemes/gig';

const router: Router = express.Router();

const gigRoutes = (): Router => {
  router.get('/:gigId', gigById);
  router.get('/seller/:sellerId', sellerGigs);
  router.get('/seller/pause/:sellerId', sellerInactiveGigs);
  router.post('/create', validateRequest(gigCreateSchema), createGig);
  router.put('/:gigId', validateRequest(gigUpdateSchema), gigUpdate);
  router.put(
    '/active/:gigId',
    validateRequest(gigUpdateSchema),
    gigUpdateActive,
  );
  router.delete('/:gigId/:sellerId', gigDelete);

  return router;
};

export { gigRoutes };
