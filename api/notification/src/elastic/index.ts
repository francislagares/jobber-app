import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { winstonLogger } from '@francislagares/jobber-shared';
import { config } from '@notification/config';
import { Logger } from 'winston';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'notificationElasticSearchServer',
  'debug',
);

const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`,
});

export const checkConnection = async (): Promise<void> => {
  let isConnected = false;

  while (!isConnected) {
    try {
      const health: ClusterHealthResponse =
        await elasticSearchClient.cluster.health({});

      logger.info(
        `NotificationService ElasticSearch health status - ${health.status}`,
      );
      isConnected = true;
    } catch (error) {
      logger.error('Connection to ElasticSearch failed. Retrying...');
      logger.error(
        'error',
        'NotificationService checkConnection() method:',
        error,
      );
    }
  }
};
