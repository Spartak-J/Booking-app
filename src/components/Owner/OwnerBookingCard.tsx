// Component: OwnerBookingCard. Used in: OwnerBookingsScreen.
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Typography } from '@/ui';
import { spacing, radius, typography } from '@/theme';
import { useTheme } from '@/theme';
import { s } from '@/utils/scale';

export type OwnerBookingCardProps = {
  id: string;
  dateRange: string;
  guestsLabel: string;
  roomTypeLabel?: string;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  noteTitle: string;
  note?: string;
  status?: 'active' | 'completed' | 'cancelled';
  expanded: boolean;
  onToggle: (id: string) => void;
  themeMode?: 'light' | 'dark' | 'system';
};

export const OwnerBookingCard: React.FC<OwnerBookingCardProps> = ({
  id,
  dateRange,
  guestsLabel,
  roomTypeLabel,
  guestName,
  guestPhone,
  guestEmail,
  noteTitle,
  note,
  status,
  expanded,
  onToggle,
}) => {
  const { tokens } = useTheme();
  const styles = useMemo(() => getStyles(tokens), [tokens]);

  const dotStyle = useMemo(
    () => [
      styles.dot,
      status === 'cancelled'
        ? styles.dotCancelled
        : status === 'completed'
          ? styles.dotCompleted
          : styles.dotActive,
    ],
    [status, styles.dot, styles.dotCancelled, styles.dotCompleted, styles.dotActive],
  );

  return (
    <View style={styles.card}>
      <View style={dotStyle} />

      <View style={styles.sectionRow}>
        <Typography variant="subtitle" tone="primary" style={styles.rowLabel}>
          Дата
        </Typography>
        <Typography variant="body" tone="primary" style={styles.rowValue} numberOfLines={1}>
          {dateRange}
        </Typography>
      </View>

      {expanded ? (
        <>
          <View style={styles.sectionRow}>
            <Typography variant="subtitle" tone="primary" style={styles.rowLabel}>
              Кіл. гостей
            </Typography>
            <Typography variant="body" tone="primary" style={styles.rowValue} numberOfLines={1}>
              {guestsLabel}
            </Typography>
          </View>

          <View style={styles.sectionRow}>
            <Typography variant="subtitle" tone="primary" style={styles.rowLabel}>
              Тип номеру
            </Typography>
            <Typography variant="body" tone="primary" style={styles.rowValue} numberOfLines={1}>
              {roomTypeLabel ?? 'Повністю квартира'}
            </Typography>
          </View>

          <View style={styles.sectionBlock}>
            <Typography variant="subtitle" tone="primary" style={styles.blockLabel}>
              Данні гостя
            </Typography>
            <View style={styles.guestText}>
              <Typography variant="body" tone="primary" numberOfLines={1}>
                {guestName ?? ''}
              </Typography>
              <Typography variant="body" tone="primary" numberOfLines={1}>
                {guestPhone ?? ''}
              </Typography>
              <Typography variant="body" tone="primary" numberOfLines={1}>
                {guestEmail ?? ''}
              </Typography>
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <Typography variant="subtitle" tone="primary" style={styles.blockLabel}>
              {noteTitle}
            </Typography>
            <Typography variant="body" tone="primary">
              {note ?? ''}
            </Typography>
          </View>
        </>
      ) : null}

      <Button
        variant="ghost"
        size="small"
        style={styles.collapseButton}
        onPress={() => onToggle(id)}
      >
        <View style={styles.collapseLine} />
      </Button>
    </View>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    card: {
      backgroundColor: tokens.bgCard,
      borderRadius: radius.lg,
      padding: spacing.sm,
      gap: spacing.sm,
    },
    dot: {
      width: s(10),
      height: s(10),
      borderRadius: radius.round,
    },
    dotActive: {
      backgroundColor: tokens.success,
    },
    dotCompleted: {
      backgroundColor: tokens.borderSubtle,
    },
    dotCancelled: {
      backgroundColor: tokens.error,
    },
    sectionRow: {
      minHeight: s(42),
      borderRadius: radius.md,
      backgroundColor: tokens.bgPanel,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    sectionBlock: {
      borderRadius: radius.md,
      backgroundColor: tokens.bgPanel,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      gap: spacing.xs,
    },
    rowLabel: {
      ...(typography.subtitle as object),
      flexShrink: 0,
    },
    rowValue: {
      ...(typography.body as object),
      textAlign: 'right',
      flexShrink: 1,
    },
    blockLabel: {
      ...(typography.subtitle as object),
    },
    guestText: {
      alignItems: 'flex-end',
      gap: spacing.xs / 2,
    },
    collapseButton: {
      alignSelf: 'center',
      borderWidth: 0,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xs,
      minWidth: s(140),
      backgroundColor: 'transparent',
    },
    collapseLine: {
      width: s(64),
      borderTopWidth: 2,
      borderColor: tokens.textPrimary,
      opacity: 0.8,
    },
  });

export default OwnerBookingCard;
