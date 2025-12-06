import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import { User, Role } from '@/types';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const ROLE_KEY = 'auth_role';

type AuthState = {
  user: User | null;
  token: string | null;
  role: Role;
  hydrate: () => Promise<void>;
  setAuth: (payload: { user: User; token: string; role?: Role }) => Promise<void>;
  switchRole: (role: Role) => void;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  role: 'user',
  hydrate: async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const userJson = await SecureStore.getItemAsync(USER_KEY);
    const role = (await SecureStore.getItemAsync(ROLE_KEY)) as Role | null;

    if (token && userJson) {
      const user = JSON.parse(userJson) as User;
      set({ token, user, role: role ?? user.role });
    }
  },
  setAuth: async ({ user, token, role }) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    await SecureStore.setItemAsync(ROLE_KEY, role ?? user.role);
    set({ user, token, role: role ?? user.role });
  },
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
    set({ user: null, token: null, role: 'user' });
  },
}));

export const getAuthState = () => useAuthStore.getState();
