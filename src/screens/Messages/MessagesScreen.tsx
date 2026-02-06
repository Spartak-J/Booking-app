import React from 'react';
import { useNavigation } from '@react-navigation/native';

import { AppLayout } from '@/layout/AppLayout';
import MessagesScreenView from '@/components/Messages/MessagesScreenView';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';

export const MessagesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <AppLayout variant="tab" header={false}>
      <MessagesScreenView
        onBack={() => navigation.goBack()}
      />
    </AppLayout>
  );
};

export default MessagesScreen;
