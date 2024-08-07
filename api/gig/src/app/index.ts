import express, { Express } from 'express';

import { config } from '@gig/config';
import { redisConnect } from '@gig/redis/redis.connection';
import { connectDatabase, start } from '@gig/server';

const initilize = (): void => {
  config.cloudinaryConfig();
  connectDatabase();

  const app: Express = express();

  start(app);
  redisConnect();
};

initilize();
