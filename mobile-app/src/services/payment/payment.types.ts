import type { CurrencyCode } from '@/types/currency';

export type PaymentMethod = 'pay' | 'hold' | 'subscribe' | 'apay' | 'gpay';

export type PaymentStatus = 'created' | 'hold' | 'paid' | 'failed' | 'cancelled';

export interface CreatePaymentPayload {
  bookingId: string;
  amount: number;
  currency: CurrencyCode;
  method: PaymentMethod;
  offerId?: number;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export interface PaymentResult {
  paymentId: string;
  status: PaymentStatus;
  redirectUrl?: string;
}

export interface StartTokenizeCardPayload {
  userId: string;
  holderName: string;
}

export interface TokenizeCardStatusResult {
  paymentId: string;
  status: PaymentStatus;
  cardToken?: string;
  card?: {
    id: string;
    holderName: string;
    numberMasked: string;
    last4: string;
    expiry: string;
    brand: string;
    token?: string;
  } | null;
  redirectUrl?: string;
}

export interface SaveTokenizedCardPayload {
  userId: string;
  holderName: string;
  cardToken: string;
  last4: string;
  numberMasked: string;
  brand: string;
  expiry: string;
  saveCard: boolean;
}
