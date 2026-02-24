import apiClient from '@/api/client';
import { USE_MOCKS_AUTH } from '@/config/constants';
import { User } from '@/types';
import { ENDPOINTS } from '@/config/endpoints';
import { getApiLang, mapUser } from '@/utils/apiAdapters';
import { mockUser, mockUsers } from '@/utils/mockData';
import { toUserFacingApiError } from '@/utils/apiError';

type LoginPayload = { email: string; password: string };
type RegisterPayload = { email: string; password: string; name: string; role?: User['role'] };
const MOCK_PASSWORD = 'password';
const OWNER_EMAIL = 'owner@oselya.app';
const ADMIN_EMAIL = 'admin@oselya.app';

const resolveRoleByEmail = (email: string): User['role'] | null => {
  const normalized = email.trim().toLowerCase();
  if (normalized === OWNER_EMAIL) return 'owner';
  if (normalized === ADMIN_EMAIL) return 'admin';
  return null;
};

const shortHash = (value: string): string => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36).slice(0, 6);
};

const buildUsernameFromEmail = (email: string): string => {
  const normalized = email.trim().toLowerCase();
  const [localPart] = normalized.split('@');
  const base = localPart && localPart.length > 0 ? localPart : normalized;
  return `${base}_${shortHash(normalized)}`;
};

const resolveLoginUsernames = (email: string): string[] => {
  const normalized = email.trim().toLowerCase();
  const [localPart] = normalized.split('@');
  return Array.from(
    new Set([
      buildUsernameFromEmail(normalized),
      normalized,
      localPart && localPart.length > 0 ? localPart : normalized,
    ]),
  );
};

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
    if (USE_MOCKS_AUTH) {
      if (payload.password !== MOCK_PASSWORD) {
        throw new Error('Невірний пароль (mock)');
      }
      const baseUser =
        mockUsers.find((item) => item.email.toLowerCase() === payload.email.toLowerCase()) ??
        mockUser;
      const forcedRole = resolveRoleByEmail(payload.email);
      const user: User = forcedRole
        ? {
            ...baseUser,
            email: payload.email,
            role: forcedRole,
            name:
              forcedRole === 'admin' ? 'Admin' : forcedRole === 'owner' ? 'Owner' : baseUser.name,
          }
        : baseUser;
      return { token: `mock-token-${user.id}`, user };
    }
    const usernames = resolveLoginUsernames(payload.email);
    let lastError: unknown;
    for (const username of usernames) {
      try {
        const { data } = await apiClient.post<any>(ENDPOINTS.auth.login, {
          login: username,
          password: payload.password,
        });

        const token: string =
          data?.token ?? data?.Token ?? data?.data?.token ?? data?.data?.Token ?? '';
        if (!token) throw new Error('Токен не получен при логине');
        const user = await fetchProfile(token);
        const forcedRole = resolveRoleByEmail(payload.email);
        const resolvedUser: User = forcedRole ? { ...user, role: forcedRole } : user;
        return { token, user: resolvedUser };
      } catch (error: any) {
        const status = error?.response?.status;
        if (status === 401) {
          lastError = error;
          continue;
        }
        throw toUserFacingApiError(error, 'Не удалось выполнить вход.');
      }
    }

    throw toUserFacingApiError(lastError, 'Неверный логин или пароль.');
  },
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    if (USE_MOCKS_AUTH) {
      if (payload.password !== MOCK_PASSWORD) {
        throw new Error('Невірний пароль (mock)');
      }
      const resolvedRole: User['role'] = payload.role === 'owner' ? 'owner' : 'user';
      const user: User = {
        id: `mock-user-${Date.now()}`,
        email: payload.email,
        name: payload.name || payload.email,
        role: resolvedRole,
        phone: '',
      };
      return { token: `mock-token-${user.id}`, user };
    }
    const resolvedRole = payload.role === 'owner' ? 'owner' : 'user';
    try {
      const { data } = await apiClient.post<any>(ENDPOINTS.auth.register, {
        username: buildUsernameFromEmail(payload.email),
        password: payload.password,
        email: payload.email,
        phoneNumber: '',
        countryId: 1,
        birthDate: '2000-01-01T00:00:00Z',
        discount: 0,
        roleName: resolvedRole === 'owner' ? 'Owner' : 'Client',
      });
      const token: string =
        data?.token ?? data?.Token ?? data?.data?.token ?? data?.data?.Token ?? '';
      if (!token) throw new Error('Токен не получен при регистрации');
      const user = await fetchProfile(token);
      return { token, user };
    } catch (error) {
      throw toUserFacingApiError(error, 'Не удалось выполнить регистрацию.');
    }
  },
  resetPassword: async (email: string) => {
    if (USE_MOCKS_AUTH) return Promise.resolve();
    try {
      await apiClient.post(ENDPOINTS.auth.reset, { email });
    } catch (error) {
      throw toUserFacingApiError(error, 'Не удалось отправить запрос на смену пароля.');
    }
  },
  googleLogin: async (idToken: string): Promise<AuthResponse> => {
    if (USE_MOCKS_AUTH) {
      return { token: `mock-token-${mockUser.id}`, user: mockUser };
    }
    try {
      const { data } = await apiClient.post<any>(ENDPOINTS.auth.google, { idToken });
      const token: string =
        data?.token ?? data?.Token ?? data?.data?.token ?? data?.data?.Token ?? '';
      if (!token) throw new Error('Токен не получен при Google-входе');
      const user = await fetchProfile(token);
      return { token, user };
    } catch (error) {
      throw toUserFacingApiError(error, 'Не удалось выполнить вход через Google.');
    }
  },
};
