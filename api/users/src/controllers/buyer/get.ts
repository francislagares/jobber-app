import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  getBuyerByEmail,
  getBuyerByUsername,
} from '@users/services/buyer.service';

export const getEmail = async (req: Request, res: Response): Promise<void> => {
  const buyer = await getBuyerByEmail(req.currentUser.email);

  res.status(StatusCodes.OK).json({ message: 'Buyer Profile', buyer });
};

export const getCurrentUsername = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const buyer = await getBuyerByUsername(req.currentUser.username);

  res.status(StatusCodes.OK).json({ message: 'Buyer profile', buyer });
};

export const getUsername = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const buyer = await getBuyerByUsername(req.params.username);

  res.status(StatusCodes.OK).json({ message: 'Buyer profile', buyer });
};
