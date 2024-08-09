import express, { Router } from 'express';

import { validateRequest } from '@francislagares/jobber-shared';

import { create as createGig } from '@gig/controllers/gig/create';
import { gigDelete } from '@gig/controllers/gig/delete';
import {
  gigById,
  gigsByCategory,
  moreLikeThis,
  sellerGigs,
  sellerInactiveGigs,
  topRatedGigsByCategory,
} from '@gig/controllers/gig/get';
import { searchGigs } from '@gig/controllers/gig/search';
import { gigUpdate, gigUpdateActive } from '@gig/controllers/gig/update';
import { gigCreateSchema, gigUpdateSchema } from '@gig/schemes/gig';

const router: Router = express.Router();

const gigRoutes = (): Router => {
  router.get('/:gigId', gigById);
  router.get('/seller/:sellerId', sellerGigs);
  router.get('/seller/pause/:sellerId', sellerInactiveGigs);
  router.get('/search/:from/:size/:type', searchGigs);
  router.get('/category/:username', gigsByCategory);
  router.get('/top/:username', topRatedGigsByCategory);
  router.get('/similar/:gigId', moreLikeThis);
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
