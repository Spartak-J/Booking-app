// Screen: MessagesScreen. Used in: RootNavigator.
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import MessagesScreenView from '@/components/Messages/MessagesScreenView';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { Routes } from '@/navigation/routes';
import { ScreenContainer } from '@/ui';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export const MessagesScreen = () => {
  const navigation = useNavigation<Navigation>();

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <MessagesScreenView
        onBack={() => navigation.navigate(Routes.Main, { screen: Routes.Home })}
        onSearch={() => navigation.navigate(Routes.Main, { screen: Routes.Home })}
      />
    </ScreenContainer>
  );
};

export default MessagesScreen;
