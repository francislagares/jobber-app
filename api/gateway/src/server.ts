import { Server as HTTPServer } from 'http';

import {
  ErrorResponse,
  JobberError,
  winstonLogger,
} from '@francislagares/jobber-shared';
import { config } from '@gateway/config';
import { elasticSearch } from '@gateway/elastic';
import compression from 'compression';
import cookieSession from 'cookie-session';
import cors from 'cors';
import {
  Application,
  NextFunction,
  Request,
  Response,
  json,
  urlencoded,
} from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { StatusCodes } from 'http-status-codes';
import { Logger } from 'winston';

import applicationRoutes from './routes';
import { axiosAuthInstance } from './services/auth';

const SERVER_PORT = 4000;
const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'apiGatewayServer',
  'debug',
);

export class APIGateway {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public init() {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.startElasticSearch();
    this.errorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.set('trust proxy', 1);
    app.use(
      cookieSession({
        name: 'session',
        keys: [`${config.SECRET_KEY_ONE}`, `${config.SECRET_KEY_TWO}`],
        maxAge: 24 * 7 * 3600000,
        secure: config.NODE_ENV !== 'development', // update with value from config
      }),
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      }),
    );
    app.use((req: Request, _res: Response, next: NextFunction) => {
      if (req.session?.jwt) {
        axiosAuthInstance.defaults.headers['Authorization'] =
          `Bearer ${req.session.jwt}`;
      }
      next();
    });
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '200mb' }));
    app.use(urlencoded({ extended: true, limit: '200mb' }));
  }

  private routesMiddleware(app: Application): void {
    applicationRoutes(app);
  }

  private startElasticSearch(): void {
    elasticSearch.checkConnection();
  }

  private errorHandler(app: Application): void {
    app.use('*', (req: Request, res: Response, next: NextFunction) => {
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

      logger.error('error', `${fullUrl} endpoint does not exist.`, '');

      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'The endpoint called does not exist.' });

      next();
    });

    app.use(
      (
        error: ErrorResponse,
        _req: Request,
        res: Response,
        next: NextFunction,
      ) => {
        logger.error('error', `GatewayService ${error.source}`, error);

        if (error instanceof JobberError) {
        }
        res.status(error.statusCode).json(error.serializeErrors());

        next();
      },
    );
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer = new HTTPServer(app);

      this.startHttpServer(httpServer);
    } catch (error) {
      logger.log('error', 'GatewayService startServer() method:', error);
    }
  }

  private async startHttpServer(httpServer: HTTPServer): Promise<void> {
    try {
      logger.info(`Gateway service has started with process id ${process.pid}`);

      httpServer.listen(SERVER_PORT, () => {
        logger.info(`Gateway service running on port ${SERVER_PORT}`);
      });
    } catch (error) {
      logger.log('error', 'GatewayServer startHttpServer() method:', error);
    }
  }
}
