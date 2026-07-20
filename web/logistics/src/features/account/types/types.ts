export type CardProvider = 'visa' | 'mastercard' | 'amex' | 'discover';

export interface CardPattern {
  provider: CardProvider;
  pattern: RegExp;
}
