import Constants from 'expo-constants';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Constants.expoConfig?.extra as Record<string, unknown>)?.API_BASE_URL ||
  'http://localhost:5000';

export const QUERY_CACHE_KEY = 'mobile-app-query-cache';

const envUseMocks =
  (Constants.expoConfig?.extra as Record<string, unknown>)?.USE_MOCKS ??
  process.env.EXPO_PUBLIC_USE_MOCKS;

export const USE_MOCKS =
  envUseMocks !== undefined ? envUseMocks === true || envUseMocks === 'true' : true; // default: работаем на моках

const envUsePaymentMocks =
  (Constants.expoConfig?.extra as Record<string, unknown>)?.USE_MOCKS_PAYMENT ??
  (Constants.expoConfig?.extra as Record<string, unknown>)?.EXPO_PUBLIC_USE_MOCKS_PAYMENT ??
  process.env.EXPO_PUBLIC_USE_MOCKS_PAYMENT;

export const USE_MOCKS_PAYMENT =
  envUsePaymentMocks !== undefined
    ? envUsePaymentMocks === true || envUsePaymentMocks === 'true'
    : USE_MOCKS;

export const DEFAULT_LANG =
  ((Constants.expoConfig?.extra as Record<string, unknown>)?.LANG as string) ||
  process.env.EXPO_PUBLIC_LANG ||
  'en';
