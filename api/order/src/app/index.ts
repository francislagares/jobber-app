import express, { Express } from 'express';

import { config } from '@order/config';
import { connectDatabase, start } from '@order/server';

const initilize = (): void => {
  config.cloudinaryConfig();
  connectDatabase();

  const app: Express = express();

  start(app);
};

initilize();
