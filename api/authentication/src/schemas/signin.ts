import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string({
      required_error: 'Username is a required field',
      invalid_type_error: 'Username must be of type string',
    })
    .min(4, { message: 'Username must be 4 or more characters long' })
    .max(12, { message: 'Username must be 12 or fewer characters long' })
    .or(
      z
        .string({
          required_error: 'Email is a required field',
          invalid_type_error: 'Email must be of type string',
        })
        .email({ message: 'Invalid email' })
        .refine(value => {
          if (typeof value === 'string' && value.includes('@')) {
            return z.string().email().safeParse(value).success;
          }
          return z.string().min(4).max(12).safeParse(value).success;
        }),
    ),

  password: z
    .string({
      required_error: 'Password is a required field',
      invalid_type_error: 'Password must be of type string',
    })
    .min(4, { message: 'Password must be 4 or more characters long' })
    .max(12, { message: 'Password must be 12 or fewer characters long' }),
});
