import { CreatePaymentPayload, PaymentResult } from './payment.types';

const MOCK_REDIRECT_URL = 'https://sandbox.liqpay.ua/mock/checkout';
const randomId = () => `mock-pay-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const paymentServiceMock = {
  async createPayment(payload: CreatePaymentPayload): Promise<PaymentResult> {
    await delay(400);
    const paymentId = randomId();
    const status = payload.method === 'hold' ? 'hold' : 'paid';
    return {
      paymentId,
      status,
      redirectUrl: MOCK_REDIRECT_URL,
    };
  },

  async confirmHold(paymentId: string): Promise<PaymentResult> {
    await delay(300);
    return {
      paymentId,
      status: 'paid',
      redirectUrl: MOCK_REDIRECT_URL,
    };
  },
};

export type PaymentServiceMock = typeof paymentServiceMock;
