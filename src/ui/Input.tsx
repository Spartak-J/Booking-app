import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { radius, spacing, typography } from '@/theme';
import { useTheme } from '@/theme';
import { Typography } from '@/ui/Typography';

export type InputProps = {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: TextInputProps['style'];
  rightSlot?: React.ReactNode;
  onRightSlotPress?: () => void;
} & TextInputProps;

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  containerStyle,
  inputStyle,
  rightSlot,
  onRightSlotPress,
  ...rest
}) => {
  const { tokens } = useTheme();
  const styles = getStyles(tokens);
  const hasError = Boolean(error);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Typography variant="caption" tone="secondary" style={styles.label}>
          {label}
        </Typography>
      ) : null}
      <TextInput
        style={[
          styles.input,
          rightSlot ? styles.inputWithRightSlot : undefined,
          hasError && styles.inputError,
          inputStyle,
        ]}
        placeholderTextColor={tokens.textSecondary}
        allowFontScaling
        maxFontSizeMultiplier={1.2}
        {...rest}
      />
      {rightSlot ? (
        <Pressable
          onPress={onRightSlotPress}
          disabled={!onRightSlotPress}
          style={styles.rightSlot}
          accessibilityRole={onRightSlotPress ? 'button' : undefined}
        >
          {rightSlot}
        </Pressable>
      ) : null}
      {error ? (
        <Typography variant="caption" tone="error" style={styles.helper}>
          {error}
        </Typography>
      ) : helperText ? (
        <Typography variant="caption" tone="secondary" style={styles.helper}>
          {helperText}
        </Typography>
      ) : null}
    </View>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    container: {
      gap: spacing.xs,
    },
    label: {
      ...(typography.caption as object),
    },
    input: {
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: tokens.border,
      backgroundColor: tokens.bgField,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      color: tokens.textPrimary,
      textAlignVertical: 'center',
      ...(typography.body as object),
    },
    inputWithRightSlot: {
      paddingRight: spacing.xxl,
    },
    inputError: {
      borderColor: tokens.error,
    },
    rightSlot: {
      position: 'absolute',
      right: spacing.sm,
      top: spacing.sm,
      width: spacing.xl,
      height: spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
    },
    helper: {
      ...(typography.caption as object),
    },
  });

export default Input;
