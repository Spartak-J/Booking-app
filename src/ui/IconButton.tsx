import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { radius, spacing } from '@/theme';
import { useTheme } from '@/theme';

type Variant = 'ghost' | 'filled' | 'outlined';
type Size = 'sm' | 'md' | 'lg';
type Tone = 'primary' | 'inverse';

export type IconButtonProps = {
  onPress: () => void;
  icon: React.ReactNode;
  variant?: Variant;
  size?: Size;
  tone?: Tone;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  circular?: boolean;
  dimension?: number;
  bordered?: boolean;
  iconColorOverride?: string;
  preserveIconColor?: boolean;
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
  tone = 'primary',
  style,
  disabled = false,
  circular = false,
  dimension,
  bordered = false,
  iconColorOverride,
  preserveIconColor = false,
}) => {
  const { colors, tokens } = useTheme();
  const padding = sizePadding[size];
  const styles = getStyles(colors, padding);
  const iconColor = iconColorOverride ?? (tone === 'inverse' ? tokens.textOnAccent : tokens.textPrimary);
  const renderedIcon =
    preserveIconColor || !React.isValidElement(icon) || !icon.props
      ? icon
      : React.cloneElement(icon as any, { color: iconColor });

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        variant === 'filled'
          ? { backgroundColor: colors.primary }
          : variant === 'outlined'
            ? { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }
            : { backgroundColor: colors.transparent },
        bordered && { borderWidth: 2, borderColor: iconColor },
        circular && { borderRadius: 999 },
        dimension ? { width: dimension, height: dimension, padding: 0, borderRadius: dimension / 2 } : null,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
    >
      <View style={styles.icon}>{renderedIcon}</View>
    </Pressable>
  );
};

const getStyles = (colors: Record<string, string>, padding: number) =>
  StyleSheet.create({
    button: {
      padding,
      borderRadius: radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
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
