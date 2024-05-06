import express, { Router } from 'express';

import {
  searchGigById,
  searchGigs,
} from '@authentication/controllers/search-gigs';

const router: Router = express.Router();

export const searchRoutes = () => {
  router.get('/search/gig/:from/:size/:type', searchGigs);
  router.get('/search/gig/:gigId', searchGigById);

  return router;
};
