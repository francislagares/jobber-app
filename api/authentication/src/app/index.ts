import { connectDatabase, start } from '@authentication/server';
import express, { Express } from 'express';

const initialize = (): void => {
  const app: Express = express();
  connectDatabase();
  start(app);
};

initialize();
