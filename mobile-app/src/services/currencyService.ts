import apiClient from '@/api/client';
import { ENDPOINTS } from '@/config/endpoints';
import type { CurrencyCode } from '@/types/currency';

type CurrencyEndpoints = {
  rates: string;
};

export type CurrencyRatesResponse = {
  baseCurrency: CurrencyCode;
  supportedCurrencies: CurrencyCode[];
  rates: Partial<Record<CurrencyCode, number>>;
  updatedAtUtc?: string;
  source?: string;
  disclaimer?: string;
  refreshSucceeded?: boolean;
  refreshError?: string;
};

const currencyEndpoints = (ENDPOINTS as unknown as { currency?: Partial<CurrencyEndpoints> })
  .currency;
const CURRENCY_RATES_ENDPOINT = currencyEndpoints?.rates ?? '/Bff/currency/rates';

export const currencyService = {
  async getRates(forceRefresh = false): Promise<CurrencyRatesResponse> {
    const { data } = await apiClient.get<CurrencyRatesResponse>(CURRENCY_RATES_ENDPOINT, {
      params: forceRefresh ? { forceRefresh: true } : undefined,
    });
    return data;
  },
};
