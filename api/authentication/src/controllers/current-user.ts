import crypto from 'crypto';

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequestError, toLowerCase } from '@francislagares/jobber-shared';

import { config } from '@authentication/config';
import { publishDirectMessage } from '@authentication/queues/auth.producer';
import { authChannel } from '@authentication/server';
import {
  getAuthUserByEmail,
  getAuthUserById,
  updateVerifyEmailField,
} from '@authentication/services/auth.service';

export const getCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  let user = null;
  const existingUser = await getAuthUserById(req.currentUser?.id);

  if (Object.keys(existingUser).length) {
    user = existingUser;
  }

  res.status(StatusCodes.OK).json({ message: 'Authenticated user', user });
};

export const resendEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email, userId } = req.body;
  const checkUserExists = await getAuthUserByEmail(toLowerCase(email));

  if (!checkUserExists) {
    throw new BadRequestError(
      'Email is invalid',
      'CurrentUser resendEmail() method error',
    );
  }

  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters = randomBytes.toString('hex');
  const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=${randomCharacters}`;

  await updateVerifyEmailField(parseInt(userId), false, randomCharacters);

  const messageDetails = {
    receiverEmail: toLowerCase(email),
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

  const updatedUser = await getAuthUserById(parseInt(userId));

  res.status(StatusCodes.OK).json({
    message: 'Email verification sent',
    user: updatedUser,
  });
};
