// Backend-ready API client for LiqPay integration.
// Expected backend endpoints:
// - POST /payments/create        body: { bookingId, amount, currency, method }  -> { paymentId, status, redirectUrl }
// - POST /payments/confirm-hold  body: { paymentId }                           -> { paymentId, status }
// Backend should handle LiqPay params/signature generation and callbacks.

import apiClient from '@/api/client';
import { ENDPOINTS } from '@/config/endpoints';
import { CreatePaymentPayload, PaymentResult } from './payment.types';

const normalizeResult = (data: any): PaymentResult => ({
  paymentId: data?.paymentId ?? String(data?.id ?? data?.payment_id ?? ''),
  status: data?.status ?? 'created',
  redirectUrl: data?.redirectUrl ?? data?.redirect_url,
});

export const paymentServiceApi = {
  async createPayment(payload: CreatePaymentPayload): Promise<PaymentResult> {
    const { data } = await apiClient.post(ENDPOINTS.payment.create, payload);
    return normalizeResult(data);
  },

  async confirmHold(paymentId: string): Promise<PaymentResult> {
    const { data } = await apiClient.post(ENDPOINTS.payment.confirmHold, { paymentId });
    return normalizeResult(data);
  },

  async getStatus(paymentId: string): Promise<PaymentResult> {
    const { data } = await apiClient.get(ENDPOINTS.payment.status(paymentId));
    return normalizeResult(data);
  },
};

export type PaymentServiceApi = typeof paymentServiceApi;
