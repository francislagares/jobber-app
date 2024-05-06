import { Client } from '@elastic/elasticsearch';
import {
  ClusterHealthResponse,
  GetResponse,
} from '@elastic/elasticsearch/lib/api/types';
import { Logger } from 'winston';

import { SellerGig, winstonLogger } from '@francislagares/jobber-shared';

import { config } from '@authentication/config';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'authElasticSearchServer',
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

      logger.info(`AuthService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      logger.error('Connection to Elasticsearch failed. Retrying...');
      logger.log('error', 'AuthService checkConnection() method:', error);
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
    logger.log('error', 'AuthService createIndex() method error:', error);
  }
};

export const getDocumentById = async (
  index: string,
  gigId: string,
): Promise<SellerGig> => {
  try {
    const result: GetResponse = await elasticSearchClient.get({
      index,
      id: gigId,
    });

    return result._source as SellerGig;
  } catch (error) {
    logger.log(
      'error',
      'AuthService elasticsearch getDocumentById() method error:',
      error,
    );

    return {} as SellerGig;
  }
};
