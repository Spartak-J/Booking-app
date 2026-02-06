import React from 'react';
import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

import { radius, spacing, typography } from '@/theme';
import { useTheme } from '@/theme';
import { Typography } from '@/ui/Typography';

export type InputProps = {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: TextInputProps['style'];
} & TextInputProps;

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  containerStyle,
  inputStyle,
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
        style={[styles.input, hasError && styles.inputError, inputStyle]}
        placeholderTextColor={tokens.textSecondary}
        allowFontScaling
        maxFontSizeMultiplier={1.2}
        {...rest}
      />
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
    inputError: {
      borderColor: tokens.error,
    },
    helper: {
      ...(typography.caption as object),
    },
  });

export default Input;
