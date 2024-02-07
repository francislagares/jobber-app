import { winstonLogger } from '@francislagares/jobber-shared';
import { config } from '@notification/config';
import { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';

import { createConnection } from './connection';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'emailConsumer',
  'debug',
);

export const consumeAuthEmailMessage = async (
  channel: Channel,
): Promise<void> => {
  try {
    if (!channel) {
      channel = await createConnection();
    }
    const exchangeName = 'jobber-email-notification';
    const routingKey = 'auth-email';
    const queueName = 'auth-email-queue';

    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: true,
    });

    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);

    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      console.log(JSON.parse(msg.content.toString()));
      // send email
      // acknowledge
    });
  } catch (error) {
    logger.log(
      'error',
      'NotificationService EmailConsumer consumeAuthEmailMessage() method:',
      error,
    );
  }
};
