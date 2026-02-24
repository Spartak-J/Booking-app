import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';

import { authService } from '@/services/authService';
import { profileService } from '@/services/profile/profileService';
import { useAuthStore } from '@/store/authStore';
import { Role, User } from '@/types';

type LoginPayload = { email: string; password: string };
type RegisterPayload = { email: string; password: string; name: string };

WebBrowser.maybeCompleteAuthSession();

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
  const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string | undefined>;
  const googleAndroidClientId =
    process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? extra.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
  const googleIosClientId =
    process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? extra.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const googleWebClientId =
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? extra.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

  const [googleRequest, , promptGoogleAsync] = Google.useIdTokenAuthRequest({
    androidClientId: googleAndroidClientId,
    iosClientId: googleIosClientId,
    webClientId: googleWebClientId,
  });

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
      if (!googleRequest) {
        throw new Error('Google OAuth не настроен: отсутствуют client IDs.');
      }

      const result = await promptGoogleAsync();
      if (result.type !== 'success') {
        if (result.type === 'cancel' || result.type === 'dismiss') return;
        throw new Error('Не удалось выполнить вход через Google.');
      }

      const idToken =
        (result.params as { id_token?: string } | undefined)?.id_token ??
        (result.authentication as { idToken?: string } | null)?.idToken;

      if (!idToken) {
        throw new Error('Google не вернул idToken.');
      }

      const data = await authService.googleLogin(idToken);
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
    const updated = await profileService.updateProfile(user.id, payload, user);
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
