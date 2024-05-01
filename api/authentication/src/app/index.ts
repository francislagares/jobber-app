import express, { Express } from 'express';

import { config } from '@authentication/config';
import { connectDatabase, start } from '@authentication/server';

const initialize = (): void => {
  config.cloudinaryConfig();
  const app: Express = express();
  connectDatabase();
  start(app);
};

initialize();
