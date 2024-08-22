import { Server as HTTPServer } from 'http';

import { createAdapter } from '@socket.io/redis-adapter';
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
import Redis from 'ioredis';
import { Server as SocketIOServer } from 'socket.io';
import { Logger } from 'winston';

import { ErrorResponse, winstonLogger } from '@francislagares/jobber-shared';

import { config } from '@gateway/config';
import { elasticSearch } from '@gateway/elastic';
import applicationRoutes from '@gateway/routes';
import { axiosAuthInstance } from '@gateway/services/auth';
import { axiosBuyerInstance } from '@gateway/services/buyer';
import { axiosMessageInstance } from '@gateway/services/chat';
import { axiosGigInstance } from '@gateway/services/gig';
import { axiosOrderInstance } from '@gateway/services/order';
import { axiosReviewInstance } from '@gateway/services/review';
import { axiosSellerInstance } from '@gateway/services/seller';
import { SocketIOAppHandler } from '@gateway/sockets';

const SERVER_PORT = 4000;

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'apiGatewayServer',
  'debug',
);

export let socketIO: SocketIOServer;

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
        secure: config.NODE_ENV !== 'development',
        ...(config.NODE_ENV !== 'development' && {
          sameSite: 'none',
        }),
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
          `Bearer ${req.session?.jwt}`;
        axiosBuyerInstance.defaults.headers['Authorization'] =
          `Bearer ${req.session?.jwt}`;
        axiosSellerInstance.defaults.headers['Authorization'] =
          `Bearer ${req.session?.jwt}`;
        axiosGigInstance.defaults.headers['Authorization'] =
          `Bearer ${req.session?.jwt}`;
        axiosMessageInstance.defaults.headers['Authorization'] =
          `Bearer ${req.session?.jwt}`;
        axiosOrderInstance.defaults.headers['Authorization'] =
          `Bearer ${req.session?.jwt}`;
        axiosReviewInstance.defaults.headers['Authorization'] =
          `Bearer ${req.session?.jwt}`;
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

        res.status(error.statusCode).json(error.serializeErrors());

        next();
      },
    );
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer = new HTTPServer(app);
      const socketIO = await this.createSocketIO(httpServer);

      this.startHttpServer(httpServer);
      this.socketIOConnections(socketIO);
    } catch (error) {
      logger.log('error', 'GatewayService startServer() method:', error);
    }
  }

  private async createSocketIO(
    httpServer: HTTPServer,
  ): Promise<SocketIOServer> {
    const io: SocketIOServer = new SocketIOServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      },
    });
    const pubClient = new Redis({
      host: config.REDIS_HOST,
      port: parseInt(config.REDIS_PORT),
    });
    const subClient = pubClient.duplicate();

    io.adapter(createAdapter(pubClient, subClient));

    socketIO = io;

    return io;
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

  private socketIOConnections(io: SocketIOServer): void {
    const socketIoApp = new SocketIOAppHandler(io);

    socketIoApp.listen();
  }
}
