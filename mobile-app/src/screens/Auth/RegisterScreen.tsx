// Screen: RegisterScreen. Used in: RootNavigator.
import React from 'react';

import AuthScreenView from '@/components/Auth/AuthScreenView';
import { AppLayout } from '@/layout/AppLayout';

export const RegisterScreen = () => (
  <AppLayout variant="stack">
    <AuthScreenView mode="register" />
  </AppLayout>
);

export default RegisterScreen;
