import { Request, Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as helper from '@francislagares/jobber-shared';

import {
  getCurrentUser,
  resendEmail,
} from '@authentication/controllers/current-user';
import {
  authMock,
  authMockRequest,
  authMockResponse,
  authUserPayload,
} from '@authentication/controllers/test/mocks/auth.mock';
import * as auth from '@authentication/services/auth.service';

vi.mock('@francislagares/jobber-shared');
vi.mock('@authentication/services/auth.service');
vi.mock('@authentication/queues/auth.producer');
vi.mock('@elastic/elasticsearch');

const USERNAME = 'Francis';
const PASSWORD = 'password123';

describe('CurrentUser', () => {
  beforeEach(async () => {
    vi.resetAllMocks();
  });

  afterEach(async () => {
    vi.clearAllMocks();
  });

  describe('read method', () => {
    it('should return authenticated user', async () => {
      const req: Request = authMockRequest(
        {},
        { username: USERNAME, password: PASSWORD },
        authUserPayload,
      ) as unknown as Request;
      const res: Response = authMockResponse();

      vi.spyOn(auth, 'getAuthUserById').mockResolvedValue(authMock);

      await getCurrentUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Authenticated user',
        user: authMock,
      });
    });

    it('should return empty user', async () => {
      const req: Request = authMockRequest(
        {},
        { username: USERNAME, password: PASSWORD },
        authUserPayload,
      ) as unknown as Request;
      const res: Response = authMockResponse();

      vi.spyOn(auth, 'getAuthUserById').mockResolvedValue({} as never);

      await getCurrentUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Authenticated user',
        user: null,
      });
    });
  });

  describe('resendEmail method', () => {
    it('should call BadRequestError for invalid email', async () => {
      const req: Request = authMockRequest(
        {},
        { username: USERNAME, password: PASSWORD },
        authUserPayload,
      ) as unknown as Request;
      const res: Response = authMockResponse();

      vi.spyOn(auth, 'getAuthUserByEmail').mockResolvedValue({} as never);

      resendEmail(req, res).catch(() => {
        expect(helper.BadRequestError).toHaveBeenCalledWith(
          'Email is invalid',
          'CurrentUser resentEmail() method error',
        );
      });
    });

    it('should call updateVerifyEmailField method', async () => {
      const req: Request = authMockRequest(
        {},
        { username: USERNAME, password: PASSWORD },
        authUserPayload,
      ) as unknown as Request;
      const res: Response = authMockResponse();

      vi.spyOn(auth, 'getAuthUserByEmail').mockResolvedValue(authMock);

      await resendEmail(req, res);

      expect(auth.updateVerifyEmailField).toHaveBeenCalled();
    });

    it('should return authenticated user', async () => {
      const req: Request = authMockRequest(
        {},
        { username: USERNAME, password: PASSWORD },
        authUserPayload,
      ) as unknown as Request;
      const res: Response = authMockResponse();

      vi.spyOn(auth, 'getAuthUserByEmail').mockResolvedValue(authMock);
      vi.spyOn(auth, 'getAuthUserById').mockResolvedValue(authMock);

      await resendEmail(req, res);

      expect(auth.updateVerifyEmailField).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email verification sent',
        user: authMock,
      });
    });
  });
});
