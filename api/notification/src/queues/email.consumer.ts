import { EmailLocals, winstonLogger } from '@francislagares/jobber-shared';
import { config } from '@notification/config';
import { sendEmail } from '@notification/emails/email.transport';
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
      const { receiverEmail, username, verifyLink, resetLink, template } =
        JSON.parse(msg!.content.toString());
      const locals: EmailLocals = {
        appLink: `${config.CLIENT_URL}`,
        appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
        username,
        verifyLink,
        resetLink,
      };

      await sendEmail(template, receiverEmail, locals);

      channel.ack(msg);
    });
  } catch (error) {
    logger.log(
      'error',
      'NotificationService EmailConsumer consumeAuthEmailMessage() method:',
      error,
    );
  }
};

export const consumeOrderEmailMessage = async (
  channel: Channel,
): Promise<void> => {
  try {
    if (!channel) {
      channel = await createConnection();
    }
    const exchangeName = 'jobber-order-notification';
    const routingKey = 'auth-order';
    const queueName = 'auth-order-queue';

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
      channel.ack(msg);
    });
  } catch (error) {
    logger.log(
      'error',
      'NotificationService EmailConsumer consumeOrderEmailMessage() method:',
      error,
    );
  }
};
