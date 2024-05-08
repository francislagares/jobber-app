import express, { Express } from 'express';

import { config } from '@users/config';
import { connectDatabase, start } from '@users/server';

const initilize = (): void => {
  config.cloudinaryConfig();
  connectDatabase();
  const app: Express = express();
  start(app);
};

initilize();
