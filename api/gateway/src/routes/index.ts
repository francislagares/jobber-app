import { Application } from 'express';

import { healthRoute } from './health';

const applicationRoutes = (app: Application) => {
  const routes = () => {
    app.use('', healthRoute.routes());
  };

  routes();
};

export default applicationRoutes;
