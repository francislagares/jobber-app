import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { SellerDocument } from '@francislagares/jobber-shared';

import {
  getRandomSellers,
  getSellerById,
  getSellerByUsername,
} from '@users/services/seller.service';

export const getSellerId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const seller: SellerDocument | null = await getSellerById(
    req.params.sellerId,
  );

  res.status(StatusCodes.OK).json({ message: 'Seller profile', seller });
};

export const getSellerUsername = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const seller: SellerDocument | null = await getSellerByUsername(
    req.params.username,
  );

  res.status(StatusCodes.OK).json({ message: 'Seller profile', seller });
};

export const getRandom = async (req: Request, res: Response): Promise<void> => {
  const sellers: SellerDocument[] = await getRandomSellers(
    parseInt(req.params.size, 10),
  );

  res
    .status(StatusCodes.OK)
    .json({ message: 'Random sellers profile', sellers });
};
