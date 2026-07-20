import { CARD_PATTERNS } from '../const/constants';
import type { CardProvider } from '../types/types';

export function luhn(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s+/g, '').split('').map(Number);
  if (digits.some(isNaN)) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

/**
 * Validates a card number with the Luhn algorithm and identifies its
 * provider. Returns the provider name if the number is both Luhn-valid and
 * matches a known issuer prefix/length pattern; returns null otherwise
 * (including when the number is Luhn-valid but from an unsupported issuer).
 */
export function identifyCard(cardNumber: string): CardProvider | null {
  const cleaned = cardNumber.replace(/\s+/g, '');

  if (!/^\d+$/.test(cleaned)) return null;
  if (!luhn(cleaned)) return null;

  const match = CARD_PATTERNS.find(({ pattern }) => pattern.test(cleaned));
  return match ? match.provider : null;
}
