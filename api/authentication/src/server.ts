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
import { Logger } from 'winston';

import {
  AuthPayload,
  ErrorResponse,
  JobberError,
  winstonLogger,
} from '@francislagares/jobber-shared';

import { config } from '@authentication/config';
import { MySqlDBInstance as dbConnection } from '@authentication/config/database';
import { checkConnection } from '@authentication/elastic';
import { createConnection } from '@authentication/queues/connection';
import { appRoutes } from '@authentication/routes';

const SERVER_PORT = 4002;
const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'authElasticSearchServer',
  'debug',
);

export let authChannel: Channel;

export const start = (app: Application): void => {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  startQueues();
  startElasticSearch();
  authErrorHandler(app);
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
  authChannel = await createConnection();
};

export const startElasticSearch = (): void => {
  checkConnection();
};

export const authErrorHandler = (app: Application): void => {
  app.use(
    (
      error: ErrorResponse,
      _req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      logger.log('error', `AuthService ${error.source}:`, error);
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

export const startServer = (app: Application) => {
  try {
    const httpServer: HTTPServer = new HTTPServer(app);
    logger.info(
      `Authentication server has started with process id ${process.pid}`,
    );
    httpServer.listen(SERVER_PORT, () => {
      logger.info(`Authentication server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    logger.log('error', 'AuthService startServer() method error:', error);
  }
};
