import { useState } from 'react';

import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { Role, User } from '@/types';

type LoginPayload = { email: string; password: string };
type RegisterPayload = { email: string; password: string; name: string };

export const useAuth = () => {
  const { user, token, role, setAuth, switchRole, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const login = async (payload: LoginPayload) => {
    setLoading(true);
    try {
      const data = await authService.login(payload);
      await setAuth(data);
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    try {
      const data = await authService.register(payload);
      await setAuth(data);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (nextRole: Role) => {
    if (!user) return;
    const mockToken = `mock-token-${nextRole}`;
    await setAuth({ user: { ...user, role: nextRole }, token: mockToken, role: nextRole });
    switchRole(nextRole);
  };

  const updateProfile = async (payload: Partial<User>) => {
    if (!user) return;
    const updated = await authService.updateProfile(user.id, payload);
    await setAuth({ user: updated, token: token ?? '', role: updated.role });
  };

  return {
    user,
    token,
    role,
    loading,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
    updateRole,
    updateProfile,
  };
};
