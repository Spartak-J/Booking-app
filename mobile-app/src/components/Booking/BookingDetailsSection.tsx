// Component: BookingDetailsSection. Used in: BookingScreen.tsx.
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
  dates: { from: string; to: string };
  guests: number | undefined;
  comment: string;
  onChangeComment: (value: string) => void;
};

export const BookingDetailsSection = ({
  dates,
  guests,
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
        <Typography variant="caption" tone="primary">
          {t('booking.dates')}
        </Typography>
        <View style={styles.dateRow}>
          <Input value={dates.from} editable={false} containerStyle={styles.dateField} />
          <Input value={dates.to} editable={false} containerStyle={styles.dateField} />
          <Input
            value={guests ? String(guests) : ''}
            editable={false}
            containerStyle={styles.guestsField}
            label={t('bookings.guests')}
          />
        </View>
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
      backgroundColor: colors.surfaceLight,
      borderRadius: radius.md,
      padding: s(12),
      borderWidth: 1,
      borderColor: colors.border,
    },
    dateRow: {
      flexDirection: 'row',
      gap: s(8),
      alignItems: 'flex-end',
    },
    dateField: {
      flex: 1,
    },
    guestsField: {
      width: s(90),
    },
    commentInput: {
      minHeight: s(90),
    },
  });
