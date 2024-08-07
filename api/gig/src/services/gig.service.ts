import {
  RatingTypes,
  ReviewMessageDetails,
  SellerGig,
} from '@francislagares/jobber-shared';

import {
  addDataToIndex,
  deleteIndexedData,
  getIndexedData,
  updateIndexedData,
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

export const updateGig = async (
  gigId: string,
  gigData: SellerGig,
): Promise<SellerGig> => {
  const document: SellerGig = await GigModel.findOneAndUpdate(
    { _id: gigId },
    {
      $set: {
        title: gigData.title,
        description: gigData.description,
        categories: gigData.categories,
        subCategories: gigData.subCategories,
        tags: gigData.tags,
        price: gigData.price,
        coverImage: gigData.coverImage,
        expectedDelivery: gigData.expectedDelivery,
        basicTitle: gigData.basicTitle,
        basicDescription: gigData.basicDescription,
      },
    },
    { new: true },
  ).exec();

  if (document) {
    const data: SellerGig = document.toJSON?.() as SellerGig;

    await updateIndexedData('gigs', `${document._id}`, data);
  }

  return document;
};

export const updateActiveGigProp = async (
  gigId: string,
  gigActive: boolean,
): Promise<SellerGig> => {
  const document: SellerGig = (await GigModel.findOneAndUpdate(
    { _id: gigId },
    {
      $set: {
        active: gigActive,
      },
    },
    { new: true },
  ).exec()) as SellerGig;

  if (document) {
    const data: SellerGig = document.toJSON?.() as SellerGig;

    await updateIndexedData('gigs', `${document._id}`, data);
  }

  return document;
};

export const updateGigReview = async (
  data: ReviewMessageDetails,
): Promise<void> => {
  const ratingTypes: RatingTypes = {
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
  };
  const ratingKey: string = ratingTypes[`${data.rating}`];
  const gig = await GigModel.findOneAndUpdate(
    { _id: data.gigId },
    {
      $inc: {
        ratingsCount: 1,
        ratingSum: data.rating,
        [`ratingCategories.${ratingKey}.value`]: data.rating,
        [`ratingCategories.${ratingKey}.count`]: 1,
      },
    },
    { new: true, upsert: true },
  ).exec();

  if (gig) {
    const data: SellerGig = gig.toJSON?.() as SellerGig;

    await updateIndexedData('gigs', `${gig._id}`, data);
  }
};
