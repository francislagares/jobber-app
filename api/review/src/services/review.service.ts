import { map } from 'lodash';
import { QueryResult } from 'pg';

import {
  ReviewDocument,
  ReviewMessageDetails,
} from '@francislagares/jobber-shared';

import { PostgresDB } from '@review/config/database';
import { publishFanoutMessage } from '@review/queues/review.producer';
import { reviewChannel } from '@review/server';

interface IReviewerObjectKeys {
  [key: string]: string | number | Date | undefined;
}

const dbInstance = PostgresDB.getInstance();

const objKeys: IReviewerObjectKeys = {
  review: 'review',
  rating: 'rating',
  country: 'country',
  gigid: 'gigId',
  reviewerid: 'reviewerId',
  createdat: 'createdAt',
  orderid: 'orderId',
  sellerid: 'sellerId',
  reviewerimage: 'reviewerImage',
  reviewerusername: 'reviewerUsername',
  reviewtype: 'reviewType',
};

export const addReview = async (
  data: ReviewDocument,
): Promise<ReviewDocument> => {
  const {
    gigId,
    reviewerId,
    reviewerImage,
    sellerId,
    review,
    rating,
    orderId,
    reviewType,
    reviewerUsername,
    country,
  } = data;
  const createdAtDate = new Date();
  const { rows } = await dbInstance.pool.query(
    `INSERT INTO reviews(gigId, reviewerId, reviewerImage, sellerId, review, rating, orderId, reviewType, reviewerUsername, country, createdAt)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `,
    [
      gigId,
      reviewerId,
      reviewerImage,
      sellerId,
      review,
      rating,
      orderId,
      reviewType,
      reviewerUsername,
      country,
      createdAtDate,
    ],
  );
  const messageDetails: ReviewMessageDetails = {
    gigId: data.gigId,
    reviewerId: data.reviewerId,
    sellerId: data.sellerId,
    review: data.review,
    rating: data.rating,
    orderId: data.orderId,
    createdAt: `${createdAtDate}`,
    type: `${reviewType}`,
  };

  await publishFanoutMessage(
    reviewChannel,
    'jobber-review',
    JSON.stringify(messageDetails),
    'Review details sent to order and users services',
  );

  const result: ReviewDocument = Object.fromEntries(
    Object.entries(rows[0]).map(([key, value]) => [objKeys[key] || key, value]),
  );

  return result;
};

export const getReviewsByGigId = async (
  gigId: string,
): Promise<ReviewDocument[]> => {
  const reviews: QueryResult = await dbInstance.pool.query(
    'SELECT * FROM reviews WHERE reviews.gigId = $1',
    [gigId],
  );
  const mappedResult: ReviewDocument[] = map(reviews.rows, key => {
    return Object.fromEntries(
      Object.entries(key).map(([key, value]) => [objKeys[key] || key, value]),
    );
  });

  return mappedResult;
};

export const getReviewsBySellerId = async (
  sellerId: string,
): Promise<ReviewDocument[]> => {
  const reviews: QueryResult = await dbInstance.pool.query(
    'SELECT * FROM reviews WHERE reviews.sellerId = $1 AND reviews.reviewType = $2',
    [sellerId, 'seller-review'],
  );
  const mappedResult: ReviewDocument[] = map(reviews.rows, key => {
    return Object.fromEntries(
      Object.entries(key).map(([key, value]) => [objKeys[key] || key, value]),
    );
  });

  return mappedResult;
};
