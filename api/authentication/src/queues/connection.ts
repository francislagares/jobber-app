import { config } from '@authentication/config';
import { winstonLogger } from '@francislagares/jobber-shared';
import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'authenticationQueueConnection',
  'debug',
);

export const createConnection = async (): Promise<Channel | undefined> => {
  try {
    const connection: Connection = await client.connect(
      `${config.RABBITMQ_ENDPOINT}`,
    );
    const channel: Channel = await connection.createChannel();

    logger.info('Authentication server connected to queue successfully...');

    closeConnection(channel, connection);

    return channel;
  } catch (error) {
    logger.log(
      'error',
      'AuthenticationService createConnection() method:',
      error,
    );

    return undefined;
  }
};

const closeConnection = (channel: Channel, connection: Connection): void => {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
};
