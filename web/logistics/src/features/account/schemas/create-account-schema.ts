import { z } from 'zod';

export const baseFormSchema = z.object({
  fullName: z.string(),
  username: z.email({ error: `Please enter a valid email address` }),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()-_=+])[A-Za-z\d!@#$%^&*()-_=+]{8,}$/,
      `Password must be at least 8 characters long with at least 1 uppercase, 1 lowercase, 1 number and 1 special character`,
    ),
  confirmPassword: z.string(),
  totp: z.string().regex(/^\d{6}$/, `Code must be 6 digits long`),
});

export const loginFormSchema = baseFormSchema.pick({
  username: true,
  password: true,
  totp: true,
});

export const signupFormSchema = baseFormSchema.pick({
  fullName: true,
  username: true,
  password: true,
});
