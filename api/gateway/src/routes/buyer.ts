import express, { Router } from 'express';

import { Buyer } from '@gateway/controllers/users/buyer';
import { authMiddleware } from '@gateway/middleware/auth';

class BuyerRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    const buyerController = new Buyer();

    this.router.get(
      '/buyer/email',
      authMiddleware.checkAuthentication,
      buyerController.email,
    );
    this.router.get(
      '/buyer/username',
      authMiddleware.checkAuthentication,
      buyerController.currentUsername,
    );
    this.router.get(
      '/buyer/:username',
      authMiddleware.checkAuthentication,
      buyerController.username,
    );
    return this.router;
  }
}

export const buyerRoutes: BuyerRoutes = new BuyerRoutes();
