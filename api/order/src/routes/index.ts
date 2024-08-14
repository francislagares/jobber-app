import { Application } from 'express';

import { verifyGatewayRequest } from '@francislagares/jobber-shared';

import { config } from '@order/config';

import { healthRoutes } from './health';
import { orderRoutes } from './order';

const BASE_PATH = '/api/v1/message';

export const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use(
    BASE_PATH,
    verifyGatewayRequest(config.GATEWAY_JWT_TOKEN),
    orderRoutes(),
  );
};
