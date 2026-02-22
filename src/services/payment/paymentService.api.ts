// Backend-ready API client for LiqPay integration.
// Expected backend endpoints:
// - POST /payments/create        body: { bookingId, amount, currency, method }  -> { paymentId, status, redirectUrl }
// - POST /payments/confirm-hold  body: { paymentId }                           -> { paymentId, status }
// Backend should handle LiqPay params/signature generation and callbacks.

import apiClient from '@/api/client';
import { ENDPOINTS } from '@/config/endpoints';
import {
  CreatePaymentPayload,
  PaymentStatus,
  PaymentResult,
  SaveTokenizedCardPayload,
  StartTokenizeCardPayload,
  TokenizeCardStatusResult,
} from './payment.types';

type PaymentEndpoints = {
  create: string;
  confirmHold: string;
  status: (paymentId: string) => string;
  tokenizeStart: string;
  tokenizeStatus: (paymentId: string) => string;
  tokenize: string;
};

type RawPaymentData = {
  paymentId?: string;
  id?: string | number;
  payment_id?: string | number;
  status?: string;
  redirectUrl?: string;
  redirect_url?: string;
  cardToken?: string;
  card?: TokenizeCardStatusResult['card'];
};

const paymentEndpoints = (ENDPOINTS as unknown as { payment?: Partial<PaymentEndpoints> }).payment;

const PAYMENT_ENDPOINTS: PaymentEndpoints = {
  create: paymentEndpoints?.create ?? '/Bff/payments/create',
  confirmHold: paymentEndpoints?.confirmHold ?? '/Bff/payments/confirm-hold',
  status: paymentEndpoints?.status ?? ((paymentId: string) => `/Bff/payments/status/${paymentId}`),
  tokenizeStart: paymentEndpoints?.tokenizeStart ?? '/Bff/payments/tokenize/start',
  tokenizeStatus:
    paymentEndpoints?.tokenizeStatus ??
    ((paymentId: string) => `/Bff/payments/tokenize/status/${paymentId}`),
  tokenize: paymentEndpoints?.tokenize ?? '/Bff/payments/tokenize',
};

const normalizeStatus = (status?: string): PaymentStatus => {
  if (status === 'hold' || status === 'paid' || status === 'failed' || status === 'cancelled') {
    return status;
  }
  return 'created';
};

const normalizeResult = (data: RawPaymentData): PaymentResult => ({
  paymentId: data.paymentId ?? String(data.id ?? data.payment_id ?? ''),
  status: normalizeStatus(data.status),
  redirectUrl: data.redirectUrl ?? data.redirect_url,
});

export const paymentServiceApi = {
  async createPayment(payload: CreatePaymentPayload): Promise<PaymentResult> {
    const { data } = await apiClient.post<RawPaymentData>(PAYMENT_ENDPOINTS.create, payload);
    return normalizeResult(data ?? {});
  },

  async confirmHold(paymentId: string): Promise<PaymentResult> {
    const { data } = await apiClient.post<RawPaymentData>(PAYMENT_ENDPOINTS.confirmHold, {
      paymentId,
    });
    return normalizeResult(data ?? {});
  },

  async getStatus(paymentId: string): Promise<PaymentResult> {
    const { data } = await apiClient.get<RawPaymentData>(PAYMENT_ENDPOINTS.status(paymentId));
    return normalizeResult(data ?? {});
  },

  async startTokenizeCard(payload: StartTokenizeCardPayload): Promise<PaymentResult> {
    const { data } = await apiClient.post<RawPaymentData>(PAYMENT_ENDPOINTS.tokenizeStart, payload);
    return normalizeResult(data ?? {});
  },

  async getTokenizeCardStatus(paymentId: string): Promise<TokenizeCardStatusResult> {
    const { data } = await apiClient.get<RawPaymentData>(
      PAYMENT_ENDPOINTS.tokenizeStatus(paymentId),
    );
    const normalizedData = data ?? {};
    return {
      paymentId: normalizedData.paymentId ?? String(normalizedData.id ?? ''),
      status: normalizeStatus(normalizedData.status),
      cardToken: normalizedData.cardToken,
      card: normalizedData.card ?? null,
      redirectUrl: normalizedData.redirectUrl ?? normalizedData.redirect_url,
    };
  },

  async saveTokenizedCard(payload: SaveTokenizedCardPayload): Promise<void> {
    await apiClient.post(PAYMENT_ENDPOINTS.tokenize, payload);
  },
};

export type PaymentServiceApi = typeof paymentServiceApi;
