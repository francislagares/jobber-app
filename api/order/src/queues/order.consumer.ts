import { Channel, ConsumeMessage, Replies } from 'amqplib';
import { Logger } from 'winston';

import { winstonLogger } from '@francislagares/jobber-shared';

import { config } from '@order/config';
import { createConnection } from '@order/queues/connection';
import { updateOrderReview } from '@order/services/order.service';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'orderServiceConsumer',
  'debug',
);

export const consumerReviewFanoutMessages = async (
  channel: Channel,
): Promise<void> => {
  try {
    if (!channel) {
      channel = await createConnection();
    }

    const exchangeName = 'jobber-review';
    const queueName = 'order-review-queue';

    await channel.assertExchange(exchangeName, 'fanout');

    const jobberQueue: Replies.AssertQueue = await channel.assertQueue(
      queueName,
      { durable: true, autoDelete: false },
    );

    await channel.bindQueue(jobberQueue.queue, exchangeName, '');

    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      await updateOrderReview(JSON.parse(msg.content.toString()));
      channel.ack(msg);
    });
  } catch (error) {
    logger.log(
      'error',
      'OrderService comsumer consumerReviewFanoutMessages() method:',
      error,
    );
  }
};
