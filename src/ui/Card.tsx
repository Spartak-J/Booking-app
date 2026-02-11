import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

import { radius, spacing } from '@/theme';
import { useTheme } from '@/theme';

type Variant = 'filled' | 'outlined';

export type CardProps = {
  children: React.ReactNode;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
  padding?: keyof typeof spacing;
  onPress?: () => void;
};

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'outlined',
  style,
  padding = 'md',
  onPress,
}) => {
  const { tokens } = useTheme();
  const styles = getStyles(tokens, padding, variant);

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.card, style]}>
        {children}
      </TouchableOpacity>
    );
  }

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
