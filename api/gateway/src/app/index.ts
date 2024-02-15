import { APIGateway } from '@gateway/server';
import express, { Express } from 'express';

class Application {
  public start(): void {
    const app: Express = express();
    const gateway = new APIGateway(app);

    gateway.init();
  }
}

const application: Application = new Application();

application.start();
