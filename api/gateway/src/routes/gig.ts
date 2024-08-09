import express, { Router } from 'express';

import { Gig } from '@gateway/controllers/gig';
import { authMiddleware } from '@gateway/middleware/auth';

class GigRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    const gigController = new Gig();

    this.router.get(
      '/gig/:gigId',
      authMiddleware.checkAuthentication,
      gigController.gigById,
    );
    this.router.get(
      '/gig/seller/:sellerId',
      authMiddleware.checkAuthentication,
      gigController.getSellerGigs,
    );
    this.router.get(
      '/gig/seller/pause/:sellerId',
      authMiddleware.checkAuthentication,
      gigController.getSellerPauedGigs,
    );
    this.router.get(
      '/gig/search/:from/:size/:type',
      authMiddleware.checkAuthentication,
      gigController.searchGigs,
    );
    this.router.get(
      '/gig/category/:username',
      authMiddleware.checkAuthentication,
      gigController.getGigsByCategory,
    );
    this.router.get(
      '/gig/top/:username',
      authMiddleware.checkAuthentication,
      gigController.getTopRatedGigsByCategory,
    );
    this.router.get(
      '/gig/similar/:gigId',
      authMiddleware.checkAuthentication,
      gigController.getMoreGigsLikeThis,
    );
    this.router.post(
      '/gig/create',
      authMiddleware.checkAuthentication,
      gigController.createGig,
    );
    this.router.put(
      '/gig/:gigId',
      authMiddleware.checkAuthentication,
      gigController.updateGig,
    );
    this.router.put(
      '/gig/active/:gigId',
      authMiddleware.checkAuthentication,
      gigController.updateGigActive,
    );
    this.router.post(
      '/gig/seed/:count',
      authMiddleware.checkAuthentication,
      gigController.seedGig,
    );
    this.router.delete(
      '/gig/:gigId/:sellerId',
      authMiddleware.checkAuthentication,
      gigController.deleteGig,
    );

    return this.router;
  }
}

export const gigRoutes: GigRoutes = new GigRoutes();
