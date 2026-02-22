// Component: BookingDetailsSection. Used in: BookingScreen.tsx.
import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import { DateRangePicker } from '@/components/DateRangePicker';
import { GuestPicker } from '@/components/GuestPicker';
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';
import { Input, Typography } from '@/ui';
import { radius } from '@/theme';

const DESIGN_WIDTH = 412;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / DESIGN_WIDTH;
const s = (value: number) => value * scale;

type Props = {
  dates: { from: string; to: string };
  onChangeDates: (next: { from: string; to: string } | undefined) => void;
  guests: number | undefined;
  onChangeGuests: (next: number | undefined) => void;
  comment: string;
  onChangeComment: (value: string) => void;
};

export const BookingDetailsSection = ({
  dates,
  onChangeDates,
  guests,
  onChangeGuests,
  comment,
  onChangeComment,
}: Props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Typography variant="subtitle" tone="primary" style={styles.title}>
        {t('booking.sectionDetails')}
      </Typography>
      <View style={styles.card}>
        <DateRangePicker value={dates} onChange={onChangeDates} />
        <GuestPicker value={guests} onChange={onChangeGuests} />
        <Typography variant="caption" tone="primary">
          {t('booking.comment')}
        </Typography>
        <Input
          value={comment}
          placeholder={t('booking.comment.helper')}
          onChangeText={onChangeComment}
          helperText={t('booking.comment.helper')}
          multiline
          numberOfLines={3}
          inputStyle={styles.commentInput}
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
    card: {
      gap: s(12),
      backgroundColor: colors.surface ?? colors.background,
      borderRadius: radius.md,
      padding: s(12),
      borderWidth: 1,
      borderColor: colors.border,
    },
    commentInput: {
      minHeight: s(90),
    },
  });
