import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';

import {
  HitsTotal,
  QueryList,
  SearchResult,
} from '@francislagares/jobber-shared';

import { elasticSearchClient } from '@gig/elastic';

export const gigsSearchBySellerId = async (
  searchQuery: string,
  active: boolean,
): Promise<SearchResult> => {
  const queryList: QueryList[] = [
    {
      query_string: {
        fields: ['sellerId'],
        query: `*${searchQuery}*`,
      },
    },
    {
      term: {
        active,
      },
    },
  ];

  const result: SearchResponse = await elasticSearchClient.search({
    index: 'gigs',
    query: {
      bool: {
        must: [...queryList],
      },
    },
  });

  const total: HitsTotal = result.hits.total as HitsTotal;

  return {
    total: total.value,
    hits: result.hits.hits,
  };
};
