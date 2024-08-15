import express, { Router } from 'express';

import { Review } from '@gateway/controllers/review';
import { authMiddleware } from '@gateway/middleware/auth';

class ReviewRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    const reviewController = new Review();

    this.router.get(
      '/review/gig/:gigId',
      authMiddleware.checkAuthentication,
      reviewController.reviewsByGigId,
    );
    this.router.get(
      '/review/seller/:sellerId',
      authMiddleware.checkAuthentication,
      reviewController.reviewsBySellerId,
    );
    this.router.post(
      '/review',
      authMiddleware.checkAuthentication,
      reviewController.createReview,
    );
    return this.router;
  }
}

export const reviewRoutes: ReviewRoutes = new ReviewRoutes();
