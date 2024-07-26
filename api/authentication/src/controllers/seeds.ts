import crypto from 'crypto';

import { faker } from '@faker-js/faker';
import { Auth } from '@prisma/client';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sample } from 'lodash';
import { generateUsername } from 'unique-username-generator';
import { v4 as uuidV4 } from 'uuid';

import {
  BadRequestError,
  firstLetterUppercase,
  toLowerCase,
} from '@francislagares/jobber-shared';

import {
  createAuthUser,
  getAuthUserByUsernameOrEmail,
} from '@authentication/services/auth.service';

export const createUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { count } = req.params;
  const usernames: string[] = [];

  for (let i = 0; i < parseInt(count, 10); i++) {
    const username: string = generateUsername('', 0, 12);
    usernames.push(firstLetterUppercase(username));
  }

  for (const element of usernames) {
    const username = element;
    const email = faker.internet.email();
    const password = 'qwerty';
    const country = faker.location.country();
    const profilePicture = faker.image.urlPicsumPhotos();
    const checkIfUserExist: Auth | undefined =
      await getAuthUserByUsernameOrEmail(username, email);

    if (checkIfUserExist) {
      throw new BadRequestError(
        'Invalid credentials. Email or Username',
        'Seed create() method error',
      );
    }

    const profilePublicId = uuidV4();
    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters: string = randomBytes.toString('hex');
    const authData: Auth = {
      username: firstLetterUppercase(username),
      email: toLowerCase(email),
      profilePublicId,
      password,
      country,
      profilePicture,
      emailVerificationToken: randomCharacters,
      emailVerified: sample([true, false]) as unknown,
    } as Auth;

    await createAuthUser(authData);
  }
  res
    .status(StatusCodes.OK)
    .json({ message: 'Seed users created successfully.' });
};
