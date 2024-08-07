import Redis from 'ioredis';
import { Logger } from 'winston';

import { winstonLogger } from '@francislagares/jobber-shared';

import { config } from '@gig/config';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'gigRedisConnection',
  'debug',
);

export const client: Redis = new Redis({
  host: config.REDIS_HOST,
  port: parseInt(config.REDIS_PORT),
});

export const redisConnect = async (): Promise<void> => {
  try {
    logger.info(`GigService Redis Connection: ${await client.ping()}`);

    cacheError();
  } catch (error) {
    logger.log('error', 'GigService redisConnect() method error:', error);
  }
};

const cacheError = (): void => {
  client.on('error', (error: unknown) => {
    logger.error(error);
  });
};
