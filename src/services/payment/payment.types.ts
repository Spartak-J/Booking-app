export type PaymentMethod = 'pay' | 'hold' | 'subscribe' | 'apay' | 'gpay';

export type PaymentStatus = 'created' | 'hold' | 'paid' | 'failed' | 'cancelled';

export interface CreatePaymentPayload {
  bookingId: string;
  amount: number;
  currency: 'UAH';
  method: PaymentMethod;
}

export interface PaymentResult {
  paymentId: string;
  status: PaymentStatus;
  redirectUrl?: string;
}
