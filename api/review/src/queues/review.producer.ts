import { Channel } from 'amqplib';
import { Logger } from 'winston';

import { winstonLogger } from '@francislagares/jobber-shared';

import { config } from '@review/config';
import { createConnection } from '@review/queues/connection';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'reviewServiceProducer',
  'debug',
);

export const publishFanoutMessage = async (
  channel: Channel,
  exchangeName: string,
  message: string,
  logMessage: string,
): Promise<void> => {
  try {
    if (!channel) {
      channel = await createConnection();
    }

    await channel.assertExchange(exchangeName, 'fanout');

    channel.publish(exchangeName, '', Buffer.from(message));

    logger.info(logMessage);
  } catch (error) {
    logger.log('error', 'ReviewService publishFanoutMessage() method:', error);
  }
};
