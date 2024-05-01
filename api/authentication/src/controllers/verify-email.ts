import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequestError } from '@francislagares/jobber-shared';

import {
  getAuthUserById,
  getAuthUserByVerificationToken,
  updateVerifyEmailField,
} from '@authentication/services/auth.service';

export const verifyEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { token } = req.body;
  const userExists = await getAuthUserByVerificationToken(token);

  if (!userExists) {
    throw new BadRequestError(
      'Verification token is either invalid or already in use',
      'VerifyEmail update() method error',
    );
  }

  await updateVerifyEmailField(userExists.id, true, '');
  const updatedUser = await getAuthUserById(userExists.id);

  res
    .status(StatusCodes.OK)
    .send({ message: 'Email verified successfully', user: updatedUser });
};
