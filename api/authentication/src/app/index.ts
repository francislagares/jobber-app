import { config } from '@authentication/config';
import { connectDatabase, start } from '@authentication/server';
import express, { Express } from 'express';

const initialize = (): void => {
  config.cloudinaryConfig();
  const app: Express = express();
  connectDatabase();
  start(app);
};

initialize();
