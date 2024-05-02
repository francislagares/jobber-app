import express, { Router } from 'express';

import HealthController from '@authentication/controllers/health';

class HealthRoute {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    const healthController = new HealthController();

    this.router.get('/authentication-health', healthController.getHealth);

    return this.router;
  }
}

export const healthRoute: HealthRoute = new HealthRoute();
