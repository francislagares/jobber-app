import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { reviewService } from '@gateway/services/review';

export class Review {
  public async createReview(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await reviewService.addReview(req.body);

    res
      .status(StatusCodes.CREATED)
      .json({ message: response.data.message, review: response.data.review });
  }

  public async reviewsByGigId(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await reviewService.getReviewsByGigId(
      req.params.gigId,
    );

    res
      .status(StatusCodes.OK)
      .json({ message: response.data.message, reviews: response.data.reviews });
  }

  public async reviewsBySellerId(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await reviewService.getReviewsBySellerId(
      req.params.sellerId,
    );

    res
      .status(StatusCodes.OK)
      .json({ message: response.data.message, reviews: response.data.reviews });
  }
}
