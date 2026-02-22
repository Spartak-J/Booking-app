// Mock data: payment cards. Used by PaymentRepository.
import type { PaymentCard } from './types';

export const PAYMENT_CARDS: PaymentCard[] = [
  {
    id: 'card_001',
    holderName: 'Ірина Брицька',
    numberMasked: '0123 4567 5678 9101',
    last4: '9101',
    expiry: '01/2029',
    brand: 'mastercard',
    isDefault: true,
    createdAt: '2025-11-01T10:00:00.000Z',
  },
];
