import apiClient from '@/api/client';
import { USE_MOCKS } from '@/config/constants';
import { ENDPOINTS } from '@/config/endpoints';

export const notificationService = {
  registerDevice: async (token: string) => {
    if (USE_MOCKS) {
      console.log('Mock push token stored:', token);
      return;
    }
    await apiClient.post(ENDPOINTS.notifications.register, { token });
  },
};
