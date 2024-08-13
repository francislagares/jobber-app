/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as helper from '@francislagares/jobber-shared';

import { createMessage } from '@chat/controllers/create';
import {
  authUserPayload,
  chatMockRequest,
  chatMockResponse,
  messageDocument,
} from '@chat/controllers/test/mocks/chat.mock';
import * as chatService from '@chat/services/message.service';

vi.mock('@chat/services/message.service');
vi.mock('@francislagares/jobber-shared');
vi.mock('@chat/schemes/message');
vi.mock('@elastic/elasticsearch');

describe('Chat Controller', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    delete messageDocument.hasConversationId;
    vi.clearAllMocks();
  });

  describe('message method', () => {
    it('should throw an error for invalid schema data', async () => {
      const req: Request = chatMockRequest(
        {},
        messageDocument,
        authUserPayload,
      ) as unknown as Request;
      const res: Response = chatMockResponse();

      vi.spyOn(helper, 'validateRequest').mockImplementation((): any =>
        Promise.resolve({
          error: {
            name: 'ValidationError',
            details: [{ message: 'This is an error message' }],
          },
        }),
      );

      createMessage(req, res).catch(() => {
        expect(helper.BadRequestError).toHaveBeenCalledWith(
          'This is an error message',
          'Create message() method',
        );
      });
    });

    it('should throw file upload error', async () => {
      const req: Request = chatMockRequest(
        {},
        messageDocument,
        authUserPayload,
      ) as unknown as Request;
      const res: Response = chatMockResponse();

      vi.spyOn(helper, 'validateRequest').mockImplementation((): any =>
        Promise.resolve({ error: {} }),
      );
      vi.spyOn(helper, 'uploadImage').mockImplementation((): any =>
        Promise.resolve({ public_id: '' }),
      );

      createMessage(req, res).catch(() => {
        expect(helper.BadRequestError).toHaveBeenCalledWith(
          'File upload error. Try again',
          'Create message() method',
        );
      });
    });

    it('should call createConversation method', async () => {
      messageDocument.hasConversationId = false;
      const req: Request = chatMockRequest(
        {},
        messageDocument,
        authUserPayload,
      ) as unknown as Request;
      const res: Response = chatMockResponse();

      vi.spyOn(helper, 'validateRequest').mockImplementation((): any =>
        Promise.resolve({ error: {} }),
      );
      vi.spyOn(helper, 'uploadImage').mockImplementation((): any =>
        Promise.resolve({ public_id: '123456' }),
      );
      vi.spyOn(chatService, 'createConversation');

      await createMessage(req, res);

      expect(chatService.createConversation).toHaveBeenCalledTimes(1);
    });

    it('should call addMessage method', async () => {
      messageDocument.hasConversationId = true;
      const req: Request = chatMockRequest(
        {},
        messageDocument,
        authUserPayload,
      ) as unknown as Request;
      const res: Response = chatMockResponse();

      vi.spyOn(helper, 'validateRequest').mockImplementation((): any =>
        Promise.resolve({ error: {} }),
      );
      vi.spyOn(helper, 'uploadImage').mockImplementation((): any =>
        Promise.resolve({ public_id: '123456' }),
      );
      vi.spyOn(chatService, 'addMessage');

      await createMessage(req, res);

      expect(chatService.addMessage).toHaveBeenCalledTimes(1);
    });

    it('should return correct json response', async () => {
      const req: Request = chatMockRequest(
        {},
        messageDocument,
        authUserPayload,
      ) as unknown as Request;
      const res: Response = chatMockResponse();

      vi.spyOn(helper, 'validateRequest').mockImplementation((): any =>
        Promise.resolve({ error: {} }),
      );
      vi.spyOn(helper, 'uploadImage').mockImplementation((): any =>
        Promise.resolve({ public_id: '123456' }),
      );

      await createMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Message added',
        conversationId: messageDocument.conversationId,
        messageData: messageDocument,
      });
    });
  });
});
