import {
  getAuthUserByEmail,
  getAuthUserByUsername,
  prisma,
  signToken,
} from '@authentication/services/auth.service';
import { BadRequestError, isEmail } from '@francislagares/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const signIn = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  const isValidEmail = isEmail(username);
  const existingUser = !isValidEmail
    ? await getAuthUserByUsername(username)
    : await getAuthUserByEmail(username);

  if (!existingUser) {
    throw new BadRequestError(
      'User does not exist.',
      'SignIn read() method error',
    );
  }

  const passwordsMatch = await prisma.auth.comparePassword(
    password,
    existingUser.password,
  );

  debugger;

  if (!passwordsMatch) {
    throw new BadRequestError(
      'Invalid credentials',
      'SignIn read() method error',
    );
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
