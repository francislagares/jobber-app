import { winstonLogger } from '@francislagares/jobber-shared';
import cookieSession from 'cookie-session';
import { Application } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import { Logger } from 'winston';

const SERVER_PORT = 4000;
const logger: Logger = winstonLogger('', 'apiGatewayServer', 'debug');

export class APIGateway {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start() {}

  private securityMiddleware(app: Application): void {
    app.set('trust proxy', 1);
    app.use(
      cookieSession({
        name: 'session',
        keys: [],
        maxAge: 24 * 7 * 3600000,
        secure: false, // update with value from config
      }),
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: '',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      }),
    );
  }
}
