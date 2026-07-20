import * as z from 'zod';

import { luhn } from '../libs/helpers';

export const accountTypeSchema = z.object({
  accountType: z.enum(['individual', 'business'], {
    error: () => ({ message: 'Please select an account type' }),
  }),
});

export const personaSelectionSchema = z.object({
  personae: z
    .array(z.enum(['shipper', 'transporter', 'warehouse']))
    .min(1, 'Please select at least one option'),
});

export const shipperDetailsSchema = z.object({});

export const carrierDetailsSchema = z.object({});

export const warehouseOperatorDetailsSchema = z.object({});

export const addMpesaPaymentSchema = z.object({});

export const addCardPaymentSchema = z.object({
  cardName: z.string().min(2, 'Name on card is required'),
  cardNumber: z
    .string()
    .min(1, 'Card number is required')
    .refine((val) => luhn(val), { message: 'Invalid card number' }),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{4}$/, 'Enter a valid expiry date (MM/YYYY)')
    .refine(
      (val) => {
        const [month, year] = val.split('/').map(Number);
        const now = new Date();
        const exp = new Date(year, month - 1);
        return exp > now;
      },
      { message: 'Card has expired' },
    ),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
  postalCode: z.string(),
});

export const accountSetupSchema = z.object({
  step1: accountTypeSchema,
  step2: personaSelectionSchema,
  step3: shipperDetailsSchema,
  step4: carrierDetailsSchema,
  step5: warehouseOperatorDetailsSchema,
  step6: addMpesaPaymentSchema,
  step7: addCardPaymentSchema,
});

export type AccountSetupValues = z.infer<typeof accountSetupSchema>
