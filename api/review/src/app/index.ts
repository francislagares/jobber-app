import express, { Express } from 'express';

import { config } from '@review/config';
import { connectDatabase, start } from '@review/server';

const initilize = (): void => {
  config.cloudinaryConfig();
  connectDatabase();

  const app: Express = express();

  start(app);
};

initilize();
