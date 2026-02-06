// Screen: WelcomeScreen. Used in: RootNavigator.
import React from 'react';

import WelcomeScreenView from '@/components/Auth/WelcomeScreenView';
import { AppLayout } from '@/layout/AppLayout';

export const WelcomeScreen = () => (
  <AppLayout variant="stack">
    <WelcomeScreenView />
  </AppLayout>
);

export default WelcomeScreen;
