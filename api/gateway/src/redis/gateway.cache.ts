import Redis from 'ioredis';
import { Logger } from 'winston';

import { winstonLogger } from '@francislagares/jobber-shared';

import { config } from '@gateway/config';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'gatewayCache',
  'debug',
);

export class GatewayCache {
  redis: Redis;

  constructor() {}

  public async saveUserSelectedCategory(
    key: string,
    value: string,
  ): Promise<void> {
    try {
      if (!this.redis) {
        await this.redis.connect();
      }

      await this.redis.set(key, value);
    } catch (error) {
      logger.log(
        'error',
        'GatewayService Cache saveUserSelectedCategory() method error:',
        error,
      );
    }
  }

  public async saveLoggedInUserToCache(
    key: string,
    value: string,
  ): Promise<string[]> {
    try {
      if (!this.redis) {
        await this.redis.connect();
      }

      const index: number | null = await this.redis.lpos(key, value);

      if (index === null) {
        await this.redis.lpush(key, value);
        logger.info(`User ${value} added`);
      }
      const response: string[] = await this.redis.lrange(key, 0, -1);

      return response;
    } catch (error) {
      logger.log(
        'error',
        'GatewayService Cache saveLoggedInUserToCache() method error:',
        error,
      );
      return [];
    }
  }

  public async getLoggedInUsersFromCache(key: string): Promise<string[]> {
    try {
      if (!this.redis) {
        await this.redis.connect();
      }

      const response: string[] = await this.redis.lrange(key, 0, -1);

      return response;
    } catch (error) {
      logger.log(
        'error',
        'GatewayService Cache getLoggedInUsersFromCache() method error:',
        error,
      );

      return [];
    }
  }

  public async removeLoggedInUserFromCache(
    key: string,
    value: string,
  ): Promise<string[]> {
    try {
      if (!this.redis) {
        await this.redis.connect();
      }

      await this.redis.lrem(key, 1, value);

      logger.info(`User ${value} removed`);

      const response: string[] = await this.redis.lrange(key, 0, -1);

      return response;
    } catch (error) {
      logger.log(
        'error',
        'GatewayService Cache removeLoggedInUserFromCache() method error:',
        error,
      );

      return [];
    }
  }
}
