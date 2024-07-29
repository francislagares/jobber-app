import { Channel, ConsumeMessage, Replies } from 'amqplib';
import { Logger } from 'winston';

import { BuyerDocument, winstonLogger } from '@francislagares/jobber-shared';

import { config } from '@users/config';
import { createConnection } from '@users/queues/connection';
import {
  createBuyer,
  updateBuyerPurchasedGigs,
} from '@users/services/buyer.service';
import {
  updateSellerCancelledJobs,
  updateSellerCompletedJobs,
  updateSellerOngoingJobs,
  updateTotalGigsCount,
} from '@users/services/seller.service';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'usersQueueConsumer',
  'debug',
);

export const consumeBuyerDirectMessage = async (
  channel: Channel,
): Promise<void> => {
  try {
    if (!channel) {
      channel = await createConnection();
    }

    const exchangeName = 'jobber-buyer-update';
    const routingKey = 'user-buyer';
    const queueName = 'user-buyer-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue: Replies.AssertQueue = await channel.assertQueue(
      queueName,
      { durable: true, autoDelete: false },
    );

    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);

    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      const { type } = JSON.parse(msg.content.toString());
      if (type === 'auth') {
        const { username, email, profilePicture, country, createdAt } =
          JSON.parse(msg.content.toString());
        const buyer: BuyerDocument = {
          username,
          email,
          profilePicture,
          country,
          purchasedGigs: [],
          createdAt,
        };

        await createBuyer(buyer);
      } else {
        const { buyerId, purchasedGigs } = JSON.parse(msg.content.toString());

        await updateBuyerPurchasedGigs(buyerId, purchasedGigs, type);
      }
      channel.ack(msg);
    });
  } catch (error) {
    logger.log(
      'error',
      'UsersService UserConsumer consumeBuyerDirectMessage() method error:',
      error,
    );
  }
};

export const consumeSellerDirectMessage = async (
  channel: Channel,
): Promise<void> => {
  try {
    if (!channel) {
      channel = await createConnection();
    }
    const exchangeName = 'jobber-seller-update';
    const routingKey = 'user-seller';
    const queueName = 'user-seller-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue: Replies.AssertQueue = await channel.assertQueue(
      queueName,
      { durable: true, autoDelete: false },
    );

    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      const {
        type,
        sellerId,
        ongoingJobs,
        completedJobs,
        totalEarnings,
        recentDelivery,
        gigSellerId,
        count,
      } = JSON.parse(msg.content.toString());

      if (type === 'create-order') {
        await updateSellerOngoingJobs(sellerId, ongoingJobs);
      } else if (type === 'approve-order') {
        await updateSellerCompletedJobs({
          sellerId,
          ongoingJobs,
          completedJobs,
          totalEarnings,
          recentDelivery,
        });
      } else if (type === 'update-gig-count') {
        await updateTotalGigsCount(`${gigSellerId}`, count);
      } else if (type === 'cancel-order') {
        await updateSellerCancelledJobs(sellerId);
      }
      channel.ack(msg);
    });
  } catch (error) {
    logger.log(
      'error',
      'UsersService UserConsumer consumeSellerDirectMessage() method error:',
      error,
    );
  }
};
