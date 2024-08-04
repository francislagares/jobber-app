import { Request, Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getCurrentUsername,
  getEmail,
  getUsername,
} from '@users/controllers/buyer/get';
import {
  authUserPayload,
  buyerDocument,
  buyerMockRequest,
  buyerMockResponse,
} from '@users/controllers/buyer/test/mocks/buyer.mock';
import * as buyer from '@users/services/buyer.service';

vi.mock('@users/services/buyer.service');
vi.mock('@francislagares/jobber-shared');
vi.mock('@elastic/elasticsearch');

describe('Buyer Controller', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('email method', () => {
    it('should return buyer profile data', async () => {
      const req: Request = buyerMockRequest(
        {},
        authUserPayload,
      ) as unknown as Request;
      const res: Response = buyerMockResponse();

      vi.spyOn(buyer, 'getBuyerByEmail').mockResolvedValue(buyerDocument);

      await getEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Buyer profile',
        buyer: buyerDocument,
      });
    });
  });

  describe('currentUser method', () => {
    it('should return buyer profile data', async () => {
      const req: Request = buyerMockRequest(
        {},
        authUserPayload,
      ) as unknown as Request;
      const res: Response = buyerMockResponse();

      vi.spyOn(buyer, 'getBuyerByUsername').mockResolvedValue(buyerDocument);

      await getCurrentUsername(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Buyer profile',
        buyer: buyerDocument,
      });
    });
  });

  describe('username method', () => {
    it('should return buyer profile data', async () => {
      const req: Request = buyerMockRequest({}, authUserPayload, {
        username: 'Manny',
      }) as unknown as Request;
      const res: Response = buyerMockResponse();

      vi.spyOn(buyer, 'getBuyerByUsername').mockResolvedValue(buyerDocument);

      await getUsername(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Buyer profile',
        buyer: buyerDocument,
      });
    });
  });
});
