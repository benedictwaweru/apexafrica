import { type TCountryCode, countries } from 'countries-list';

const LOCAL_FLAGS: Record<string, string> = {
  AC: '/flags/sh-ac.svg',
  TA: '/flags/sh-ta.svg',
}

export interface Country {
  code: TCountryCode;
  name: string;
  native: string;
  phone: number[];
  currency: string[];
}

export const africanCountries = (
  Object.entries(countries) as [
    TCountryCode,
    (typeof countries)[TCountryCode],
  ][]
)
  .filter(([, data]) => data.continent === 'AF')
  .map(([code, data]) => ({
    code,
    name: data.name,
    native: data.native,
    phone: data.phone,
    currency: data.currency,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const allCountries: Country[] = (
  Object.entries(countries) as [
    TCountryCode,
    (typeof countries)[TCountryCode],
  ][]
)
  .map(([code, data]) => ({
    code,
    name: data.name,
    native: data.native,
    phone: data.phone,
    currency: data.currency,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function getFlagUrl(code: string): string {
  return LOCAL_FLAGS[code] ?? `https://flagcdn.com/w20/${code.toLowerCase()}.png`
}
