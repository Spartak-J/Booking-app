import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { radius, spacing } from '@/theme';
import { useTheme } from '@/theme';

type Variant = 'filled' | 'outlined';

export type CardProps = {
  children: React.ReactNode;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
  padding?: keyof typeof spacing;
};

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'outlined',
  style,
  padding = 'md',
}) => {
  const { tokens } = useTheme();
  const styles = getStyles(tokens, padding, variant);

  return <View style={[styles.card, style]}>{children}</View>;
};

const getStyles = (
  tokens: Record<string, string>,
  padding: keyof typeof spacing,
  variant: Variant,
) =>
  StyleSheet.create({
    card: {
      backgroundColor: variant === 'filled' ? tokens.bgCard : tokens.bgSurface,
      borderRadius: radius.lg,
      padding: spacing[padding],
      borderWidth: variant === 'outlined' ? 1 : 0,
      borderColor: variant === 'outlined' ? tokens.border : 'transparent',
    },
  });

export default Card;
