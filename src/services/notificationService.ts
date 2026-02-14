import apiClient from '@/api/client';
import { USE_MOCKS } from '@/config/constants';
import { ENDPOINTS } from '@/config/endpoints';
import { toUserFacingApiError } from '@/utils/apiError';

export const notificationService = {
  registerDevice: async (token: string) => {
    if (USE_MOCKS) {
      console.log('Mock push token stored:', token);
      return;
    }
    try {
      await apiClient.post(ENDPOINTS.notifications.register, { token });
    } catch (error) {
      throw toUserFacingApiError(error, 'Не удалось зарегистрировать push-уведомления.');
    }
  },
};
