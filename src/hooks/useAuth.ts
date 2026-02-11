import { useState } from 'react';

import { authService } from '@/services/authService';
import { profileService } from '@/services/profile/profileService';
import { useAuthStore } from '@/store/authStore';
import { Role, User } from '@/types';

type LoginPayload = { email: string; password: string };
type RegisterPayload = { email: string; password: string; name: string };

export const useAuth = () => {
  const {
    user,
    token,
    role,
    baseRole,
    setAuth,
    switchRole,
    logout,
    enterGuestMode,
    leaveGuestMode,
  } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const login = async (payload: LoginPayload) => {
    setLoading(true);
    try {
      const data = await authService.login(payload);
      await setAuth({ ...data, baseRole: data.user.role });
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    try {
      const registerRole: Role = role === 'owner' ? 'owner' : 'user';
      const data = await authService.register({ ...payload, role: registerRole });
      await setAuth({ ...data, baseRole: data.user.role });
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setLoading(true);
    try {
      const data = await authService.googleLogin();
      await setAuth({ ...data, baseRole: data.user.role });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      await authService.resetPassword(email);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (nextRole: Role) => {
    if (!user) return;
    // Админ роль не переключаем вручную, только через вход админа
    const currentBaseRole = baseRole ?? user.role;
    if (nextRole === 'admin' && currentBaseRole !== 'admin') return;
    await setAuth({ user: { ...user, role: nextRole }, token: token ?? '', role: nextRole });
    switchRole(nextRole);
  };

  const isAdminSession = baseRole === 'admin';
  const canReturnToAdmin = isAdminSession && role !== 'admin';

  const updateProfile = async (payload: Partial<User>) => {
    if (!user) return;
    const updated = await profileService.updateProfile(user.id, payload);
    await setAuth({ user: updated, token: token ?? '', role: updated.role });
  };

  return {
    user,
    token,
    role,
    loading,
    isAuthenticated: Boolean(token),
    enterGuestMode,
    leaveGuestMode,
    login,
    register,
    googleLogin,
    resetPassword,
    logout,
    updateRole,
    updateProfile,
    baseRole,
    isAdminSession,
    canReturnToAdmin,
  };
};
