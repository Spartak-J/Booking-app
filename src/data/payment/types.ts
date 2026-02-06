// Types: Payment data models used by PaymentRepository and UI screens.
export type PaymentCard = {
  id: string;
  holderName: string;
  numberMasked: string;
  last4: string;
  expiry: string;
  brand: 'mastercard' | 'visa' | 'paypal' | 'amex' | 'unknown';
  isDefault?: boolean;
  createdAt: string;
};
