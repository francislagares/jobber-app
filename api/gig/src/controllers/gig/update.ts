import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  BadRequestError,
  isDataURL,
  SellerGig,
  uploadImage,
} from '@francislagares/jobber-shared';

import { updateActiveGigProp, updateGig } from '@gig/services/gig.service';

export const gigUpdate = async (req: Request, res: Response): Promise<void> => {
  const isDataUrl = isDataURL(req.body.coverImage);
  let coverImage = '';

  if (isDataUrl) {
    const result: UploadApiResponse = (await uploadImage(
      req.body.coverImage,
    )) as UploadApiResponse;

    if (!result.public_id) {
      throw new BadRequestError(
        'File upload error. Try again.',
        'Update gig() method',
      );
    }

    coverImage = result?.secure_url;
  } else {
    coverImage = req.body.coverImage;
  }
  const gig: SellerGig = {
    title: req.body.title,
    description: req.body.description,
    categories: req.body.categories,
    subCategories: req.body.subCategories,
    tags: req.body.tags,
    price: req.body.price,
    expectedDelivery: req.body.expectedDelivery,
    basicTitle: req.body.basicTitle,
    basicDescription: req.body.basicDescription,
    coverImage,
  };
  const updatedGig: SellerGig = await updateGig(req.params.gigId, gig);

  res
    .status(StatusCodes.OK)
    .json({ message: 'Gig updated successfully.', gig: updatedGig });
};

export const gigUpdateActive = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const updatedGig: SellerGig = await updateActiveGigProp(
    req.params.gigId,
    req.body.active,
  );

  res
    .status(StatusCodes.OK)
    .json({ message: 'Gig updated successfully.', gig: updatedGig });
};
