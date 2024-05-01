import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { Logger } from 'winston';

import { winstonLogger } from '@francislagares/jobber-shared';

import { config } from '@notification/config';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'notificationElasticSearchServer',
  'debug',
);

const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`,
});

export async function checkConnection(): Promise<void> {
  let isConnected = false;

  while (!isConnected) {
    try {
      const health: ClusterHealthResponse =
        await elasticSearchClient.cluster.health({});

      logger.info(
        `NotificationService Elasticsearch health status - ${health.status}`,
      );
      isConnected = true;
    } catch (error) {
      logger.error('Connection to Elasticsearch failed. Retrying...');
      logger.log(
        'error',
        'NotificationService checkConnection() method:',
        error,
      );
    }
  }
}
