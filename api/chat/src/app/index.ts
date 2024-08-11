import { config } from '@chat/config';
import { connectDatabase, start } from '@chat/server';
import express, { Express } from 'express';

const initilize = (): void => {
  config.cloudinaryConfig();
  connectDatabase();

  const app: Express = express();

  start(app);
};

initilize();
