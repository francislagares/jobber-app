import { prisma } from '@authentication/helpers/prisma';
import {
  getAuthUserByEmail,
  getAuthUserByUsername,
  signToken,
} from '@authentication/services/auth.service';
import { BadRequestError, isEmail } from '@francislagares/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const signIn = async (req: Request, res: Response): Promise<void> => {
  const { error } = req.body;

  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'SignIn method error');
  }

  const { username, password } = req.body;
  const isValidEmail = isEmail(username);
  const existingUser = !isValidEmail
    ? await getAuthUserByUsername(username)
    : await getAuthUserByEmail(username);

  if (!existingUser) {
    throw new BadRequestError('User does not exist.', 'SignIn method error');
  }

  const passwordsMatch = await prisma.auth.comparePassword(
    password,
    existingUser.password,
  );

  if (!passwordsMatch) {
    throw new BadRequestError('Invalid credentials', 'SignIn method error');
  }

  const userJWT = signToken(
    existingUser.id,
    existingUser.email,
    existingUser.username,
  );

  res.status(StatusCodes.OK).send({
    message: 'User login successfully',
    existingUser,
    token: userJWT,
  });
};
