import Constants from 'expo-constants';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Constants.expoConfig?.extra as Record<string, unknown>)?.API_BASE_URL ||
  'https://api-gateway.example.com';

export const QUERY_CACHE_KEY = 'mobile-app-query-cache';

const envUseMocks =
  (Constants.expoConfig?.extra as Record<string, unknown>)?.USE_MOCKS ??
  process.env.EXPO_PUBLIC_USE_MOCKS;

export const USE_MOCKS =
  envUseMocks !== undefined ? envUseMocks === true || envUseMocks === 'true' : true; // default: use mocks until backend готов
