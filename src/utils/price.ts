export const formatPrice = (value: number, currency = 'UAH', withCurrency = true): string => {
  const options: Intl.NumberFormatOptions = withCurrency
    ? { style: 'currency', currency, maximumFractionDigits: 0 }
    : { style: 'decimal', maximumFractionDigits: 0 };
  return Intl.NumberFormat('uk-UA', options).format(value);
};
