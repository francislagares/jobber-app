import { config } from '@authentication/config';
import { createConnection } from '@authentication/queues/connection';
import { winstonLogger } from '@francislagares/jobber-shared';
import { Channel } from 'amqplib';
import { Logger } from 'winston';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'authenticationQueueConnection',
  'debug',
);

export const publishDirectMessage = async (
  channel: Channel,
  exchangeName: string,
  routingKey: string,
  message: string,
  logMessage: string,
) => {
  try {
    if (!channel) {
      channel = await createConnection();

      await channel.assertExchange(exchangeName, 'direct');
      channel.publish(exchangeName, routingKey, Buffer.from(message));
      logger.info(logMessage);
    }
  } catch (error) {
    logger.log(
      'error',
      'AuthService Provider publishDirectMessage() method',
      error,
    );
  }
};
