import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sortBy } from 'lodash';

import {
  PaginateProps,
  SearchResult,
  SellerGig,
} from '@francislagares/jobber-shared';

import { gigsSearch } from '@gig/services/search.service';

export const searchGigs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { from, size, type } = req.params;
  let resultHits: SellerGig[] = [];
  const paginate: PaginateProps = { from, size: parseInt(`${size}`), type };
  const gigs: SearchResult = await gigsSearch(
    `${req.query.query}`,
    paginate,
    `${req.query.delivery_time}`,
    parseInt(`${req.query.minprice}`),
    parseInt(`${req.query.maxprice}`),
  );

  for (const item of gigs.hits) {
    resultHits.push(item._source as SellerGig);
  }

  if (type === 'backward') {
    resultHits = sortBy(resultHits, ['sortId']);
  }

  res.status(StatusCodes.OK).json({
    message: 'Search gigs results',
    total: gigs.total,
    gigs: resultHits,
  });
};
