import apiClient from '@/api/client';
import { USE_MOCKS } from '@/config/constants';
import { ApiResponse, User } from '@/types';
import { mockUser } from '@/utils/mockData';
import { ENDPOINTS } from '@/config/endpoints';

type LoginPayload = { email: string; password: string };
type RegisterPayload = { email: string; password: string; name: string };

export const authService = {
  login: async (payload: LoginPayload) => {
    if (USE_MOCKS) {
      return Promise.resolve({ token: 'mock-token', user: { ...mockUser, email: payload.email } });
    }
    const { data } = await apiClient.post<ApiResponse<{ token: string; user: User }>>(
      ENDPOINTS.auth.login,
      payload,
    );
    return data.data;
  },
  register: async (payload: RegisterPayload) => {
    if (USE_MOCKS) {
      const user: User = {
        ...mockUser,
        id: 'user-registered',
        email: payload.email,
        name: payload.name,
      };
      return Promise.resolve({ token: 'mock-token', user });
    }
    const { data } = await apiClient.post<ApiResponse<{ token: string; user: User }>>(
      ENDPOINTS.auth.register,
      payload,
    );
    return data.data;
  },
  resetPassword: async (email: string) => {
    if (USE_MOCKS) return Promise.resolve();
    await apiClient.post(ENDPOINTS.auth.reset, { email });
  },
  getProfile: async (id: string) => {
    if (USE_MOCKS) return Promise.resolve(mockUser);
    const { data } = await apiClient.get<ApiResponse<User>>(ENDPOINTS.user(id));
    return data.data;
  },
  updateProfile: async (id: string, payload: Partial<User>) => {
    if (USE_MOCKS) {
      return Promise.resolve({ ...mockUser, ...payload });
    }
    const { data } = await apiClient.patch<ApiResponse<User>>(ENDPOINTS.user(id), payload);
    return data.data;
  },
};
