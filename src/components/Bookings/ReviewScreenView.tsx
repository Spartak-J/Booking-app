// ScreenView: ReviewScreenView. Style aligns with "Мої подорожі"/Messages.
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTranslation } from '@/i18n';
import { useTheme, spacing, radius } from '@/theme';
import { s } from '@/utils/scale';
import { Button, IconButton, Input, ScreenShell, Typography } from '@/ui';

const STARS = [1, 2, 3, 4, 5];

type Props = {
  onBack?: () => void;
};

export const ReviewScreenView: React.FC<Props> = ({ onBack }) => {
  const { tokens, colors, mode } = useTheme();
  const { t } = useTranslation();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const isDark = mode === 'dark' || colors.background === colors.bgDark;

  const palette = useMemo(
    () => ({
      background: tokens.bgScreen,
      text: tokens.textPrimary,
      subtitle: tokens.textSecondary,
      cardBg: isDark ? colors.bgCard ?? '#0E1E2C' : tokens.bgSurface ?? '#FFFFFF',
      accent: tokens.accent,
    }),
    [tokens, colors, isDark],
  );

  const styles = useMemo(() => getStyles(palette), [palette]);

  return (
    <ScreenShell
      title={t('bookings.review.title') || 'Залишити відгук'}
      onBack={onBack}
      showKeys
    >
      <View style={styles.content}>
        <View style={styles.card}>
          <Typography variant="body" style={styles.label}>
            {t('bookings.review.prompt') || 'Оцініть бронювання'}
          </Typography>
          <View style={styles.starsRow}>
            {STARS.map((star) => (
              <IconButton
                key={star}
                variant="ghost"
                size="sm"
                style={styles.starButton}
                onPress={() => setRating(star)}
                icon={
                  <MaterialCommunityIcons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={s(26)}
                    color={palette.accent}
                  />
                }
              />
            ))}
          </View>

          <Typography variant="body" style={styles.label}>
            {t('bookings.review.comment') || 'Коментар'}
          </Typography>
          <Input
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
            placeholder={t('bookings.review.placeholder') || 'Поділіться враженнями...'}
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
          />

          <Button
            title={t('bookings.review.submit') || 'Надіслати'}
            style={styles.submit}
            onPress={() => {}}
          />
        </View>
      </View>
    </ScreenShell>
  );
};

const getStyles = (palette: {
  background: string;
  text: string;
  subtitle: string;
  cardBg: string;
  accent: string;
}) =>
  StyleSheet.create({
    // Корень экрана
    root: {
      flex: 1,
      backgroundColor: palette.background,
    },
    // Хедер по аналогии с Messages/Bookings
    header: {
      height: spacing.xxl + spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.sm,
    },
    headerButton: {
      width: spacing.xl + spacing.sm,
      height: spacing.xl + spacing.sm,
      borderRadius: radius.round,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      color: palette.text,
      textAlign: 'center',
      flex: 1,
    },
    headerPlaceholder: {
      width: spacing.xl,
      height: spacing.xl,
      opacity: 0,
    },
    // Контент
    content: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xl,
    },
    card: {
      backgroundColor: palette.cardBg,
      borderRadius: radius.lg,
      padding: spacing.xl,
      gap: spacing.md,
    },
    label: {
      color: palette.text,
      fontWeight: '600',
    },
    starsRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    starButton: {
      padding: 0,
    },
    inputContainer: {
      width: '100%',
    },
    input: {
      width: '100%',
      minHeight: s(96),
      textAlignVertical: 'top',
      color: palette.text,
    },
    submit: {
      alignSelf: 'center',
      width: s(222),
      height: s(46),
      borderRadius: radius.xl,
      justifyContent: 'center',
    },
  });

export default ReviewScreenView;
