import { winstonLogger } from '@francislagares/jobber-shared';
import { config } from '@notification/config';
import { start } from '@notification/server';
import express from 'express';
import { Logger } from 'winston';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'notificationApp',
  'debug',
);

const initialize = (): void => {
  const app = express();

  start(app);
  logger.info('Notification Service Initialized');
};

initialize();
