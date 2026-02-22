import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import { User, Role } from '@/types';
import { USE_MOCKS_AUTH } from '@/config/constants';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const ROLE_KEY = 'auth_role';
const BASE_ROLE_KEY = 'auth_base_role';

type AuthState = {
  user: User | null;
  token: string | null;
  role: Role;
  baseRole: Role | null;
  guestMode: boolean;
  hydrate: () => Promise<void>;
  setAuth: (payload: {
    user: User;
    token: string;
    role?: Role;
    baseRole?: Role | null;
  }) => Promise<void>;
  enterGuestMode: () => void;
  leaveGuestMode: () => void;
  switchRole: (role: Role) => void;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  role: 'user',
  baseRole: null,
  guestMode: false,
  hydrate: async () => {
    if (USE_MOCKS_AUTH) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
      await SecureStore.deleteItemAsync(ROLE_KEY);
      await SecureStore.deleteItemAsync(BASE_ROLE_KEY);
      set({ user: null, token: null, role: 'user', baseRole: null, guestMode: false });
      return;
    }
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const userJson = await SecureStore.getItemAsync(USER_KEY);
    const role = (await SecureStore.getItemAsync(ROLE_KEY)) as Role | null;
    const baseRole = (await SecureStore.getItemAsync(BASE_ROLE_KEY)) as Role | null;

    if (token && userJson) {
      const user = JSON.parse(userJson) as User;
      const resolvedBase = baseRole ?? user.role;
      set({ token, user, role: role ?? user.role, baseRole: resolvedBase, guestMode: false });
    }
  },
  setAuth: async ({ user, token, role, baseRole }) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    await SecureStore.setItemAsync(ROLE_KEY, role ?? user.role);
    const resolvedBaseRole = baseRole ?? get().baseRole ?? user.role;
    await SecureStore.setItemAsync(BASE_ROLE_KEY, resolvedBaseRole);
    set({ user, token, role: role ?? user.role, baseRole: resolvedBaseRole, guestMode: false });
  },
  enterGuestMode: () => set({ guestMode: true, role: 'user' }),
  leaveGuestMode: () => set({ guestMode: false }),
  switchRole: (role) =>
    set((state) => {
      const updatedUser = state.user ? { ...state.user, role } : null;
      if (updatedUser) {
        SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUser));
      }
      SecureStore.setItemAsync(ROLE_KEY, role);
      return { role, user: updatedUser };
    }),
  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    await SecureStore.deleteItemAsync(ROLE_KEY);
    await SecureStore.deleteItemAsync(BASE_ROLE_KEY);
    set({ user: null, token: null, role: 'user', baseRole: null, guestMode: false });
  },
}));

export const getAuthState = () => useAuthStore.getState();
