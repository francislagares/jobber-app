import express, { Router } from 'express';

import AuthController from '@gateway/controllers/auth';
import { authMiddleware } from '@gateway/middleware/auth';

class CurrentUserRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    const currentUser = new AuthController();

    this.router.get(
      '/auth/refresh-token/:username',
      authMiddleware.checkAuthentication,
      currentUser.refreshToken,
    );

    this.router.get(
      '/auth/currentuser',
      authMiddleware.checkAuthentication,
      currentUser.getCurrentUser,
    );

    this.router.post(
      '/auth/resend-email',
      authMiddleware.checkAuthentication,
      currentUser.resendEmail,
    );

    return this.router;
  }
}

export const currentUserRoutes: CurrentUserRoutes = new CurrentUserRoutes();
