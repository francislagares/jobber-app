import { Application } from 'express';

import { authRoutes } from './auth';
import { healthRoute } from './health';

const BASE_PATH = '/api/gateway/v1';

const applicationRoutes = (app: Application) => {
  const routes = () => {
    app.use('', healthRoute.routes());
    app.use(BASE_PATH, authRoutes.routes());
  };

  routes();
};

export default applicationRoutes;
