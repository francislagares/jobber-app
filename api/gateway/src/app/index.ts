import express, { Express } from 'express';

import { redisConnect } from '@gateway/redis/redis.connection';
import { APIGateway } from '@gateway/server';

class Application {
  public start(): void {
    const app: Express = express();
    const gateway = new APIGateway(app);

    gateway.init();
    redisConnect();
  }
}

const application: Application = new Application();

application.start();
