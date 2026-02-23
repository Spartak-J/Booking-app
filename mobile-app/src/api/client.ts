import axios from 'axios';
import { Platform } from 'react-native';

import { API_BASE_URL } from '@/config/constants';
import { getAuthState, useAuthStore } from '@/store/authStore';

const fallbackBaseUrls =
  Platform.OS === 'android'
    ? ['http://10.0.2.2:5000', 'http://localhost:5000']
    : ['http://localhost:5000'];

const apiBaseUrlCandidates = Array.from(
  new Set([API_BASE_URL, ...fallbackBaseUrls].filter((item) => Boolean(item && item.trim()))),
);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  const requestConfig = config as typeof config & { _apiRetryAttempt?: number };
  const attempt = requestConfig._apiRetryAttempt ?? 0;
  const candidateBaseUrl =
    apiBaseUrlCandidates[Math.min(attempt, apiBaseUrlCandidates.length - 1)] ?? API_BASE_URL;
  requestConfig.baseURL = candidateBaseUrl;

  const token = getAuthState().token;
  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config as
      | (Record<string, unknown> & { _apiRetryAttempt?: number })
      | undefined;
    const hasResponse = Boolean(error?.response);
    const canRetryNetworkError =
      !hasResponse && config && (config._apiRetryAttempt ?? 0) < apiBaseUrlCandidates.length - 1;

    if (canRetryNetworkError) {
      config._apiRetryAttempt = (config._apiRetryAttempt ?? 0) + 1;
      return apiClient(config as any);
    }

    if (error.response?.status === 401) {
      await useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export default apiClient;
