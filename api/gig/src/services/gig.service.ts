import { SellerGig } from '@francislagares/jobber-shared';

import { getIndexedData } from '@gig/elastic';

import { gigsSearchBySellerId } from './search.service';

export const getGigById = async (sellerId: string): Promise<SellerGig> => {
  const gig = await getIndexedData('gigs', sellerId);

  return gig;
};

export const getSellerGigs = async (sellerId: string): Promise<SellerGig[]> => {
  const resultHits: SellerGig[] = [];

  const gigs = await gigsSearchBySellerId(sellerId, true);

  for (const item of gigs.hits) {
    resultHits.push(item._source as SellerGig);
  }

  return resultHits;
};

export const getSellerPausedGigs = async (
  sellerId: string,
): Promise<SellerGig[]> => {
  const resultHits: SellerGig[] = [];

  const gigs = await gigsSearchBySellerId(sellerId, false);

  for (const item of gigs.hits) {
    resultHits.push(item._source as SellerGig);
  }

  return resultHits;
};
