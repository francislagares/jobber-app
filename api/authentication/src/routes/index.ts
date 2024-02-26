import { config } from '@authentication/config';
import { verifyGatewayRequest } from '@francislagares/jobber-shared';
import { Application } from 'express';

import { authRoutes } from './auth';

const BASE_PATH = '/api/v1/auth';

export const appRoutes = (app: Application): void => {
  app.use(
    BASE_PATH,
    verifyGatewayRequest(config.GATEWAY_JWT_TOKEN),
    authRoutes(),
  );
};
