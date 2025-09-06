export type SupportedCurrency = 'BDT' | 'USD';

interface RateTable { [base: string]: { [target: string]: number } }

// Static fallback rates; in future could be updated from remote source.
const RATES: RateTable = {
  USD: { USD: 1, BDT: 110 },
  BDT: { BDT: 1, USD: 1/110 }
};

export const convert = (amount: number, from: SupportedCurrency, to: SupportedCurrency): number => {
  const rate = RATES[from]?.[to];
  if (!rate) return amount; // graceful fallback
  return amount * rate;
};

export const formatMoney = (amount: number, currency: SupportedCurrency, locale = 'en-US'): string => {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
};

export const summarizeIn = (amount: number, currency: SupportedCurrency, target: SupportedCurrency): number => {
  return convert(amount, currency, target);
};

export const batchConvertTo = (items: Array<{ amount: number; currency: SupportedCurrency }>, target: SupportedCurrency): number => {
  return items.reduce((sum, i) => sum + convert(i.amount, i.currency, target), 0);
};