import { z } from 'zod';

export const signupSchema = z.object({
  username: z
    .string({
      required_error: 'Username is a required field',
      invalid_type_error: 'Username must be of type string',
    })
    .min(4, { message: 'Username must be 4 or more characters long' })
    .max(12, { message: 'Username must be 12 or fewer characters long' }),

  password: z
    .string({
      required_error: 'Password is a required field',
      invalid_type_error: 'Password must be of type string',
    })
    .min(4, { message: 'Password must be 4 or more characters long' })
    .max(12, { message: 'Password must be 12 or fewer characters long' }),

  email: z
    .string({
      required_error: 'Email is a required field',
      invalid_type_error: 'Email must be of type string',
    })
    .email({ message: 'Invalid email' }),

  country: z.string({
    required_error: 'Country is a required field',
    invalid_type_error: 'Country must be of type string',
  }),

  profilePicture: z.string({
    required_error: 'Profile picture is a required field',
    invalid_type_error: 'Profile picture must be of type string',
  }),
});
