import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { radius, spacing } from '@/theme';
import { useTheme } from '@/theme';

type Variant = 'ghost' | 'filled' | 'outlined';
type Size = 'sm' | 'md' | 'lg';

export type IconButtonProps = {
  onPress: () => void;
  icon: React.ReactNode;
  variant?: Variant;
  size?: Size;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

const sizePadding: Record<Size, number> = {
  sm: spacing.xs,
  md: spacing.sm,
  lg: spacing.md,
};

export const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  icon,
  variant = 'ghost',
  size = 'md',
  style,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const padding = sizePadding[size];
  const styles = getStyles(colors, padding, variant);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, disabled && styles.disabled, style]}
      disabled={disabled}
    >
      <View style={styles.icon}>{icon}</View>
    </Pressable>
  );
};

const getStyles = (colors: Record<string, string>, padding: number, variant: Variant) =>
  StyleSheet.create({
    button: {
      padding,
      borderRadius: radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        variant === 'filled'
          ? colors.primary
          : variant === 'outlined'
            ? colors.surface
            : colors.transparent,
      borderWidth: variant === 'outlined' ? 1 : 0,
      borderColor: variant === 'outlined' ? colors.border : colors.transparent,
    },
    icon: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    disabled: {
      opacity: 0.6,
    },
  });

export default IconButton;
