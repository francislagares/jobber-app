import { Channel } from 'amqplib';
import { Logger } from 'winston';

import { winstonLogger } from '@francislagares/jobber-shared';

import { config } from '@order/config';

import { createConnection } from './connection';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'orderQueueConnection',
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
    }

    await channel.assertExchange(exchangeName, 'direct');
    channel.publish(exchangeName, routingKey, Buffer.from(message));
    logger.info(logMessage);
  } catch (error) {
    logger.log(
      'error',
      'OrderService Provider publishDirectMessage() method',
      error,
    );
  }
};
