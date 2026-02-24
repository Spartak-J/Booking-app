import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets, type SafeAreaViewProps } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { useTheme } from '@/theme';

type AppLayoutProps = {
  children: React.ReactNode;
  variant?: 'tab' | 'stack';
  header?: boolean;
  footer?: React.ReactNode;
  edges?: SafeAreaViewProps['edges'];
};

type LayoutBaseProps = Omit<AppLayoutProps, 'variant'> & {
  tabMode?: boolean;
};

const AppLayoutBase: React.FC<LayoutBaseProps> = ({ children, tabMode = false, footer, edges }) => {
  const { tokens, mode } = useTheme();
  const hasFooter = Boolean(footer);

  const paddingTop = 0;
  // For screens with footer, keep content flush and let footer occupy its own row.
  // Without footer, preserve bottom inset on content.
  const insets = useSafeAreaInsets();
  const baseBottom = tabMode ? 0 : hasFooter ? 0 : insets.bottom;
  const paddingBottom = baseBottom;
  let footerPaddingBottom = insets.bottom;
  let resolvedFooter = footer;

  if (footer && React.isValidElement(footer)) {
    const footerElement = footer as React.ReactElement<any>;
    const footerProps = (footerElement.props ?? {}) as Record<string, any>;
    const isNativeElement = typeof footerElement.type === 'string';
    if (!isNativeElement) {
      resolvedFooter = React.cloneElement(footerElement, {
        ...footerProps,
        bottomInset: Number(footerProps.bottomInset ?? 0) + insets.bottom,
      });
      footerPaddingBottom = 0;
    }
  }

  const safeEdges = edges ?? (['top', 'left', 'right'] as SafeAreaViewProps['edges']);

  return (
    <>
      <StatusBar
        style={mode === 'dark' ? 'light' : 'dark'}
        translucent={false}
        backgroundColor={tokens.bgScreen}
      />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: tokens.bgScreen }]} edges={safeEdges}>
        <View style={[styles.inner, { paddingTop, paddingBottom }]}>{children}</View>
        {resolvedFooter ? <View style={[styles.footer, { paddingBottom: footerPaddingBottom }]}>{resolvedFooter}</View> : null}
      </SafeAreaView>
    </>
  );
};

const AppLayoutTab: React.FC<Omit<AppLayoutProps, 'variant'>> = (props) => (
  <AppLayoutBase {...props} tabMode />
);

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
    overflow: 'hidden',
  },
  footer: {
    width: '100%',
    zIndex: 50,
    elevation: 50,
  },
});

export default AppLayout;
