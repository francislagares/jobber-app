import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sortBy } from 'lodash';

import { PaginateProps, SearchResult } from '@francislagares/jobber-shared';

import { gigsSearch } from '@authentication/services/search.service';

export const searchGigs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { from, size, type } = req.params;
  let hits = [];
  const paginate: PaginateProps = {
    from,
    size: parseInt(`${size}`),
    type,
  };
  const gigs: SearchResult = await gigsSearch(
    `${req.query.query}`,
    paginate,
    `${req.query.deliveryTime}`,
    parseInt(`${req.params.minPrice}`),
    parseInt(`${req.params.maxPrice}`),
  );

  for (const item of gigs.hits) {
    hits.push(item._source);
  }

  if (type === 'backward') {
    hits = sortBy(hits, ['sortId']);
  }

  res
    .status(StatusCodes.OK)
    .json({ message: 'Search gigs results', total: gigs.total, gigs: hits });
};
