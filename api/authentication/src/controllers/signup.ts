import crypto from 'crypto';

import { Auth } from '@prisma/client';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import {
  BadRequestError,
  firstLetterUppercase,
  toLowerCase,
  uploadImage,
} from '@francislagares/jobber-shared';

import { config } from '@authentication/config';
import { prisma } from '@authentication/helpers/prisma';
import { publishDirectMessage } from '@authentication/queues/auth.producer';
import { authChannel } from '@authentication/server';
import {
  createAuthUser,
  getAuthUserByUsernameOrEmail,
  signToken,
} from '@authentication/services/auth.service';

export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, country, profilePicture } = req.body;
  const userExists = await getAuthUserByUsernameOrEmail(username, email);

  if (userExists) {
    throw new BadRequestError(
      'Invalid credentials. User already exists.',
      'SignUp create() method error',
    );
  }

  const profilePublicId = uuidv4();
  const uploadResult: UploadApiResponse | UploadApiErrorResponse =
    await uploadImage(profilePicture, `${profilePublicId}`, true, true);

  if (!uploadResult.public_id) {
    throw new BadRequestError(
      'File upload error. Try again',
      'SignUp create() method error',
    );
  }

  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters = randomBytes.toString('hex');
  const authData = {
    username: firstLetterUppercase(username),
    email: toLowerCase(email),
    profilePublicId,
    password,
    country,
    profilePicture: uploadResult?.secure_url,
    emailVerificationToken: randomCharacters,
  } as Auth;

  const result = await createAuthUser(authData);
  const authUser = await prisma.auth.excludePassword(result, ['password']);
  const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=${authData.emailVerificationToken}`;
  const messageDetails = {
    receiverEmail: result.email,
    verifyLink: verificationLink,
    template: 'verifyEmail',
  };

  await publishDirectMessage(
    authChannel,
    'jobber-email-notification',
    'auth-email',
    JSON.stringify(messageDetails),
    'Verify email message has been sent to notification service',
  );

  const userJWT = signToken(result.id, result.email, result.username);

  res.status(StatusCodes.CREATED).json({
    message: 'User created successfully.',
    user: authUser,
    token: userJWT,
  });
};
