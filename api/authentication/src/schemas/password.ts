import { z } from 'zod';

export const emailSchema = z.object({
  email: z
    .string({
      required_error: 'Email is a required field',
      invalid_type_error: 'Email must be of type string',
    })
    .email({ message: 'Invalid email' }),
});

export const passwordSchema = z
  .object({
    password: z
      .string({
        required_error: 'Password is a required field',
        invalid_type_error: 'Password must be of type string',
      })
      .min(4, { message: 'Password must be 4 or more characters long' })
      .max(12, { message: 'Password must be 12 or fewer characters long' }),
    confirmPassword: z
      .string()
      .min(4, { message: 'Password must be 4 or more characters long' })
      .max(12, { message: 'Password must be 12 or fewer characters long' }),
  })
  .refine(data => data.password !== data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // path of error
  });

export const changePasswordSchema = z.object({
  currentPassword: z
    .string({
      required_error: 'Password is a required field',
      invalid_type_error: 'Password must be of type string',
    })
    .min(4, { message: 'Password must be 4 or more characters long' })
    .max(12, { message: 'Password must be 12 or fewer characters long' }),
  newPassword: z
    .string({
      required_error: 'New password is a required field',
      invalid_type_error: 'New password must be of type string',
    })
    .min(4, { message: 'New password must be 4 or more characters long' })
    .max(12, { message: 'New password must be 12 or fewer characters long' }),
});
