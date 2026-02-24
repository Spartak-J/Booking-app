import { CreatePaymentPayload, PaymentResult } from './payment.types';

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
    };
  },

  async confirmHold(paymentId: string): Promise<PaymentResult> {
    await delay(300);
    return {
      paymentId,
      status: 'paid',
    };
  },

  async getStatus(paymentId: string): Promise<PaymentResult> {
    await delay(200);
    return {
      paymentId,
      status: 'paid',
    };
  },
};

export type PaymentServiceMock = typeof paymentServiceMock;
