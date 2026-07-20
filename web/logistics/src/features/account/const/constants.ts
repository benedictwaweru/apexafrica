import type { CardPattern } from "../types/types";

// four don't actually collide — kept explicit for clarity.
export const CARD_PATTERNS: CardPattern[] = [
  {
    provider: 'visa',
    // Starts with 4, total length 13, 16, or 19
    pattern: /^4\d{12}(?:\d{3})?(?:\d{3})?$/,
  },
  {
    provider: 'mastercard',
    // 51-55xxxx (older range) or 2221-2720xxxx (newer range), length 16
    pattern:
      /^(?:5[1-5]\d{2}|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)\d{12}$/,
  },
  {
    provider: 'amex',
    // Starts with 34 or 37, length 15
    pattern: /^3[47]\d{13}$/,
  },
  {
    provider: 'discover',
    // 6011, 65, 644-649, or 622126-622925, length 16 (or 19)
    pattern:
      /^(?:6011\d{12}(?:\d{3})?|65\d{14}(?:\d{3})?|64[4-9]\d{13}(?:\d{3})?|622(?:12[6-9]|1[3-9]\d|[2-8]\d{2}|91[0-9]|92[0-5])\d{10}(?:\d{3})?)$/,
  },
];
