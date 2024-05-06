import express, { Router } from 'express';

import { Search } from '@gateway/controllers/gig/search';
import { authMiddleware } from '@gateway/middleware/auth';

class SearchRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    const searchController = new Search();

    this.router.get(
      '/gig/search/:from/:size/:type',
      authMiddleware.checkAuthentication,
      searchController.gigs,
    );
    this.router.get(
      '/gig/:gigId',
      authMiddleware.checkAuthentication,
      searchController.gigById,
    );

    return this.router;
  }
}

export const searchRoutes: SearchRoutes = new SearchRoutes();
