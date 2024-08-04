import { Application } from 'express';

import { verifyGatewayRequest } from '@francislagares/jobber-shared';

import { config } from '@users/config';

import { buyerRoutes } from './buyer';
import { healthRoutes } from './health';
import { sellerRoutes } from './seller';

const BUYER_BASE_PATH = '/api/v1/buyer';
const SELLER_BASE_PATH = '/api/v1/seller';

export const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use(
    BUYER_BASE_PATH,
    verifyGatewayRequest(config.GATEWAY_JWT_TOKEN),
    buyerRoutes(),
  );
  app.use(
    SELLER_BASE_PATH,
    verifyGatewayRequest(config.GATEWAY_JWT_TOKEN),
    sellerRoutes(),
  );
};
