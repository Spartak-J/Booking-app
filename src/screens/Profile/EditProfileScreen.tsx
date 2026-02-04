// Screen: EditProfileScreen (Account management). Used in: RootNavigator via ProfileScreen -> account.
import React from 'react';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '@/hooks/useAuth';
import EditProfileScreenView from '@/components/Profile/EditProfileScreenView';
import { ScreenContainer } from '@/ui';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const EditProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
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
    </ScreenContainer>
  );
};

export default EditProfileScreen;
