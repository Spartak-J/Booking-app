// Component: HomeDatePickerModal. Used in: HomeScreen.tsx.
import React, { useMemo } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { Button, Modal, Typography } from '@/ui';
import { radius, withOpacity } from '@/theme';
import { useTheme } from '@/theme';
import { s, SCREEN_WIDTH } from '@/utils/scale';

export type HomeDatePickerModalProps = {
  visible: boolean;
  onClose: () => void;
  overlayOpacity: number;
  sheetAnimatedStyle: Animated.AnimatedProps<Record<string, any>>;
  monthLabel: string;
  weekLabels: string[];
  calendarDays: Array<number | null>;
  calendarStart: number | null;
  calendarEnd: number | null;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (day: number) => void;
  onApply: () => void;
};

export const HomeDatePickerModal: React.FC<HomeDatePickerModalProps> = ({
  visible,
  onClose,
  overlayOpacity,
  sheetAnimatedStyle,
  monthLabel,
  weekLabels,
  calendarDays,
  calendarStart,
  calendarEnd,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
  onApply,
}) => {
  const { colors } = useTheme();
  const isDark = colors.background === colors.bgDark;
  const palette = useMemo(() => getPalette(colors, isDark), [colors, isDark]);
  const styles = useMemo(() => getStyles(palette), [palette]);

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      variant="dialog"
      position="top"
      overlayOpacity={overlayOpacity}
      contentStyle={styles.modalContent}
    >
      <Animated.View style={[styles.dateSheet, sheetAnimatedStyle]}>
        <View style={styles.dateHeader}>
          <Button variant="ghost" style={styles.dateArrow} onPress={onPrevMonth}>
            <View style={[styles.arrowLine, styles.arrowLineLeft]} />
            <View style={[styles.arrowLine, styles.arrowLineRight]} />
          </Button>
          <Typography variant="calendarTitle" tone="primary">
            {monthLabel}
          </Typography>
          <Button
            variant="ghost"
            style={[styles.dateArrow, styles.dateArrowRight]}
            onPress={onNextMonth}
          >
            <View style={[styles.arrowLine, styles.arrowLineLeft]} />
            <View style={[styles.arrowLine, styles.arrowLineRight]} />
          </Button>
        </View>
        <View style={styles.weekRow}>
          {weekLabels.map((label, index) => (
            <Typography
              key={label}
              variant="calendarWeekday"
              tone="primary"
              style={[styles.weekLabel, index % 7 !== 6 ? styles.cellSpacer : undefined]}
            >
              {label}
            </Typography>
          ))}
        </View>
        <View style={styles.calendarGrid}>
          {calendarDays.map((day, index) => {
            if (!day) {
              return (
                <View
                  key={`empty-${index}`}
                  style={[styles.dayCell, index % 7 !== 6 ? styles.cellSpacer : undefined]}
                />
              );
            }
            const hasStart = calendarStart !== null;
            const hasEnd = calendarEnd !== null;
            const rangeStart =
              hasStart && hasEnd ? Math.min(calendarStart!, calendarEnd!) : calendarStart;
            const rangeEnd =
              hasStart && hasEnd ? Math.max(calendarStart!, calendarEnd!) : calendarStart;
            const isSelected =
              (hasStart && hasEnd && day >= (rangeStart ?? 0) && day <= (rangeEnd ?? 0)) ||
              (hasStart && !hasEnd && day === calendarStart);
            const isEdge = (hasStart && day === calendarStart) || (hasEnd && day === calendarEnd);

            return (
              <Button
                key={`${day}-${index}`}
                variant="ghost"
                style={[styles.dayCell, index % 7 !== 6 ? styles.cellSpacer : undefined]}
                onPress={() => onSelectDay(day)}
              >
                {isSelected && (
                  <View
                    style={[styles.dayHighlight, isEdge ? styles.dayHighlightEdge : undefined]}
                  />
                )}
                <Typography variant="calendarDay" tone="primary">
                  {day}
                </Typography>
              </Button>
            );
          })}
        </View>
        <Button variant="primary" onPress={onApply} style={styles.applyButton}>
          <Typography variant="calendarApply" tone="onAccent">
            Застовусати
          </Typography>
        </Button>
      </Animated.View>
    </Modal>
  );
};

const getPalette = (colors: Record<string, string>, isDark: boolean) => {
  const text = colors.textPrimary ?? colors.text;
  const overlay = colors.overlay ?? colors.bgDark ?? text;
  const shadow = colors.bgDark ?? text;
  const surface = colors.surface;
  const surfaceLight = colors.surfaceLight ?? surface;
  return {
    text,
    shadow,
    sheetBg: isDark ? (colors.bgCard ?? surface) : surfaceLight,
    highlight: withOpacity(colors.bgDark ?? overlay, 0.32),
    primary: colors.primary,
    transparent: colors.transparent ?? 'transparent',
  };
};

const getStyles = (palette: ReturnType<typeof getPalette>) =>
  StyleSheet.create({
    modalContent: {
      backgroundColor: palette.transparent,
      padding: 0,
    },
    dateSheet: {
      width: SCREEN_WIDTH,
      height: s(534),
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: radius.xxl,
      borderBottomRightRadius: radius.xxl,
      paddingTop: s(29),
      paddingBottom: s(31),
      shadowColor: palette.shadow,
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 10,
      backgroundColor: palette.sheetBg,
    },
    dateHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: s(10),
      paddingHorizontal: s(24),
    },
    dateArrow: {
      width: s(19),
      height: s(19),
      alignItems: 'center',
      justifyContent: 'center',
    },
    dateArrowRight: {
      transform: [{ rotate: '180deg' }],
    },
    arrowLine: {
      width: s(17),
      height: s(2),
      backgroundColor: palette.text,
      borderRadius: radius.sm,
    },
    arrowLineLeft: {
      transform: [{ rotate: '35deg' }],
    },
    arrowLineRight: {
      transform: [{ rotate: '-35deg' }],
      marginTop: s(6),
    },
    weekRow: {
      flexDirection: 'row',
      width: s(383),
      alignSelf: 'center',
      marginBottom: s(12),
    },
    weekLabel: {
      width: s(45.17),
      height: s(34),
      textAlign: 'center',
    },
    calendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: s(383),
      alignSelf: 'center',
      rowGap: s(6),
      marginBottom: s(8),
    },
    dayCell: {
      width: s(45.17),
      height: s(40),
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 0,
      paddingHorizontal: 0,
      borderWidth: 0,
      borderColor: palette.transparent,
      backgroundColor: palette.transparent,
    },
    cellSpacer: {
      marginRight: s(11.1),
    },
    dayHighlight: {
      position: 'absolute',
      width: s(40),
      height: s(40),
      borderRadius: radius.round,
      backgroundColor: palette.highlight,
    },
    dayHighlightEdge: {
      backgroundColor: palette.primary,
    },
    applyButton: {
      position: 'absolute',
      width: s(199),
      height: s(46),
      left: (SCREEN_WIDTH - s(199)) / 2,
      bottom: s(31),
      borderRadius: radius.xxl,
    },
  });

export default HomeDatePickerModal;
