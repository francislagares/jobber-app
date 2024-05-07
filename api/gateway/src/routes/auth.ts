import express, { Router } from 'express';

import AuthController from '@gateway/controllers/auth';
import { AuthSeed } from '@gateway/controllers/auth/seed';
import { authMiddleware } from '@gateway/middleware/auth';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    const authController = new AuthController();
    const authSeed = new AuthSeed();

    this.router.post('/auth/signup', authController.signUp);
    this.router.post('/auth/signin', authController.signIn);
    this.router.post(
      'auth/refresh-token/:username',
      authMiddleware.checkAuthentication,
      authController.refreshToken,
    );
    this.router.get(
      '/current-user',
      authMiddleware.verifyUser,
      authMiddleware.checkAuthentication,
      authController.getCurrentUser,
    );
    this.router.post(
      '/resend-email',
      authMiddleware.verifyUser,
      authMiddleware.checkAuthentication,
      authController.resendEmail,
    );
    this.router.put('/auth/verify-email', authController.verifyEmail);
    this.router.put('/auth/forgot-password', authController.forgotPassword);
    this.router.put('/auth/reset-password', authController.resetPassword);
    this.router.put('/auth/change-password', authController.changePassword);

    this.router.post('/auth/seed/:count', authSeed.createAuthUsers);

    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
