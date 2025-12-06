import React from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import { spacing, radius } from '@/theme';
import { useThemeColors } from '@/hooks/useThemeColors';

type Props = {
  value: { from: string; to: string } | undefined;
  onChange: (next: { from: string; to: string } | undefined) => void;
};

export const DateRangePicker: React.FC<Props> = ({ value, onChange }) => {
  const { colors } = useThemeColors();
  const styles = getStyles(colors);
  const [from, setFrom] = React.useState(value?.from ?? '');
  const [to, setTo] = React.useState(value?.to ?? '');

  const apply = () => {
    if (from && to) onChange({ from, to });
  };

  const clear = () => {
    setFrom('');
    setTo('');
    onChange(undefined);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Даты (YYYY-MM-DD)</Text>
      <View style={styles.row}>
        <TextInput placeholder="Заезд" value={from} onChangeText={setFrom} style={styles.input} />
        <TextInput placeholder="Выезд" value={to} onChangeText={setTo} style={styles.input} />
      </View>
      <View style={styles.actions}>
        <Button title="Применить" onPress={apply} />
        <Button title="Очистить" onPress={clear} color={colors.muted} />
      </View>
    </View>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      gap: spacing.sm,
    },
    label: {
      color: colors.muted,
      fontSize: 14,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.sm,
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
    actions: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
  });
