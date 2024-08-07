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

import { config } from '@gig/config';
import { MongoDBInstance as dbConnection } from '@gig/config/database';
import { checkConnection, createIndex } from '@gig/elastic';
import { appRoutes } from '@gig/routes';

import { createConnection } from './queues/connection';
import {
  consumeGigDirectMessage,
  consumeSeedDirectMessages,
} from './queues/gig.consumer';

const SERVER_PORT = 4004;
const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'gigElasticSearchServer',
  'debug',
);

export let gigChannel: Channel;

export const start = (app: Application): void => {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  startQueues();
  startElasticSearch();
  usersErrorHandler(app);
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
  gigChannel = await createConnection();

  await consumeGigDirectMessage(gigChannel);
  await consumeSeedDirectMessages(gigChannel);
};

export const startElasticSearch = (): void => {
  checkConnection();
  createIndex('gigs');
};

export const usersErrorHandler = (app: Application): void => {
  app.use(
    (
      error: ErrorResponse,
      _req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      logger.log('error', `GigsService ${error.source}:`, error);
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
    logger.info(`Gig server has started with process id ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      logger.info(`Gig server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    logger.log('error', 'GigService startServer() method error:', error);
  }
};
