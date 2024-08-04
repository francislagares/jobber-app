import { Client } from '@elastic/elasticsearch';
import {
  ClusterHealthResponse,
  GetResponse,
} from '@elastic/elasticsearch/lib/api/types';
import { Logger } from 'winston';

import { SellerGig, winstonLogger } from '@francislagares/jobber-shared';

import { config } from '@gig/config';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'gigElasticSearchServer',
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

      logger.info(`GigService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      logger.error('Connection to Elasticsearch failed. Retrying...');
      logger.log('error', 'GigService checkConnection() method:', error);
    }
  }
};

export const checkIfIndexExists = async (
  indexName: string,
): Promise<boolean> => {
  const result = await elasticSearchClient.indices.exists({ index: indexName });

  return result;
};

export const createIndex = async (indexName: string): Promise<void> => {
  try {
    const result: boolean = await checkIfIndexExists(indexName);

    if (result) {
      logger.info(`Index "${indexName}" already exist.`);
    } else {
      await elasticSearchClient.indices.create({ index: indexName });
      await elasticSearchClient.indices.refresh({ index: indexName });
      logger.info(`Created index ${indexName}`);
    }
  } catch (error) {
    logger.error(`An error occurred while creating the index ${indexName}`);
    logger.log('error', 'GigService createIndex() method error:', error);
  }
};

export const getIndexedData = async (
  index: string,
  itemId: string,
): Promise<SellerGig> => {
  try {
    const result: GetResponse = await elasticSearchClient.get({
      index,
      id: itemId,
    });

    return result._source as SellerGig;
  } catch (error) {
    logger.log(
      'error',
      'GigService elasticsearch getIndexedData() method error:',
      error,
    );

    return {} as SellerGig;
  }
};

export const addDataToIndex = async (
  index: string,
  itemId: string,
  gigDocument: unknown,
): Promise<void> => {
  try {
    await elasticSearchClient.index({
      index,
      id: itemId,
      document: gigDocument,
    });
  } catch (error) {
    logger.log(
      'error',
      'GigService elasticsearch addDataToIndex() method error:',
      error,
    );
  }
};
