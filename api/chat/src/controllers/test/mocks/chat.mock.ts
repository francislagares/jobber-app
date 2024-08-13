import { Response } from 'express';
import { vi } from 'vitest';

import { AuthPayload, MessageDocument } from '@francislagares/jobber-shared';

export const chatMockRequest = (
  sessionData: JWT,
  body: MessageDocument,
  currentUser?: AuthPayload | null,
  params?: Params,
) => ({
  session: sessionData,
  body,
  params,
  currentUser,
});

export const chatMockResponse = (): Response => {
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

export const messageDocument: MessageDocument = {
  conversationId: '60263f14648fed5246e322e4',
  body: 'I am sending this message to you',
  file: '',
  fileType: 'png',
  fileSize: '2MB',
  fileName: 'tester',
  gigId: '60263f14648fed5246e322q4',
  sellerId: '60263f14648fed5246e322q4',
  buyerId: '50263f14648fed4346e322d4',
  senderUsername: 'Manny',
  senderPicture: '',
  receiverUsername: 'Sunny',
  receiverPicture: '',
  isRead: false,
  hasOffer: false,
  offer: undefined,
};
