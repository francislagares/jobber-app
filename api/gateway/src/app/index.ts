import express, { Express } from 'express';

import { APIGateway } from '@gateway/server';

class Application {
  public start(): void {
    const app: Express = express();
    const gateway = new APIGateway(app);

    gateway.init();
  }
}

const application: Application = new Application();

application.start();
