import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { Logger } from 'winston';

import { winstonLogger } from '@francislagares/jobber-shared';

import { config } from '@chat/config';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'chatElasticSearchServer',
  'debug',
);

export const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`,
});

export const checkConnection = async (): Promise<void> => {
  let isConnected = false;

  while (!isConnected) {
    try {
      const health: ClusterHealthResponse =
        await elasticSearchClient.cluster.health({});

      logger.info(`ChatService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      logger.error('Connection to Elasticsearch failed. Retrying...');
      logger.log('error', 'ChatService checkConnection() method:', error);
    }
  }
};
