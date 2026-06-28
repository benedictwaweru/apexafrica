import * as z from 'zod';

export const emailFieldSchema = z.email({
  error: `Please enter a valid email address`,
});

export const passwordFieldSchema = z
  .string()
  .regex(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()-_=+])[A-Za-z\d!@#$%^&*()-_=+]{8,}$/,
    `Password must be at least 8 characters long with at least 1 uppercase, 1 lowercase, 1 number and 1 special character`,
  );

export const credentialsSchema = z.object({
  email: emailFieldSchema,
  password: passwordFieldSchema,
});

export type CredentialsValues = z.infer<typeof credentialsSchema>;

export const totpFieldSchema = z
  .string()
  .min(1, 'Authentication code is required')
  .length(6, 'Code must be exactly 6 digits')

export const mfaSchema = z.object({
  code: totpFieldSchema,
});

export type MFAValues = z.infer<typeof mfaSchema>;
