import { Application } from 'express';

import { authMiddleware } from '@gateway/middleware/auth';
import { authRoutes } from '@gateway/routes/auth';
import { buyerRoutes } from '@gateway/routes/buyer';
import { currentUserRoutes } from '@gateway/routes/current-user';
import { gigRoutes } from '@gateway/routes/gig';
import { healthRoute } from '@gateway/routes/health';

import { messageRoutes } from './chat';
import { reviewRoutes } from './review';
import { sellerRoutes } from './seller';

const BASE_PATH = '/api/gateway/v1';

const applicationRoutes = (app: Application) => {
  const routes = () => {
    app.use('', healthRoute.routes());
    app.use(BASE_PATH, authRoutes.routes());

    app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, buyerRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, sellerRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, gigRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, messageRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, reviewRoutes.routes());
  };

  routes();
};

export default applicationRoutes;
