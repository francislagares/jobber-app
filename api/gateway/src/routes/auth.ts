import AuthController from '@gateway/controllers/auth';
import express, { Router } from 'express';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    const authController = new AuthController();

    this.router.post('/auth/signup', authController.create);
    this.router.post('/auth/signin', authController.signIn);
    this.router.put('/auth/verify-email', authController.verifyEmail);

    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
