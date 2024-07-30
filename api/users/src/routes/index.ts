import { Application } from 'express';

import { verifyGatewayRequest } from '@francislagares/jobber-shared';

import { buyerRoutes } from './buyer';

const BUYER_BASE_PATH = '/api/v1/buyer';
const SELLER_BASE_PATH = '/api/v1/seller';

export const appRoutes = (app: Application): void => {
  app.use('', () => console.log('health routes'));
  app.use(BUYER_BASE_PATH, verifyGatewayRequest, buyerRoutes());
  app.use(SELLER_BASE_PATH, verifyGatewayRequest, () =>
    console.log('seller routes'),
  );
};
