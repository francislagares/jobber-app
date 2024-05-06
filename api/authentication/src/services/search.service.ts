import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';

import {
  HitsTotal,
  PaginateProps,
  QueryList,
  SearchResult,
  SellerGig,
} from '@francislagares/jobber-shared';

import { elasticSearchClient, getDocumentById } from '@authentication/elastic';

export const gigById = async (
  index: string,
  gigId: string,
): Promise<SellerGig> => {
  const gig = await getDocumentById(index, gigId);

  return gig;
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
