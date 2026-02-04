import apiClient from '@/api/client';
import { USE_MOCKS } from '@/config/constants';
import { User } from '@/types';
import { ENDPOINTS } from '@/config/endpoints';
import { getApiLang, mapUser } from '@/utils/apiAdapters';
import { mockUser, mockUsers } from '@/utils/mockData';

type LoginPayload = { email: string; password: string };
type RegisterPayload = { email: string; password: string; name: string };
const MOCK_PASSWORD = 'password';

const fetchProfile = async (token: string): Promise<User> => {
  const { data } = await apiClient.get<any>(ENDPOINTS.user.me(getApiLang()), {
    headers: { Authorization: `Bearer ${token}` },
  });
  const payload = data?.data ?? data;
  return mapUser(payload);
};

export type AuthResponse = { token: string; user: User };

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    if (USE_MOCKS) {
      if (payload.password !== MOCK_PASSWORD) {
        throw new Error('Невірний пароль (mock)');
      }
      const user =
        mockUsers.find((item) => item.email.toLowerCase() === payload.email.toLowerCase()) ??
        mockUser;
      return { token: `mock-token-${user.id}`, user };
    }
    const { data } = await apiClient.post<any>(ENDPOINTS.auth.login, {
      username: payload.email,
      password: payload.password,
    });

    const token: string =
      data?.token ?? data?.Token ?? data?.data?.token ?? data?.data?.Token ?? '';
    if (!token) throw new Error('Токен не получен при логине');
    const user = await fetchProfile(token);
    return { token, user };
  },
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    if (USE_MOCKS) {
      if (payload.password !== MOCK_PASSWORD) {
        throw new Error('Невірний пароль (mock)');
      }
      const user: User = {
        id: `mock-user-${Date.now()}`,
        email: payload.email,
        name: payload.name || payload.email,
        role: 'user',
        phone: '',
      };
      return { token: `mock-token-${user.id}`, user };
    }
    const { data } = await apiClient.post<any>(ENDPOINTS.auth.register, {
      username: payload.name || payload.email,
      password: payload.password,
      email: payload.email,
      phoneNumber: '',
      countryId: 1,
      discount: 0,
      roleName: 'Client',
    });
    const token: string =
      data?.token ?? data?.Token ?? data?.data?.token ?? data?.data?.Token ?? '';
    if (!token) throw new Error('Токен не получен при регистрации');
    const user = await fetchProfile(token);
    return { token, user };
  },
  resetPassword: async (email: string) => {
    if (USE_MOCKS) return Promise.resolve();
    await apiClient.post(ENDPOINTS.auth.reset, { email });
  },
  googleLogin: async (): Promise<AuthResponse> => {
    if (USE_MOCKS) {
      return { token: `mock-token-${mockUser.id}`, user: mockUser };
    }
    throw new Error('Google Login не реализован для боевого API');
  },
  getProfile: async (id: string) => {
    if (USE_MOCKS) {
      return mockUsers.find((item) => item.id === id) ?? mockUser;
    }
    const { data } = await apiClient.get<any>(ENDPOINTS.user.byId(id));
    const payload = data?.data ?? data;
    return mapUser(payload);
  },
  updateProfile: async (id: string, payload: Partial<User>) => {
    if (USE_MOCKS) {
      const base = mockUsers.find((item) => item.id === id) ?? mockUser;
      return { ...base, ...payload };
    }
    const request = {
      id: Number(id),
      username: payload.email ?? payload.name,
      email: payload.email,
      phoneNumber: payload.phone,
      countryId: 1,
      discount: 0,
      roleName: payload.role === 'owner' ? 'Owner' : payload.role === 'admin' ? 'Admin' : 'Client',
    };
    const { data } = await apiClient.put<any>(ENDPOINTS.user.update, request);
    const payloadData = data?.data ?? data;
    return mapUser(payloadData);
  },
};
