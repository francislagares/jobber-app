import { Application } from 'express';

const BUYER_BASE_PATH = '/api/v1/buyer';
const SELLER_BASE_PATH = '/api/v1/seller';

export const appRoutes = (app: Application): void => {
  app.use('', () => console.log('TODO routes'));
  app.use(BUYER_BASE_PATH, () => console.log('TODO routes'));
  app.use(SELLER_BASE_PATH, () => console.log('TODO routes'));
};
