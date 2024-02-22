import { publishDirectMessage } from '@authentication/queues/auth.producer';
import { authChannel } from '@authentication/server';
import {
  AuthBuyerMessageDetails,
  firstLetterUppercase,
  lowerCase,
} from '@francislagares/jobber-shared';
import { Auth, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient().$extends({
  model: {
    auth: {
      async signUp(data: Auth) {
        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(data.password, salt);
        data.password = hashPass;

        return await prisma.auth.create({
          data,
        });
      },
    },
  },
  result: {
    auth: {
      password: {
        needs: {},
        compute() {
          return undefined;
        },
      },
    },
  },
});

export const createAuthUser = async (data: Auth): Promise<Auth> => {
  const authUser = await prisma.auth.signUp(data);

  const messageDetails: AuthBuyerMessageDetails = {
    username: authUser.username,
    email: authUser.email,
    profilePicture: authUser.profilePicture,
    country: authUser.country,
    createdAt: authUser.createdAt,
    type: 'auth',
  };

  await publishDirectMessage(
    authChannel,
    'jobber-buyer-update',
    'user-buyer',
    JSON.stringify(messageDetails),
    'Buyer details sent to buyer service',
  );

  return authUser;
};

export const getAuthUserById = async (id: number): Promise<Auth> => {
  const userId = await prisma.auth.findUnique({
    where: {
      id,
    },
  });

  return userId;
};

export const getAuthUserByUsernameOrEmail = async (
  username: string,
  email: string,
): Promise<Auth> => {
  const user = await prisma.auth.findFirst({
    where: {
      OR: [
        {
          username: {
            contains: firstLetterUppercase(username),
          },
        },
        {
          email: {
            contains: lowerCase(email),
          },
        },
      ],
    },
  });

  return user;
};

export const getAuthUserByUsername = async (
  username: string,
): Promise<Auth> => {
  const user = await prisma.auth.findUnique({
    where: {
      username: firstLetterUppercase(username),
    },
  });

  return user;
};

export const getAuthUserByEmail = async (email: string): Promise<Auth> => {
  const user = await prisma.auth.findUnique({
    where: {
      email: lowerCase(email),
    },
  });

  return user;
};

export const getAuthUserByVerificationToken = async (
  token: string,
): Promise<Auth> => {
  const user = await prisma.auth.findUnique({
    where: {
      emailVerificationToken: token,
    } as Auth,
  });

  return user;
};

export const getAuthUserByPasswordToken = async (
  token: string,
): Promise<Auth> => {
  const user = await prisma.auth.findFirst({
    where: {
      AND: [
        {
          passwordResetToken: token,
        },
        {
          passwordResetExpires: {
            gte: new Date(),
          },
        },
      ],
    },
  });

  return user;
};
