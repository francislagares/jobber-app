import crypto from 'crypto';

import { config } from '@authentication/config';
import { publishDirectMessage } from '@authentication/queues/auth.producer';
import { authChannel } from '@authentication/server';
import {
  createAuthUser,
  getAuthUserByUsernameOrEmail,
  signToken,
} from '@authentication/services/auth.service';
import {
  BadRequestError,
  firstLetterUppercase,
  lowerCase,
  upload,
} from '@francislagares/jobber-shared';
import { Auth } from '@prisma/client';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

export const create = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, country, profilePicture } = req.body;
  const userExists = await getAuthUserByUsernameOrEmail(username, email);

  if (!userExists) {
    throw new BadRequestError(
      'Invalid credentials. Email or Username',
      'SignUp create() method error',
    );
  }

  const profilePublicId = uuidv4();
  const uploadResult: UploadApiResponse | UploadApiErrorResponse = await upload(
    profilePicture,
    `${profilePublicId}`,
    true,
    true,
  );

  if (!uploadResult.public_id) {
    throw new BadRequestError(
      'File upload error. Try again',
      'SignUp create method() error',
    );
  }

  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters = randomBytes.toString('hex');
  const authData = {
    username: firstLetterUppercase(username),
    email: lowerCase(email),
    profilePublicId,
    password,
    country,
    profilePicture: uploadResult?.secure_url,
    emailVerificationToken: randomCharacters,
  } as Auth;

  const result = await createAuthUser(authData);
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
    user: result,
    token: userJWT,
  });
};
