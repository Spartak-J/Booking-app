export const formatPrice = (value: number, currency = 'USD'): string =>
  Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
