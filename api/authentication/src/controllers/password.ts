import crypto from 'crypto';

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequestError } from '@francislagares/jobber-shared';

import { config } from '@authentication/config';
import { prisma } from '@authentication/helpers/prisma';
import { publishDirectMessage } from '@authentication/queues/auth.producer';
import { authChannel } from '@authentication/server';
import {
  getAuthUserByEmail,
  getAuthUserByPasswordToken,
  updatePassword,
  updatePasswordToken,
} from '@authentication/services/auth.service';

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const existingUser = await getAuthUserByEmail(email);

  if (!existingUser) {
    throw new BadRequestError(
      'Invalid credentials',
      'Password forgotPassword() method error',
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

export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { password, confirmPassword } = req.body;
  const { token } = req.params;

  if (password !== confirmPassword) {
    throw new BadRequestError(
      'Passwords do not match',
      'Password resetPassword() method error',
    );
  }

  const existingUser = await getAuthUserByPasswordToken(token);

  if (!existingUser) {
    throw new BadRequestError(
      'Reset token has expired',
      'Password resetPassword() method error',
    );
  }

  const hashedPassword = await prisma.auth.hashPassword(password);

  await updatePassword(existingUser.id, hashedPassword);

  const messageDetails = {
    username: existingUser.username,
    template: 'resetPasswordSuccess',
  };

  await publishDirectMessage(
    authChannel,
    'jobber-email-notification',
    'auth-email',
    JSON.stringify(messageDetails),
    'Reset password success message sent to notification service',
  );

  res
    .status(StatusCodes.OK)
    .json({ message: 'Password successfully updated.' });
};

export const changePassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { password, confirmPassword } = req.body;
  const { token } = req.params;

  if (password !== confirmPassword) {
    throw new BadRequestError(
      'Passwords do not match',
      'Password changePassword() method error',
    );
  }

  const existingUser = await getAuthUserByPasswordToken(token);

  if (!existingUser) {
    throw new BadRequestError(
      'Reset token has expired',
      'Password changePassword() method error',
    );
  }

  const hashedPassword = await prisma.auth.hashPassword(password);

  await updatePassword(existingUser.id, hashedPassword);

  const messageDetails = {
    username: existingUser.username,
    template: 'changePasswordSuccess',
  };

  await publishDirectMessage(
    authChannel,
    'jobber-email-notification',
    'auth-email',
    JSON.stringify(messageDetails),
    'Reset password success message sent to notification service',
  );

  res
    .status(StatusCodes.OK)
    .json({ message: 'Password successfully updated.' });
};
