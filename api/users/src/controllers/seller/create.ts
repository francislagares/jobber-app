import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequestError, SellerDocument } from '@francislagares/jobber-shared';

import { createSeller, getSellerByEmail } from '@users/services/seller.service';

export const seller = async (req: Request, res: Response): Promise<void> => {
  const checkIfSellerExist: SellerDocument | null = await getSellerByEmail(
    req.body.email,
  );

  if (checkIfSellerExist) {
    throw new BadRequestError(
      'Seller already exist. Go to your account page to update.',
      'Create seller() method error',
    );
  }

  const seller: SellerDocument = {
    profilePublicId: req.body.profilePublicId,
    fullName: req.body.fullName,
    username: req.currentUser.username,
    email: req.body.email,
    profilePicture: req.body.profilePicture,
    description: req.body.description,
    oneliner: req.body.oneliner,
    country: req.body.country,
    skills: req.body.skills,
    languages: req.body.languages,
    responseTime: req.body.responseTime,
    experience: req.body.experience,
    education: req.body.education,
    socialLinks: req.body.socialLinks,
    certificates: req.body.certificates,
  };
  const createdSeller: SellerDocument = await createSeller(seller);

  res
    .status(StatusCodes.CREATED)
    .json({ message: 'Seller created successfully.', seller: createdSeller });
};
