// Screen: EditProfileScreen (Account management). Used in: RootNavigator via ProfileScreen -> account.
import React from 'react';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '@/hooks/useAuth';
import EditProfileScreenView from '@/components/Profile/EditProfileScreenView';
import { AppLayout } from '@/layout/AppLayout';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const EditProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();

  return (
    <AppLayout variant="stack">
      <EditProfileScreenView
        initialValues={{
          name: user?.name ?? '',
          birthDate: '',
          email: user?.email ?? '',
          phone: '',
          country: '',
        }}
        onBack={() => navigation.goBack()}
        onSubmit={() => undefined}
      />
    </AppLayout>
  );
};

export default EditProfileScreen;
