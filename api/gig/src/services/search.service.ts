import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';

import {
  HitsTotal,
  PaginateProps,
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

export const gigsSearch = async (
  searchQuery: string,
  paginate: PaginateProps,
  deliveryTime?: string,
  min?: number,
  max?: number,
): Promise<SearchResult> => {
  const { from, size, type } = paginate;
  const queryList: QueryList[] = [
    {
      query_string: {
        fields: [
          'username',
          'title',
          'description',
          'basicDescription',
          'basicTitle',
          'categories',
          'subCategories',
          'tags',
        ],
        query: `*${searchQuery}*`,
      },
    },
    {
      term: {
        active: true,
      },
    },
  ];

  if (deliveryTime !== 'undefined') {
    queryList.push({
      query_string: {
        fields: ['expectedDelivery'],
        query: `*${deliveryTime}*`,
      },
    });
  }

  if (!isNaN(parseInt(`${min}`)) && !isNaN(parseInt(`${max}`))) {
    queryList.push({
      range: {
        price: {
          gte: min,
          lte: max,
        },
      },
    });
  }

  const result: SearchResponse = await elasticSearchClient.search({
    index: 'gigs',
    size,
    query: {
      bool: {
        must: [...queryList],
      },
    },
    sort: [
      {
        sortId: type === 'forward' ? 'asc' : 'desc',
      },
    ],
    ...(from !== '0' && { search_after: [from] }),
  });
  const total: HitsTotal = result.hits.total as HitsTotal;

  return {
    total: total.value,
    hits: result.hits.hits,
  };
};

export const gigsSearchByCategory = async (
  searchQuery: string,
): Promise<SearchResult> => {
  const result: SearchResponse = await elasticSearchClient.search({
    index: 'gigs',
    size: 10,
    query: {
      bool: {
        must: [
          {
            query_string: {
              fields: ['categories'],
              query: `*${searchQuery}*`,
            },
          },
          {
            term: {
              active: true,
            },
          },
        ],
      },
    },
  });
  const total: HitsTotal = result.hits.total as HitsTotal;

  return {
    total: total.value,
    hits: result.hits.hits,
  };
};

export const getMoreGigsLikeThis = async (
  gigId: string,
): Promise<SearchResult> => {
  const result: SearchResponse = await elasticSearchClient.search({
    index: 'gigs',
    size: 5,
    query: {
      more_like_this: {
        fields: [
          'username',
          'title',
          'description',
          'basicDescription',
          'basicTitle',
          'categories',
          'subCategories',
          'tags',
        ],
        like: [
          {
            _index: 'gigs',
            _id: gigId,
          },
        ],
      },
    },
  });
  const total: HitsTotal = result.hits.total as HitsTotal;

  return {
    total: total.value,
    hits: result.hits.hits,
  };
};

export const getTopRatedGigsByCategory = async (
  searchQuery: string,
): Promise<SearchResult> => {
  const result: SearchResponse = await elasticSearchClient.search({
    index: 'gigs',
    size: 10,
    query: {
      bool: {
        filter: {
          script: {
            script: {
              source:
                "doc['ratingSum'].value != 0 && (doc['ratingSum'].value / doc['ratingsCount'].value == params['threshold'])",
              lang: 'painless',
              params: {
                threshold: 5,
              },
            },
          },
        },
        must: [
          {
            query_string: {
              fields: ['categories'],
              query: `*${searchQuery}*`,
            },
          },
        ],
      },
    },
  });
  const total: HitsTotal = result.hits.total as HitsTotal;

  return {
    total: total.value,
    hits: result.hits.hits,
  };
};
