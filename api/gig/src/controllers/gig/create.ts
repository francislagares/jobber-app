import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  BadRequestError,
  SellerGig,
  uploadImage,
} from '@francislagares/jobber-shared';

import { createGig } from '@gig/services/gig.service';

export const create = async (req: Request, res: Response): Promise<void> => {
  const result: UploadApiResponse = (await uploadImage(
    req.body.coverImage,
  )) as UploadApiResponse;

  if (!result.public_id) {
    throw new BadRequestError(
      'File upload error. Try again.',
      'Create gig() method',
    );
  }

  const gig: SellerGig = {
    sellerId: req.body.sellerId,
    username: req.currentUser.username,
    email: req.currentUser.email,
    profilePicture: req.body.profilePicture,
    title: req.body.title,
    description: req.body.description,
    categories: req.body.categories,
    subCategories: req.body.subCategories,
    tags: req.body.tags,
    price: req.body.price,
    expectedDelivery: req.body.expectedDelivery,
    basicTitle: req.body.basicTitle,
    basicDescription: req.body.basicDescription,
    coverImage: `${result?.secure_url}`,
  };

  const createdGig: SellerGig = await createGig(gig);
  res
    .status(StatusCodes.CREATED)
    .json({ message: 'Gig created successfully.', gig: createdGig });
};
