// Component: BookingGuestInfo. Used in: BookingScreen.tsx.
import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';
import { Input, Typography } from '@/ui';
import { radius } from '@/theme';

const DESIGN_WIDTH = 412;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / DESIGN_WIDTH;
const s = (value: number) => value * scale;

type Props = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  onChangeName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangePhone: (value: string) => void;
  onChangeCountry: (value: string) => void;
};

export const BookingGuestInfo = ({
  fullName,
  email,
  phone,
  country,
  onChangeName,
  onChangeEmail,
  onChangePhone,
  onChangeCountry,
}: Props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Typography variant="subtitle" tone="primary" style={styles.title}>
        {t('booking.sectionGuestInfo')}
      </Typography>
      <View style={styles.formCard}>
        <Input
          label={t('booking.name')}
          value={fullName}
          onChangeText={onChangeName}
          placeholder={t('auth.placeholder.name')}
        />
        <Input
          label={t('auth.email')}
          value={email}
          onChangeText={onChangeEmail}
          placeholder={t('auth.placeholder.email')}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label={t('booking.phone')}
          value={phone}
          onChangeText={onChangePhone}
          placeholder={t('booking.phone')}
          keyboardType="phone-pad"
        />
        <Input
          label={t('booking.country')}
          value={country}
          onChangeText={onChangeCountry}
          placeholder={t('booking.country')}
        />
      </View>
    </View>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      gap: s(12),
    },
    title: {
      fontSize: s(20),
      fontWeight: '600',
    },
    formCard: {
      gap: s(12),
      backgroundColor: colors.surface ?? colors.background,
      borderRadius: radius.md,
      padding: s(12),
      borderWidth: 1,
      borderColor: colors.border,
    },
  });
