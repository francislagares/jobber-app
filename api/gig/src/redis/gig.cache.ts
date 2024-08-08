import { Logger } from 'winston';

import { winstonLogger } from '@francislagares/jobber-shared';

import { config } from '@gig/config';

import { redis } from './redis.connection';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'gigCache',
  'debug',
);

export const getUserSelectedGigCategory = async (
  key: string,
): Promise<string> => {
  try {
    const cacheData: string = await redis.get(key);

    return cacheData;
  } catch (error) {
    logger.log(
      'error',
      'GigService GigCache getUserSelectedGigCategory() method error:',
      error,
    );

    return null;
  }
};
