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

    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
