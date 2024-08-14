import { Server as HTTPServer } from 'http';

import { Channel } from 'amqplib';
import compression from 'compression';
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
import { verify } from 'jsonwebtoken';
import { Server as SocketIOServer } from 'socket.io';
import { Logger } from 'winston';

import {
  AuthPayload,
  ErrorResponse,
  JobberError,
  winstonLogger,
} from '@francislagares/jobber-shared';

import { config } from '@order/config';
import { MongoDBInstance as dbConnection } from '@order/config/database';
import { checkConnection } from '@order/elastic';
import { createConnection } from '@order/queues/connection';
import { consumerReviewFanoutMessages } from '@order/queues/order.consumer';
import { appRoutes } from '@order/routes';

const SERVER_PORT = 4006;
const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'orderElasticSearchServer',
  'debug',
);

export let orderChannel: Channel;
export let socketIOOrderObject: SocketIOServer;

export const start = (app: Application): void => {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  startQueues();
  startElasticSearch();
  orderErrorHandler(app);
  startServer(app);
};

export const securityMiddleware = (app: Application): void => {
  app.set('trust proxy', 1);
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      origin: config.API_GATEWAY_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTION'],
    }),
  );
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      const payload = verify(token, config.JWT_TOKEN) as AuthPayload;
      req.currentUser = payload;
    }
    next();
  });
};

export const standardMiddleware = (app: Application): void => {
  app.use(compression());
  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ extended: true, limit: '200mb' }));
};

export const routesMiddleware = (app: Application): void => {
  appRoutes(app);
};

export const startQueues = async (): Promise<void> => {
  orderChannel = await createConnection();
  await consumerReviewFanoutMessages(orderChannel);
};

export const startElasticSearch = (): void => {
  checkConnection();
};

export const orderErrorHandler = (app: Application): void => {
  app.use(
    (
      error: ErrorResponse,
      _req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      logger.log('error', `OrderService ${error.source}:`, error);
      if (error instanceof JobberError) {
        res.status(error.statusCode).json(error.serializeErrors());
      }
      next();
    },
  );
};

export const connectDatabase = (): void => {
  dbConnection.getInstance();
};

export const startServer = async (app: Application): Promise<void> => {
  try {
    const httpServer = new HTTPServer(app);
    const socketIO: SocketIOServer = await createSocketIO(httpServer);

    startHttpServer(httpServer);
    socketIOOrderObject = socketIO;
  } catch (error) {
    logger.log('error', 'OrderService startServer() method:', error);
  }
};

export const createSocketIO = async (
  httpServer: HTTPServer,
): Promise<SocketIOServer> => {
  const io: SocketIOServer = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    },
  });

  return io;
};

export const startHttpServer = (httpServer: HTTPServer) => {
  try {
    logger.info(`Order server has started with process id ${process.pid}`);

    httpServer.listen(SERVER_PORT, () => {
      logger.info(`Order server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    logger.log('error', 'OrderService startServer() method error:', error);
  }
};
