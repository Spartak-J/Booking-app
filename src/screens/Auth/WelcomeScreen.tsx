// Screen: WelcomeScreen. Used in: RootNavigator.
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import WelcomeScreenView from '@/components/Auth/WelcomeScreenView';
import { getColorTokens } from '@/theme';

const lightTokens = getColorTokens('light');

export const WelcomeScreen = () => {
  return (
    <>
      <StatusBar style="dark" translucent={false} backgroundColor={lightTokens.bgScreen} />
      <SafeAreaView style={{ flex: 1, backgroundColor: lightTokens.bgScreen }} edges={['left', 'right', 'bottom']}>
        <WelcomeScreenView />
      </SafeAreaView>
    </>
  );
};

export default WelcomeScreen;
