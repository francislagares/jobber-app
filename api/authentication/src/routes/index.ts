import { Application } from 'express';

import { verifyGatewayRequest } from '@francislagares/jobber-shared';

import { config } from '@authentication/config';

import { authRoutes } from './auth';
import { healthRoute } from './health';
import { searchRoutes } from './search';

const BASE_PATH = '/api/v1/auth';

export const appRoutes = (app: Application): void => {
  app.use('', healthRoute.routes());
  app.use(BASE_PATH, searchRoutes());
  app.use(
    BASE_PATH,
    verifyGatewayRequest(config.GATEWAY_JWT_TOKEN),
    authRoutes(),
  );
};
