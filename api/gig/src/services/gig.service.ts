import { SellerGig } from '@francislagares/jobber-shared';

import {
  addDataToIndex,
  deleteIndexedData,
  getIndexedData,
} from '@gig/elastic';
import { GigModel } from '@gig/models/gig.schema';
import { publishDirectMessage } from '@gig/queues/gig.producer';
import { gigChannel } from '@gig/server';

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

export const createGig = async (gig: SellerGig): Promise<SellerGig> => {
  const createdGig: SellerGig = await GigModel.create(gig);

  if (createdGig) {
    const data: SellerGig = createdGig.toJSON?.() as SellerGig;

    await publishDirectMessage(
      gigChannel,
      'jobber-seller-update',
      'user-seller',
      JSON.stringify({
        type: 'update-gig-count',
        gigSellerId: `${data.sellerId}`,
        count: 1,
      }),
      'Details sent to users service.',
    );

    await addDataToIndex('gigs', `${createdGig._id}`, data);
  }

  return createdGig;
};

export const deleteGig = async (
  gigId: string,
  sellerId: string,
): Promise<void> => {
  await GigModel.deleteOne({ _id: gigId }).exec();

  await publishDirectMessage(
    gigChannel,
    'jobber-seller-update',
    'user-seller',
    JSON.stringify({
      type: 'update-gig-count',
      gigSellerId: sellerId,
      count: -1,
    }),
    'Details sent to users service.',
  );

  await deleteIndexedData('gigs', `${gigId}`);
};
