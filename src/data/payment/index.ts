// Repository: PaymentRepository for tokenized card operations via BFF payment endpoints.
import type { PaymentCard } from './types';
import apiClient from '@/api/client';
import { ENDPOINTS } from '@/config/endpoints';

export const PaymentRepository = {
  async getCards(userId = 'guest'): Promise<PaymentCard[]> {
    const { data } = await apiClient.get<any>(ENDPOINTS.payment.cards(userId));
    const list: any[] = Array.isArray(data) ? data : (data?.data ?? []);
    return list.map((item) => ({
      id: String(item?.id ?? ''),
      holderName: item?.holderName ?? '—',
      numberMasked: item?.numberMasked ?? '',
      last4: item?.last4 ?? '',
      expiry: item?.expiry ?? '',
      brand: (item?.brand ?? 'unknown') as PaymentCard['brand'],
      isDefault: Boolean(item?.isDefault),
      createdAt: item?.createdAt ?? new Date().toISOString(),
      token: item?.token,
    }));
  },

  async addCard(input: {
    userId?: string;
    holderName: string;
    number: string;
    expiry: string;
    cvv: string;
    saveCard?: boolean;
  }): Promise<PaymentCard> {
    const { data } = await apiClient.post<any>(ENDPOINTS.payment.tokenize, {
      userId: input.userId ?? 'guest',
      holderName: input.holderName,
      cardNumber: input.number,
      expiry: input.expiry,
      cvv: input.cvv,
      saveCard: input.saveCard ?? true,
    });

    const card = data?.card ?? data?.data?.card;
    if (!card) {
      throw new Error('Не вдалося токенізувати карту.');
    }

    return {
      id: String(card?.id ?? ''),
      holderName: card?.holderName ?? '—',
      numberMasked: card?.numberMasked ?? '',
      last4: card?.last4 ?? '',
      expiry: card?.expiry ?? '',
      brand: (card?.brand ?? 'unknown') as PaymentCard['brand'],
      isDefault: Boolean(card?.isDefault),
      createdAt: card?.createdAt ?? new Date().toISOString(),
      token: card?.token,
    };
  },

  async setDefault(cardId: string): Promise<void> {
    // Current BFF contract has no dedicated endpoint; keep API-compatible no-op.
    void cardId;
  },

  async chargeSavedCard(input: {
    userId?: string;
    cardId: string;
    bookingId: string;
    amount: number;
    currency: 'UAH';
  }) {
    const { data } = await apiClient.post<any>(ENDPOINTS.payment.chargeSavedCard, {
      userId: input.userId ?? 'guest',
      cardId: input.cardId,
      bookingId: input.bookingId,
      amount: input.amount,
      currency: input.currency,
    });
    return {
      paymentId: data?.paymentId ?? '',
      status: data?.status ?? 'failed',
      redirectUrl: data?.redirectUrl,
    };
  },
};
