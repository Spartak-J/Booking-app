// Screen: LoginScreen. Used in: RootNavigator.
import React from 'react';

import LoginScreenView from '@/components/Auth/LoginScreenView';
import { AppLayout } from '@/layout/AppLayout';

export const LoginScreen = () => (
  <AppLayout variant="stack">
    <LoginScreenView />
  </AppLayout>
);

export default LoginScreen;
