import express, { Router } from 'express';

import { Review } from '@review/controllers';

const router: Router = express.Router();

const reviewRoutes = (): Router => {
  const reviewController = new Review();

  router.get('/gig/:gigId', reviewController.getReviewsByGigId);
  router.get('/seller/:sellerId', reviewController.getReviewsBySellerId);

  router.post('/', reviewController.createReview);

  return router;
};

export { reviewRoutes };
