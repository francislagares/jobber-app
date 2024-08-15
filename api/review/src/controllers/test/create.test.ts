import { Request, Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Review } from '@review/controllers';
import {
  authUserPayload,
  reviewDocument,
  reviewMockRequest,
  reviewMockResponse,
} from '@review/controllers/test/mocks/review.mock';
import * as reviewService from '@review/services/review.service';

vi.mock('@review/services/review.service');
vi.mock('@francislagares/jobber-shared');
vi.mock('@review/queues/connection');
vi.mock('@elastic/elasticsearch');

describe('Review Controller', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('review method', () => {
    it('should return the correct response', async () => {
      const req: Request = reviewMockRequest(
        {},
        reviewDocument,
        authUserPayload,
      ) as unknown as Request;
      const res: Response = reviewMockResponse();
      const reviewController = new Review();

      vi.spyOn(reviewService, 'addReview').mockResolvedValue(reviewDocument);

      await reviewController.createReview(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Review created successfully.',
        review: reviewDocument,
      });
    });
  });
});
