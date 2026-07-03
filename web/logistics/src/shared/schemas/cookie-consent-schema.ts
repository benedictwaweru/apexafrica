import { z } from 'zod';

export const cookieConsentSchema = z.object({
  isAccepted: z.boolean().or(z.undefined()),

  cookieType: z.object({
    essential: z.literal(true),
    analytics: z.boolean(),
    functional: z.boolean(),
    marketing: z.boolean(),
  }),

  timestamp: z.date().or(z.string()).or(z.undefined()),
});

export type CookieConsentSchema = z.infer<typeof cookieConsentSchema>;
