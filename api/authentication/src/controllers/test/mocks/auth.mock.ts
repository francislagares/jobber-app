import { Auth } from '@prisma/client';
import { Response } from 'express';
import { vi } from 'vitest';

import { AuthPayload } from '@francislagares/jobber-shared';

export const authMockRequest = (
  sessionData: JWT,
  body: AuthMock,
  currentUser?: AuthPayload | null,
  params?: unknown,
) => ({
  session: sessionData,
  body,
  params,
  currentUser,
});

export const authMockResponse = (): Response => {
  const res: Response = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

export interface JWT {
  jwt?: string;
}

export interface AuthMock {
  id?: number;
  username: string;
  email?: string;
  password?: string;
  createdAt?: Date | string;
}

export const authUserPayload: AuthPayload = {
  id: 1,
  username: 'Francis',
  email: 'francis@gmail.com',
  iat: 1235282483,
};

export const authMock: Auth = {
  id: 1,
  profilePublicId: '123428712838478382',
  username: 'Manny',
  email: 'manny@test.com',
  country: 'Brazil',
  profilePicture: '',
  emailVerified: 1,
  createdAt: '2023-12-19T07:42:24.431Z',
  comparePassword: () => {},
  hashPassword: () => false,
} as unknown as Auth;
