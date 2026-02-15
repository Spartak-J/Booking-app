import apiClient from '@/api/client';
import { ENDPOINTS } from '@/config/endpoints';
import type { CurrencyCode } from '@/types/currency';

export type CurrencyRatesResponse = {
  baseCurrency: 'UAH';
  supportedCurrencies: CurrencyCode[];
  rates: Record<string, number>;
  updatedAtUtc?: string;
  source?: string;
  disclaimer?: string;
};

export const currencyService = {
  async getRates(forceRefresh = false): Promise<CurrencyRatesResponse> {
    const { data } = await apiClient.get<CurrencyRatesResponse>(ENDPOINTS.currency.rates, {
      params: forceRefresh ? { forceRefresh: true } : undefined,
    });
    return data;
  },
};
