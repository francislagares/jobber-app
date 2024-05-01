import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { Logger } from 'winston';

import { winstonLogger } from '@francislagares/jobber-shared';

import { config } from '@gateway/config';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'apiGatewayElasticConnection',
  'debug',
);

class ElasticSearch {
  private elasticSearchClient: Client;

  constructor() {
    this.elasticSearchClient = new Client({
      node: `${config.ELASTIC_SEARCH_URL}`,
    });
  }

  public async checkConnection(): Promise<void> {
    let isConnected = false;

    while (!isConnected) {
      logger.info('GatewayService Connecting to ElasticSearch');
      try {
        const health: ClusterHealthResponse =
          await this.elasticSearchClient.cluster.health({});

        logger.info(
          `GatewayService ElasticSearch health status - ${health.status}`,
        );
        isConnected = true;
      } catch (error) {
        logger.error('Connection to ElasticSearch failed. Retrying...');
        logger.error(
          'error',
          'GatewayService checkConnection() method:',
          error,
        );
      }
    }
  }
}

export const elasticSearch: ElasticSearch = new ElasticSearch();
