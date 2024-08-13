/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as helper from '@francislagares/jobber-shared';
import { BadRequestError } from '@francislagares/jobber-shared';

import { create } from '@gig/controllers/gig/create';
import {
  authUserPayload,
  gigMockRequest,
  gigMockResponse,
  sellerGig,
} from '@gig/controllers/gig/test/mocks/gig.mock';
import * as gigService from '@gig/services/gig.service';

vi.mock('@gig/services/gig.service');
vi.mock('@francislagares/jobber-shared');
vi.mock('@gig/schemes/gig');
vi.mock('@gig/elastic');
vi.mock('@elastic/elasticsearch');

describe('Gig Controller', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Gig method', () => {
    vi.spyOn(helper, 'validateRequest').mockImplementation((): any =>
      Promise.resolve({ error: {} }),
    );
    it('should throw file upload error', () => {
      const req: Request = gigMockRequest(
        {},
        sellerGig,
        authUserPayload,
      ) as unknown as Request;
      const res: Response = gigMockResponse();

      vi.spyOn(helper, 'validateRequest').mockImplementation((): any =>
        Promise.resolve({ error: {} }),
      );
      vi.spyOn(helper, 'uploadImage').mockImplementation((): any =>
        Promise.resolve({ public_id: '' }),
      );

      create(req, res).catch(() => {
        expect(BadRequestError).toHaveBeenCalledWith(
          'File upload error. Try again.',
          'Create gig() method',
        );
      });
    });

    it('should create a new gig and return the correct response', async () => {
      const req: Request = gigMockRequest(
        {},
        sellerGig,
        authUserPayload,
      ) as unknown as Request;
      const res: Response = gigMockResponse();

      vi.spyOn(helper, 'validateRequest').mockImplementation((): any =>
        Promise.resolve({ error: {} }),
      );
      vi.spyOn(helper, 'uploadImage').mockImplementation((): any =>
        Promise.resolve({ public_id: '123456' }),
      );
      vi.spyOn(gigService, 'createGig').mockResolvedValue(sellerGig);

      await create(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Gig created successfully.',
        gig: sellerGig,
      });
    });
  });
});
