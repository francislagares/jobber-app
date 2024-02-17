import HealthController from '@gateway/controllers/health';
import express, { Router } from 'express';

class HealthRoute {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    const healthController = new HealthController();

    this.router.get('/gateway-health', healthController.getHealth);

    return this.router;
  }
}

export const healthRoute: HealthRoute = new HealthRoute();
