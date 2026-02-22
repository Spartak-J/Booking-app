// Component: GuestPicker. Used in: BookingDetailsSection.tsx.
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';
import { useTranslation } from '@/i18n';
import { Button, Input, Typography } from '@/ui';

type Props = {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
};

export const GuestPicker: React.FC<Props> = ({ value, onChange }) => {
  const styles = getStyles();
  const { t } = useTranslation();
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
      <Typography variant="caption" tone="secondary">
        {t('bookings.guests')}
      </Typography>
      <View style={styles.row}>
        <Input
          placeholder={t('guestPicker.placeholder')}
          value={input}
          onChangeText={setInput}
          keyboardType="numeric"
          containerStyle={styles.inputContainer}
        />
        <Button title={t('guestPicker.apply')} onPress={apply} />
        <Button title={t('guestPicker.clear')} onPress={clear} variant="ghost" />
      </View>
    </View>
  );
};

const getStyles = () =>
  StyleSheet.create({
    container: {
      gap: spacing.xs,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.sm,
      alignItems: 'center',
    },
    inputContainer: {
      flex: 1,
    },
  });
