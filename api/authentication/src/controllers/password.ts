import crypto from 'crypto';

import { config } from '@authentication/config';
import { publishDirectMessage } from '@authentication/queues/auth.producer';
import { authChannel } from '@authentication/server';
import {
  getAuthUserByEmail,
  updatePasswordToken,
} from '@authentication/services/auth.service';
import { BadRequestError } from '@francislagares/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const existingUser = await getAuthUserByEmail(email);

  if (!existingUser) {
    throw new BadRequestError(
      'Invalid credentials',
      'Password create() method error',
    );
  }

  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters = randomBytes.toString('hex');
  const date = new Date();

  date.setHours(date.getHours() + 1);
  await updatePasswordToken(existingUser.id, randomCharacters, date);

  const resetLink = `${config.CLIENT_URL}/reset-password?token=${randomCharacters}`;
  const messageDetails = {
    receiverEmail: existingUser.email,
    resetLink,
    username: existingUser.username,
    template: 'forgotPassword',
  };

  await publishDirectMessage(
    authChannel,
    'jobber-email-notification',
    'auth-email',
    JSON.stringify(messageDetails),
    'Forgot password message sent to notification service',
  );

  res.status(StatusCodes.OK).json({ message: 'Password reset email sent.' });
};
