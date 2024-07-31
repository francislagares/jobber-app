import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { SellerDocument } from '@francislagares/jobber-shared';

import { updateSeller } from '@users/services/seller.service';

export const seller = async (req: Request, res: Response): Promise<void> => {
  const seller: SellerDocument = {
    profilePublicId: req.body.profilePublicId,
    fullName: req.body.fullName,
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
  const createdSeller: SellerDocument = await updateSeller(
    req.params.sellerId,
    seller,
  );

  res
    .status(StatusCodes.CREATED)
    .json({ message: 'Seller created successfully.', seller: createdSeller });
};
