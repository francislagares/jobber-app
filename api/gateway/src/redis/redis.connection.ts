import Redis from 'ioredis';
import { Logger } from 'winston';

import { winstonLogger } from '@francislagares/jobber-shared';

import { config } from '@gateway/config';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'gatewayRedisConnection',
  'debug',
);

export const redis: Redis = new Redis({
  host: config.REDIS_HOST,
  port: parseInt(config.REDIS_PORT),
});

export const redisConnect = async (): Promise<void> => {
  try {
    redis.on('connect', async () => {
      logger.info(
        `GatewayService Redis Connection Established - ${await redis.ping()}`,
      );
    });

    cacheError();
  } catch (error) {
    logger.log('error', 'GatewayService redisConnect() method error:', error);
  }
};

const cacheError = (): void => {
  redis.on('error', (error: unknown) => {
    logger.error(error);
  });
};
