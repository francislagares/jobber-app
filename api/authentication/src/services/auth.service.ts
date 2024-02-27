import { config } from '@authentication/config';
import { publishDirectMessage } from '@authentication/queues/auth.producer';
import { authChannel } from '@authentication/server';
import {
  AuthBuyerMessageDetails,
  firstLetterUppercase,
  lowerCase,
} from '@francislagares/jobber-shared';
import { Auth, PrismaClient } from '@prisma/client';
import bcrypt, { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

export const prisma = new PrismaClient().$extends({
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
      async comparePassword(password: string, hashedPassword: string) {
        return compare(password, hashedPassword);
      },
    },
  },
  // TODO: Create a function to exclude password field on signup
  /* result: {
    auth: {
      password: {
        needs: {},
        compute() {
          return undefined;
        },
      },
    },
  }, */
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

export const updateVerifyEmailField = async (
  authId: number,
  emailVerified: boolean,
  emailVerificationToken: string,
): Promise<void> => {
  await prisma.auth.update({
    where: {
      id: authId,
    },
    data: {
      emailVerified,
      emailVerificationToken,
    },
  });
};

export const updatePasswordToken = async (
  authId: number,
  token: string,
  tokenExpiration: string,
): Promise<void> => {
  await prisma.auth.update({
    where: {
      id: authId,
    },
    data: {
      passwordResetToken: token,
      passwordResetExpires: tokenExpiration,
    },
  });
};

export const updatePassword = async (
  authId: number,
  password: string,
): Promise<void> => {
  await prisma.auth.update({
    where: {
      id: authId,
    },
    data: {
      password,
      passwordResetToken: '',
      passwordResetExpires: new Date(),
    },
  });
};

export const signToken = (
  id: number,
  email: string,
  username: string,
): string => {
  return sign({ id, email, username }, config.JWT_TOKEN);
};
