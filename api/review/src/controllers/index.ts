import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ReviewDocument } from '@francislagares/jobber-shared';

import {
  addReview,
  getReviewsByGigId,
  getReviewsBySellerId,
} from '@review/services/review.service';

export class Review {
  public async createReview(req: Request, res: Response): Promise<void> {
    const review: ReviewDocument = await addReview(req.body);

    res
      .status(StatusCodes.CREATED)
      .json({ message: 'Review created successfully.', review });
  }

  public async getReviewsByGigId(req: Request, res: Response): Promise<void> {
    const reviews: ReviewDocument[] = await getReviewsByGigId(req.params.gigId);

    res
      .status(StatusCodes.OK)
      .json({ message: 'Gig reviews by gig id', reviews });
  }

  public async getReviewsBySellerId(
    req: Request,
    res: Response,
  ): Promise<void> {
    const reviews: ReviewDocument[] = await getReviewsBySellerId(
      req.params.sellerId,
    );

    res
      .status(StatusCodes.OK)
      .json({ message: 'Gig reviews by seller id', reviews });
  }
}
