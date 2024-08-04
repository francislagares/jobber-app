import { Application } from 'express';

import { healthRoutes } from './health';

// const BASE_PATH = '/api/v1/gig';

export const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  /*   app.use(
    BUYER_BASE_PATH,
    verifyGatewayRequest(config.GATEWAY_JWT_TOKEN),
    gigRoutes(),
  );
  app.use(
    SELLER_BASE_PATH,
    verifyGatewayRequest(config.GATEWAY_JWT_TOKEN),
    searchRoutes(),
  );*/
};
