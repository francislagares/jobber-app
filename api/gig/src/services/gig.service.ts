import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

import {
  RatingTypes,
  ReviewMessageDetails,
  SellerDocument,
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

export const seedData = async (
  sellers: SellerDocument[],
  count: string,
): Promise<void> => {
  const categories: string[] = [
    'Graphics & Design',
    'Digital Marketing',
    'Writing & Translation',
    'Video & Animation',
    'Music & Audio',
    'Programming & Tech',
    'Data',
    'Business',
  ];
  const expectedDelivery: string[] = [
    '1 Day Delivery',
    '2 Days Delivery',
    '3 Days Delivery',
    '4 Days Delivery',
    '5 Days Delivery',
  ];
  const randomRatings = [
    { sum: 20, count: 4 },
    { sum: 10, count: 2 },
    { sum: 20, count: 4 },
    { sum: 15, count: 3 },
    { sum: 5, count: 1 },
  ];

  for (let i = 0; i < sellers.length; i++) {
    const sellerDoc: SellerDocument = sellers[i];
    const title = `I will ${faker.word.words(5)}`;
    const basicTitle = faker.commerce.productName();
    const basicDescription = faker.commerce.productDescription();
    const rating = sample(randomRatings);
    const gig: SellerGig = {
      profilePicture: sellerDoc.profilePicture,
      sellerId: sellerDoc._id,
      email: sellerDoc.email,
      username: sellerDoc.username,
      title: title.length <= 80 ? title : title.slice(0, 80),
      basicTitle:
        basicTitle.length <= 40 ? basicTitle : basicTitle.slice(0, 40),
      basicDescription:
        basicDescription.length <= 100
          ? basicDescription
          : basicDescription.slice(0, 100),
      categories: `${sample(categories)}`,
      subCategories: [
        faker.commerce.department(),
        faker.commerce.department(),
        faker.commerce.department(),
      ],
      description: faker.lorem.sentences({ min: 2, max: 4 }),
      tags: [
        faker.commerce.product(),
        faker.commerce.product(),
        faker.commerce.product(),
        faker.commerce.product(),
      ],
      price: parseInt(faker.commerce.price({ min: 20, max: 30, dec: 0 })),
      coverImage: faker.image.urlPicsumPhotos(),
      expectedDelivery: `${sample(expectedDelivery)}`,
      sortId: parseInt(count, 10) + i + 1,
      ratingsCount: (i + 1) % 4 === 0 ? rating['count'] : 0,
      ratingSum: (i + 1) % 4 === 0 ? rating['sum'] : 0,
    };

    console.log(`***SEEDING GIG*** - ${i + 1} of ${count}`);

    await createGig(gig);
  }
};
