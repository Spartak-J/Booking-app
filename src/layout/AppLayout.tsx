import React, { useState } from 'react';
import { StyleSheet, View, LayoutChangeEvent } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { useTheme } from '@/theme';

type AppLayoutProps = {
  children: React.ReactNode;
  variant?: 'tab' | 'stack';
  header?: boolean;
  footer?: React.ReactNode;
};

type LayoutBaseProps = Omit<AppLayoutProps, 'variant'> & {
  tabBarHeight?: number;
};

const AppLayoutBase: React.FC<LayoutBaseProps> = ({ children, tabBarHeight, footer }) => {
  const { tokens, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const [footerHeight, setFooterHeight] = useState(0);

  const paddingTop = 0;
  const baseBottom = tabBarHeight ?? insets.bottom;
  const paddingBottom = baseBottom + footerHeight;

  const handleFooterLayout = (event: LayoutChangeEvent) => {
    const nextHeight = event.nativeEvent.layout.height;
    if (nextHeight !== footerHeight) {
      setFooterHeight(nextHeight);
    }
  };

  return (
    <>
      <StatusBar
        style={mode === 'dark' ? 'light' : 'dark'}
        translucent={false}
        backgroundColor={tokens.bgScreen}
      />
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: tokens.bgScreen }]}
        edges={['top', 'left', 'right']}
      >
        <View style={[styles.inner, { paddingTop, paddingBottom }]}>{children}</View>
        {footer ? (
          <View onLayout={handleFooterLayout} style={styles.footer}>
            {footer}
          </View>
        ) : null}
      </SafeAreaView>
    </>
  );
};

const AppLayoutTab: React.FC<Omit<AppLayoutProps, 'variant'>> = (props) => {
  const tabBarHeight = useBottomTabBarHeight();
  return <AppLayoutBase {...props} tabBarHeight={tabBarHeight} />;
};

export const AppLayout: React.FC<AppLayoutProps> = ({ variant = 'stack', ...rest }) => {
  if (variant === 'tab') {
    return <AppLayoutTab {...rest} />;
  }
  return <AppLayoutBase {...rest} />;
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  footer: {
    width: '100%',
  },
});

export default AppLayout;
