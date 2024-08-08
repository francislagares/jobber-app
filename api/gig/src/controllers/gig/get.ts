import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { SellerGig } from '@francislagares/jobber-shared';

import {
  getGigById,
  getSellerGigs,
  getSellerPausedGigs,
} from '@gig/services/gig.service';

export const gigById = async (req: Request, res: Response): Promise<void> => {
  const gig: SellerGig = await getGigById(req.params.gigId);

  res.status(StatusCodes.OK).json({ message: 'Get gig by id', gig });
};

export const sellerGigs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const gigs: SellerGig[] = await getSellerGigs(req.params.sellerId);

  res.status(StatusCodes.OK).json({ message: 'Seller gigs', gigs });
};

export const sellerInactiveGigs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const gigs: SellerGig[] = await getSellerPausedGigs(req.params.sellerId);

  res.status(StatusCodes.OK).json({ message: 'Seller gigs', gigs });
};
