import http from 'http';

import { winstonLogger } from '@francislagares/jobber-shared';
import { config } from '@notification/config';
import { checkConnection } from '@notification/elastic';
import { createConnection } from '@notification/queues/connection';
import { healthRoute } from '@notification/routes';
import { Application } from 'express';
import { Logger } from 'winston';

import { consumeAuthEmailMessage } from './queues/email.consumer';

const SERVER_PORT = 4001;
const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'notificationServer',
  'debug',
);

export const start = (app: Application): void => {
  startServer(app);
  app.use('', healthRoute);
  startQueues();
  startElasticSearch();
};

const startQueues = async (): Promise<void> => {
  const emailChannel = await createConnection();

  await consumeAuthEmailMessage(emailChannel);
  await emailChannel.assertExchange('jobber-email-notification', 'direct');

  const message = JSON.stringify({ name: 'jobber' });
  emailChannel.publish(
    'jobber-email-notification',
    'auth-email',
    Buffer.from(message),
  );
};

const startElasticSearch = () => {
  checkConnection();
};

const startServer = (app: Application): void => {
  try {
    const httpServer: http.Server = new http.Server(app);

    logger.info(
      `Worker with process id of ${process.pid} on notification server has started`,
    );
    httpServer.listen(SERVER_PORT, () => {
      logger.info(`Notification server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    logger.log('error', 'NotificationService startServer() method', error);
  }
};
