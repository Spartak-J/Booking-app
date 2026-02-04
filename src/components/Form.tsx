// Component: Form. Used in: (no direct imports found).
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewProps } from 'react-native';

import { spacing, radius } from '@/theme';
import { useTheme } from '@/theme';

export const FormContainer: React.FC<ViewProps> = ({ children, style, ...rest }) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

type FieldProps = {
  label: string;
  error?: string;
  helperText?: string;
} & TextInputProps;

export const FormField: React.FC<FieldProps> = ({ label, error, helperText, style, ...rest }) => {
  const { colors } = useTheme();
  const hasError = Boolean(error);
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: hasError ? colors.error : colors.border,
            color: colors.text,
          },
          style,
        ]}
        placeholderTextColor={colors.muted}
        {...rest}
      />
      {!!error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
      {!error && helperText && (
        <Text style={[styles.helper, { color: colors.muted }]}>{helperText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 14,
  },
  input: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  error: {
    fontSize: 12,
  },
  helper: {
    fontSize: 12,
  },
});
