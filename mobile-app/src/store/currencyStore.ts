import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import { currencyService } from '@/services/currencyService';
import { CurrencyCode, SUPPORTED_CURRENCIES } from '@/types/currency';

const CURRENCY_KEY = 'app_currency';

const defaultRates: Record<CurrencyCode, number> = {
  UAH: 1,
  USD: 0,
  EUR: 0,
  GBP: 0,
  PLN: 0,
  CHF: 0,
  CAD: 0,
  TRY: 0,
};

type CurrencyState = {
  currency: CurrencyCode;
  rates: Record<CurrencyCode, number>;
  updatedAtUtc?: string;
  isLoadingRates: boolean;
  hydrate: () => Promise<void>;
  setCurrency: (currency: CurrencyCode) => Promise<void>;
  refreshRates: (forceRefresh?: boolean) => Promise<void>;
  convertFromUah: (amount: number, toCurrency?: CurrencyCode) => number;
};

const normalizeCurrency = (value?: string): CurrencyCode => {
  if (!value) return 'UAH';
  const upper = value.toUpperCase();
  return (SUPPORTED_CURRENCIES as string[]).includes(upper) ? (upper as CurrencyCode) : 'UAH';
};

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  currency: 'UAH',
  rates: defaultRates,
  updatedAtUtc: undefined,
  isLoadingRates: false,
  hydrate: async () => {
    const saved = await SecureStore.getItemAsync(CURRENCY_KEY);
    const currency = normalizeCurrency(saved ?? undefined);
    set({ currency });
    await get().refreshRates(false);
  },
  setCurrency: async (currency: CurrencyCode) => {
    await SecureStore.setItemAsync(CURRENCY_KEY, currency);
    set({ currency });
  },
  refreshRates: async (forceRefresh = false) => {
    set({ isLoadingRates: true });
    try {
      const response = await currencyService.getRates(forceRefresh);
      const nextRates: Record<CurrencyCode, number> = {
        ...defaultRates,
        UAH: 1,
      };
      for (const code of SUPPORTED_CURRENCIES) {
        const raw = response?.rates?.[code];
        if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) {
          nextRates[code] = raw;
        }
      }
      set({
        rates: nextRates,
        updatedAtUtc: response.updatedAtUtc,
      });
    } catch (error) {
      console.warn('[currencyStore.refreshRates] failed', error);
    } finally {
      set({ isLoadingRates: false });
    }
  },
  convertFromUah: (amount: number, toCurrency?: CurrencyCode) => {
    const target = toCurrency ?? get().currency;
    if (target === 'UAH') return amount;
    const rate = get().rates[target];
    if (!rate || rate <= 0) return amount;
    return amount / rate;
  },
}));

export const getCurrentCurrency = () => useCurrencyStore.getState().currency;
export const convertFromUah = (amount: number, toCurrency?: CurrencyCode) =>
  useCurrencyStore.getState().convertFromUah(amount, toCurrency);
