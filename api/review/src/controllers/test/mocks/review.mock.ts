import { Response } from 'express';
import { vi } from 'vitest';

import { AuthPayload, ReviewDocument } from '@francislagares/jobber-shared';

export const reviewMockRequest = (
  sessionData: JWT,
  body: ReviewDocument,
  currentUser?: AuthPayload | null,
  params?: Params,
) => ({
  session: sessionData,
  body,
  params,
  currentUser,
});

export const reviewMockResponse = (): Response => {
  const res: Response = {} as Response;

  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);

  return res;
};

export interface JWT {
  jwt?: string;
}

export const authUserPayload: AuthPayload = {
  id: 2,
  username: 'Danny',
  email: 'danny@me.com',
  iat: 12345,
};

export interface Params {
  username?: string;
}

export const reviewDocument: ReviewDocument = {
  _id: '60263f14648fed5246e3452w',
  gigId: '60263f14648fed5246e322q4',
  reviewerId: '60263f14648fed5246e322q4',
  sellerId: '60263f14648fed5246e322q4',
  review: 'I love the job that was done',
  reviewerImage: 'https://placehold.co/600x400',
  rating: 5,
  orderId: '60263f14648fed5246e322e4',
  createdAt: '2023-10-20T07:42:24.451Z',
  reviewerUsername: 'Manny',
  country: 'Germany',
  reviewType: 'seller-review',
};
