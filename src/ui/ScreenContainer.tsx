//src/ui/ScreenContainer: Обязательная обертка для всех экранов, которая управляет отступами от краев экрана (SafeArea) и общим фоном.
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  withKeyboardAvoiding?: boolean;
  withBackground?: boolean;
} & SafeAreaViewProps;

export const ScreenContainer: React.FC<Props> = ({
  children,
  scroll = false,
  contentContainerStyle,
  style,
  withKeyboardAvoiding = true,
  withBackground = true,
  ...rest
}) => {
  const { tokens } = useTheme();
  const { edges, ...safeAreaProps } = rest;
  const resolvedEdges = edges ?? (['top', 'left', 'right', 'bottom'] as SafeAreaViewProps['edges']);

  const wrapWithKeyboardAvoiding = (node: React.ReactNode) =>
    withKeyboardAvoiding ? (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {node}
      </KeyboardAvoidingView>
    ) : (
      node
    );

  const content = scroll ? (
    <ScrollView contentContainerStyle={contentContainerStyle}>{children}</ScrollView>
  ) : (
    <View style={contentContainerStyle}>{children}</View>
  );

  const flattenedStyle = StyleSheet.flatten(style) ?? {};
  const safeStyle = { ...flattenedStyle };
  delete (safeStyle as ViewStyle).backgroundColor;

  return (
    <SafeAreaView
      style={[
        { flex: 1, backgroundColor: withBackground ? tokens.bgScreen : 'transparent' },
        safeStyle,
      ]}
      {...safeAreaProps}
      edges={resolvedEdges}
    >
      {wrapWithKeyboardAvoiding(content)}
    </SafeAreaView>
  );
};

export default ScreenContainer;
