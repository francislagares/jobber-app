import express, { Router } from 'express';

import { Seller } from '@gateway/controllers/users/seller';
import { authMiddleware } from '@gateway/middleware/auth';

class SellerRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    const sellerController = new Seller();

    this.router.get(
      '/seller/id/:sellerId',
      authMiddleware.checkAuthentication,
      sellerController.getSellerById,
    );
    this.router.get(
      '/seller/username/:username',
      authMiddleware.checkAuthentication,
      sellerController.getSellerByUsername,
    );
    this.router.get(
      '/seller/random/:size',
      authMiddleware.checkAuthentication,
      sellerController.getRandomSellers,
    );
    this.router.post(
      '/seller/create',
      authMiddleware.checkAuthentication,
      sellerController.createSeller,
    );
    this.router.put(
      '/seller/:sellerId',
      authMiddleware.checkAuthentication,
      sellerController.updateSeller,
    );
    this.router.post(
      '/seller/seed/:count',
      authMiddleware.checkAuthentication,
      sellerController.seedSeller,
    );

    return this.router;
  }
}

export const sellerRoutes: SellerRoutes = new SellerRoutes();
