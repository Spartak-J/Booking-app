// Screen: LoginScreen. Used in: RootNavigator.
import React from 'react';

import AuthScreenView from '@/components/Auth/AuthScreenView';
import { AppLayout } from '@/layout/AppLayout';

export const LoginScreen = () => (
  <AppLayout variant="stack">
    <AuthScreenView mode="login" />
  </AppLayout>
);

export default LoginScreen;
