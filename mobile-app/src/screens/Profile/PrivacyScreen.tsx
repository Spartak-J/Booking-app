import React from 'react';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/layout/AppLayout';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PrivacyScreenView from '@/components/Profile/PrivacyScreenView';

export const PrivacyScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { role } = useAuth();

  return (
    <AppLayout variant="stack">
      <PrivacyScreenView role={role} onBack={() => navigation.goBack()} />
    </AppLayout>
  );
};

export default PrivacyScreen;
