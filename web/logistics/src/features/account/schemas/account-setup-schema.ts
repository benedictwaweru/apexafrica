import * as z from 'zod';

import { luhn } from '../libs/helpers';

export const personaSelectionSchema = z.object({
  personae: z
    .array(z.enum(['shipper', 'transporter', 'warehouse']))
    .min(1, 'Please select at least one option'),
});

export const accountTypeSchema = z.object({
  accountType: z.enum(['individual', 'business'], {
    error: () => ({ message: 'Please select an account type' }),
  }),
});

export const businessDetailsSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  registrationNumber: z
    .string()
    .min(3, 'Business registration number is required'),
  businessEmail: z.email({ error: `Please enter a valid email address` }),
  kraPin: z
    .string()
    .regex(/^[A-Z]\d{9}[A-Z]$/, 'Enter a valid KRA PIN'),
  businessAddress: z.string().min(3, 'Location is required'),
  businessType: z.enum(
    ['sole_proprietorship', 'limited_company', 'partnership', 'ngo'],
    { error: () => ({ message: 'Select a business type' }) },
  ),
});

export const shipperDetailsSchema = z.object({
  pickupAddress: z.string().min(5, 'Pickup address is required'),
  monthlyShipmentVolume: z.enum(['1-10', '11-50', '51-200', '200+'], {
    error: () => ({ message: 'Select an estimated monthly shipment volume' }),
  }),
  preferredVehicleTypes: z
    .array(z.enum(['motorbike', 'van', 'truck', 'trailer']))
    .min(1, 'Please select at least one preferred vehicle type'),
});

export const carrierDetailsSchema = z.object({
  fleetSize: z.number().int().min(1, 'Fleet size must be at least 1'),
  vehicleTypes: z
    .array(z.enum(['motorbike', 'van', 'truck', 'trailer']))
    .min(1, 'Select at least one vehicle type'),
  licensePlate: z.string().min(4, 'License number is required'),
  operatingRegions: z
    .array(z.enum(['kenya', 'uganda', 'tanzania', 'rwanda']))
    .min(1, 'Select at least one operating region'),
});

export const warehouseOperatorDetailsSchema = z.object({
  warehouseName: z.string().min(2, 'Warehouse name is required'),
  storageCapacitySqm: z.number().positive('Enter a valid capacity in sqm'),
  warehouseLocation: z.string().min(3, 'Location is required'),
  hasColdStorage: z.boolean(),
});

export const addMpesaPaymentSchema = z.object({
  accountName: z.string().min(2, 'Name on M-Pesa account is required'),
  phoneNumber: z.string().regex(/^(?:\+254|0)7\d{8}$/, 'Enter a valid number'),
});

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
  step1: personaSelectionSchema,
  step2: accountTypeSchema,
  step3: businessDetailsSchema,
  step4: shipperDetailsSchema,
  step5: carrierDetailsSchema,
  step6: warehouseOperatorDetailsSchema,
  step7: addMpesaPaymentSchema,
  step8: addCardPaymentSchema,
});

export type AccountSetupValues = z.infer<typeof accountSetupSchema>;
