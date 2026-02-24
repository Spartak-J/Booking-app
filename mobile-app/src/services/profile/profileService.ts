import apiClient from '@/api/client';
import { ENDPOINTS } from '@/config/endpoints';
import { USE_MOCKS } from '@/config/constants';
import { User } from '@/types';
import { mapUserPatchToApiUpdateRequest } from '@/services/profile/profileMapper';
import { mockOffers, mockUser, mockUsers } from '@/utils/mockData';
import { mapUser } from '@/utils/apiAdapters';
import { toUserFacingApiError } from '@/utils/apiError';

export const profileService = {
  getProfile: async (id: string): Promise<User> => {
    if (USE_MOCKS) {
      return mockUsers.find((item) => item.id === id) ?? mockUser;
    }
    try {
      const { data } = await apiClient.get<any>(ENDPOINTS.user.byId(id));
      const payload = data?.data ?? data;
      return mapUser(payload);
    } catch (error) {
      throw toUserFacingApiError(error, 'Не удалось загрузить профиль.');
    }
  },

  updateProfile: async (id: string, payload: Partial<User>, currentUser?: User | null): Promise<User> => {
    if (USE_MOCKS) {
      const target = mockUsers.find((item) => item.id === id);
      if (target) {
        Object.assign(target, payload);
        // Keep owner snapshot inside offers in sync with edited owner profile.
        if (target.role === 'owner') {
          mockOffers.forEach((offer) => {
            if (offer.ownerId !== id || !offer.owner) return;
            if (typeof payload.name === 'string') {
              offer.owner.name = payload.name;
            }
            if (typeof payload.avatarUrl === 'string') {
              offer.owner.avatarUrl = payload.avatarUrl;
            }
          });
        }
        return target;
      }
      Object.assign(mockUser, payload);
      return mockUser;
    }
    try {
      const request = mapUserPatchToApiUpdateRequest(id, payload, currentUser);
      const { data } = await apiClient.put<any>(ENDPOINTS.user.update, request);
      const payloadData = data?.data ?? data;
      const mapped = mapUser(payloadData);
      return {
        ...mapped,
        name: payload.name ?? mapped.name ?? currentUser?.name ?? '',
        birthDate: payload.birthDate ?? mapped.birthDate ?? currentUser?.birthDate,
        phone: payload.phone ?? mapped.phone ?? currentUser?.phone,
        email: payload.email ?? mapped.email ?? currentUser?.email ?? '',
        country: payload.country ?? mapped.country ?? currentUser?.country,
      };
    } catch (error) {
      throw toUserFacingApiError(error, 'Не удалось обновить профиль.');
    }
  },
};
