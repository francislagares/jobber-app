import { Response } from 'express';
import { vi } from 'vitest';

import { AuthPayload, SellerGig } from '@francislagares/jobber-shared';

export const gigMockRequest = (
  sessionData: IJWT,
  body: SellerGig,
  currentUser?: AuthPayload | null,
  params?: IParams,
) => ({
  session: sessionData,
  body,
  params,
  currentUser,
});

export const gigMockResponse = (): Response => {
  const res: Response = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

export interface IJWT {
  jwt?: string;
}

export const authUserPayload: AuthPayload = {
  id: 2,
  username: 'Francis',
  email: 'francis@me.com',
  iat: 12345,
};

export interface IParams {
  username?: string;
}

export const sellerGig: SellerGig = {
  _id: '60263f14648fed5246e322d8',
  sellerId: '60263f14648fed5246e322e4',
  username: 'Francis',
  email: 'francis@test.com',
  profilePicture: '',
  title: 'I will do any job for you',
  description: 'I will do a great job for you at a very affordable price.',
  categories: 'programming',
  subCategories: ['Java', 'Javascript'],
  tags: ['Java', 'Javascript'],
  price: 50,
  expectedDelivery: '3',
  basicTitle: 'Do any job',
  basicDescription: 'I will do nay job',
  coverImage: '',
};
