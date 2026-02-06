// Screen: RegisterScreen. Used in: RootNavigator.
import React from 'react';

import RegisterScreenView from '@/components/Auth/RegisterScreenView';
import { AppLayout } from '@/layout/AppLayout';

export const RegisterScreen = () => (
  <AppLayout variant="stack">
    <RegisterScreenView />
  </AppLayout>
);

export default RegisterScreen;
