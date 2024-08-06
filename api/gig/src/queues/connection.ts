import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';

import { winstonLogger } from '@francislagares/jobber-shared';

import { config } from '@gig/config';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'gigQueueConnection',
  'debug',
);

export const createConnection = async (): Promise<Channel | undefined> => {
  try {
    const connection: Connection = await client.connect(
      `${config.RABBITMQ_ENDPOINT}`,
    );
    const channel: Channel = await connection.createChannel();

    logger.info('Gig server connected to queue successfully...');

    closeConnection(channel, connection);

    return channel;
  } catch (error) {
    logger.log('error', 'GigService createConnection() method:', error);

    return undefined;
  }
};

const closeConnection = (channel: Channel, connection: Connection): void => {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
};
