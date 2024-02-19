import { Application } from 'express';

export const appRoutes = (app: Application): void => {
  app.use('', () => console.log('appRoutes'));
};
