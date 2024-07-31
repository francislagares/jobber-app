import { Application } from 'express';

import { authMiddleware } from '@gateway/middleware/auth';
import { authRoutes } from '@gateway/routes/auth';
import { buyerRoutes } from '@gateway/routes/buyer';
import { currentUserRoutes } from '@gateway/routes/current-user';
import { searchRoutes } from '@gateway/routes/gig';
import { healthRoute } from '@gateway/routes/health';

import { sellerRoutes } from './seller';

const BASE_PATH = '/api/gateway/v1';

const applicationRoutes = (app: Application) => {
  const routes = () => {
    app.use('', healthRoute.routes());
    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, searchRoutes.routes());

    app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, buyerRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, sellerRoutes.routes());
  };

  routes();
};

export default applicationRoutes;
