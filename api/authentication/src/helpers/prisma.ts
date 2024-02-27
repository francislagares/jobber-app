import { Auth, PrismaClient } from '@prisma/client';
import bcrypt, { compare } from 'bcrypt';

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

      async excludePassword<Auth, Key extends keyof Auth>(
        authUser: Auth,
        keys: Key[],
      ): Promise<Omit<Auth, Key>> {
        return Object.fromEntries(
          Object.entries(authUser).filter(
            ([key]) => !keys.includes(key as Key),
          ),
        ) as Omit<Auth, Key>;
      },
    },
  },
});
