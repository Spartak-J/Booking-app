import { convertFromUah, getCurrentCurrency } from '@/store/currencyStore';
import type { CurrencyCode } from '@/types/currency';

export const formatPrice = (
  value: number,
  currency?: CurrencyCode,
  withCurrency = true,
): string => {
  const targetCurrency = currency ?? getCurrentCurrency();
  const normalizedValue = convertFromUah(value, targetCurrency);
  const options: Intl.NumberFormatOptions = withCurrency
    ? { style: 'currency', currency: targetCurrency, maximumFractionDigits: 0 }
    : { style: 'decimal', maximumFractionDigits: 0 };
  return Intl.NumberFormat('uk-UA', options).format(normalizedValue);
};
