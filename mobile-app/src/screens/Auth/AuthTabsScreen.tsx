// Screen: AuthTabsScreen. Used in: RootNavigator.
import React from 'react';

import AuthTabsView from '@/components/Auth/AuthTabsView';
import { AppLayout } from '@/layout/AppLayout';

export const AuthTabsScreen = () => (
  <AppLayout variant="stack">
    <AuthTabsView />
  </AppLayout>
);

export default AuthTabsScreen;
