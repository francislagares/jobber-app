import express, { Express } from 'express';

import { config } from '@chat/config';
import { connectDatabase, start } from '@chat/server';

const initilize = (): void => {
  config.cloudinaryConfig();
  connectDatabase();

  const app: Express = express();

  start(app);
};

initilize();
