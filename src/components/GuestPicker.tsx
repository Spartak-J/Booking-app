import React from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import { spacing, radius } from '@/theme';
import { useThemeColors } from '@/hooks/useThemeColors';

type Props = {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
};

export const GuestPicker: React.FC<Props> = ({ value, onChange }) => {
  const { colors } = useThemeColors();
  const styles = getStyles(colors);
  const [input, setInput] = React.useState(value ? String(value) : '');

  const apply = () => {
    const num = Number(input);
    onChange(Number.isFinite(num) && num > 0 ? num : undefined);
  };

  const clear = () => {
    setInput('');
    onChange(undefined);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Гости</Text>
      <View style={styles.row}>
        <TextInput
          placeholder="Количество"
          value={input}
          onChangeText={setInput}
          keyboardType="numeric"
          style={styles.input}
        />
        <Button title="OK" onPress={apply} />
        <Button title="Сброс" onPress={clear} color={colors.muted} />
      </View>
    </View>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      gap: spacing.xs,
    },
    label: {
      color: colors.muted,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.sm,
      alignItems: 'center',
    },
    input: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      color: colors.text,
    },
  });
