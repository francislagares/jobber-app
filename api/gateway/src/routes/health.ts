import express, { Router } from 'express';

import HealthController from '@gateway/controllers/health';

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
