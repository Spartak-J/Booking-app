import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppLayout } from '@/layout/AppLayout';
import { Routes } from '@/navigation/routes';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import AboutScreenView from '@/components/Profile/AboutScreenView';

export const AboutScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <AppLayout variant="stack">
      <AboutScreenView
        onBack={() => navigation.goBack()}
        onOpenHelp={() => navigation.navigate(Routes.HelpCenter)}
        onGoHome={() => navigation.navigate(Routes.Main, { screen: Routes.Home })}
      />
    </AppLayout>
  );
};

export default AboutScreen;
