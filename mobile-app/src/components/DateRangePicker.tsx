// Component: DateRangePicker. Used in: BookingDetailsSection.tsx.
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';
import { useTranslation } from '@/i18n';
import { Button, Input, Typography } from '@/ui';

type Props = {
  value: { from: string; to: string } | undefined;
  onChange: (next: { from: string; to: string } | undefined) => void;
};

export const DateRangePicker: React.FC<Props> = ({ value, onChange }) => {
  const styles = getStyles();
  const { t } = useTranslation();
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
      <Typography variant="caption" tone="secondary">
        {t('dateRange.label')}
      </Typography>
      <View style={styles.row}>
        <Input
          placeholder={t('dateRange.from')}
          value={from}
          onChangeText={setFrom}
          containerStyle={styles.inputContainer}
        />
        <Input
          placeholder={t('dateRange.to')}
          value={to}
          onChangeText={setTo}
          containerStyle={styles.inputContainer}
        />
      </View>
      <View style={styles.actions}>
        <Button title={t('dateRange.apply')} onPress={apply} />
        <Button title={t('dateRange.clear')} onPress={clear} variant="ghost" />
      </View>
    </View>
  );
};

const getStyles = () =>
  StyleSheet.create({
    container: {
      gap: spacing.sm,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    inputContainer: {
      flex: 1,
    },
    actions: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
  });
