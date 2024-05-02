import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  getAuthUserByUsername,
  signToken,
} from '@authentication/services/auth.service';

export const refreshToken = async (req: Request, res: Response) => {
  const existingUser = await getAuthUserByUsername(req.params.username);
  const userJWT = signToken(
    existingUser.id,
    existingUser.email,
    existingUser.username,
  );

  res
    .status(StatusCodes.OK)
    .json({ message: 'Refresh token', user: existingUser, token: userJWT });
};
