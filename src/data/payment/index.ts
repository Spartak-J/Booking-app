// Repository: PaymentRepository. Replace with API calls later without changing UI consumers.
import { PAYMENT_CARDS } from './payment.mock';
import type { PaymentCard } from './types';

let cards = [...PAYMENT_CARDS];

const normalizeNumber = (raw: string) => raw.replace(/\D/g, '');

const maskNumber = (raw: string) => {
  const digits = normalizeNumber(raw);
  if (!digits) return '';
  const groups = digits.match(/.{1,4}/g) ?? [];
  return groups.join(' ');
};

const detectBrand = (raw: string): PaymentCard['brand'] => {
  const digits = normalizeNumber(raw);
  if (digits.startsWith('4')) return 'visa';
  if (digits.startsWith('5')) return 'mastercard';
  if (digits.startsWith('3')) return 'amex';
  return 'unknown';
};

export const PaymentRepository = {
  async getCards(): Promise<PaymentCard[]> {
    return Promise.resolve(cards);
  },

  async addCard(input: {
    holderName: string;
    number: string;
    expiry: string;
  }): Promise<PaymentCard> {
    const numberMasked = maskNumber(input.number);
    const last4 = normalizeNumber(input.number).slice(-4);
    const card: PaymentCard = {
      id: `card_${Date.now()}`,
      holderName: input.holderName.trim() || '—',
      numberMasked,
      last4,
      expiry: input.expiry.trim(),
      brand: detectBrand(input.number),
      createdAt: new Date().toISOString(),
    };
    cards = [card, ...cards];
    return Promise.resolve(card);
  },

  async setDefault(cardId: string): Promise<void> {
    cards = cards.map((card) => ({ ...card, isDefault: card.id === cardId }));
    return Promise.resolve();
  },
};
