import { Response } from 'express';
import { vi } from 'vitest';

import { AuthPayload, BuyerDocument } from '@francislagares/jobber-shared';

export const buyerMockRequest = (
  sessionData: JWT,
  currentUser?: AuthPayload | null,
  params?: Params,
) => ({
  session: sessionData,
  params,
  currentUser,
});

export const buyerMockResponse = (): Response => {
  const res: Response = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

export interface JWT {
  jwt?: string;
}

export interface Params {
  username?: string;
}

export const authUserPayload: AuthPayload = {
  id: 1,
  username: 'Francis',
  email: 'francis@gmail.com',
  iat: 1235282483,
};

export const buyerDocument: BuyerDocument = {
  _id: '428475874bwhsqw2939829',
  username: 'Manny',
  email: 'manny@test.com',
  country: 'Brazil',
  profilePicture: '',
  isSeller: false,
  purchasedGigs: [],
  createdAt: '2023-12-19T07:42:24.431Z',
};
