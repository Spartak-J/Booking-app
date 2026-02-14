import apiClient from '@/api/client';
import { ENDPOINTS } from '@/config/endpoints';
import { USE_MOCKS } from '@/config/constants';
import { User } from '@/types';
import { mapUser } from '@/utils/apiAdapters';
import { USERS } from '@/data/users/users.mock';
import { toUserFacingApiError } from '@/utils/apiError';

const mapMockUserToDomain = (user: (typeof USERS)[number]): User => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  phone: user.phone,
  city: user.city,
  rating: user.rating,
  isBlocked: user.isBlocked,
});

export const usersAdminService = {
  getUsers: async (): Promise<User[]> => {
    if (USE_MOCKS) {
      return USERS.map(mapMockUserToDomain);
    }
    try {
      const { data } = await apiClient.get<any>(ENDPOINTS.user.all);
      const list: any[] = Array.isArray(data) ? data : (data?.data ?? []);
      return list.map(mapUser);
    } catch (error) {
      console.warn('[usersAdminService.getUsers] API fallback to empty list', error);
      return [];
    }
  },

  getUserById: async (id: string): Promise<User | null> => {
    if (USE_MOCKS) {
      const user = USERS.find((item) => item.id === id);
      return user ? mapMockUserToDomain(user) : null;
    }
    try {
      const { data } = await apiClient.get<any>(ENDPOINTS.user.byId(id));
      const payload = Array.isArray(data) ? data[0] : (data?.data ?? data);
      return payload ? mapUser(payload) : null;
    } catch (error) {
      console.warn('[usersAdminService.getUserById] API fallback to null', error);
      return null;
    }
  },

  toggleUserBlocked: async (id: string): Promise<User | null> => {
    if (USE_MOCKS) {
      const user = USERS.find((item) => item.id === id);
      if (!user) return null;
      user.isBlocked = !user.isBlocked;
      return mapMockUserToDomain(user);
    }
    const current = await usersAdminService.getUserById(id);
    if (!current) return null;
    const nextBlocked = !current.isBlocked;
    try {
      await apiClient.patch(ENDPOINTS.user.byId(id), { isBlocked: nextBlocked });
      return { ...current, isBlocked: nextBlocked };
    } catch (error) {
      throw toUserFacingApiError(error, 'Не удалось обновить статус блокировки пользователя.');
    }
  },
};
