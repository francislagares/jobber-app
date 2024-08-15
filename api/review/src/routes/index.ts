import { Application } from 'express';

import { verifyGatewayRequest } from '@francislagares/jobber-shared';

import { config } from '@review/config';

import { healthRoutes } from './health';
import { reviewRoutes } from './review';

const BASE_PATH = '/api/v1/message';

export const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use(
    BASE_PATH,
    verifyGatewayRequest(config.GATEWAY_JWT_TOKEN),
    reviewRoutes(),
  );
};
