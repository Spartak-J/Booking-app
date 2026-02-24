// Component: HomeGuestsModal. Used in: HomeScreen.tsx.
import React, { useMemo } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { Button, Modal, Typography } from '@/ui';
import { radius } from '@/theme';
import { useTheme } from '@/theme';
import { s, SCREEN_WIDTH } from '@/utils/scale';

export type HomeGuestsModalProps = {
  visible: boolean;
  onClose: () => void;
  overlayOpacity: number;
  sheetAnimatedStyle: Animated.AnimatedProps<Record<string, any>>;
  roomCount: number;
  adultCount: number;
  childCount: number;
  guestBorderColor: string;
  petsEnabled: boolean;
  onTogglePets: () => void;
  onAdjustRoom: (delta: number) => void;
  onAdjustAdult: (delta: number) => void;
  onAdjustChild: (delta: number) => void;
  onApply: () => void;
};

export const HomeGuestsModal: React.FC<HomeGuestsModalProps> = ({
  visible,
  onClose,
  overlayOpacity,
  sheetAnimatedStyle,
  roomCount,
  adultCount,
  childCount,
  guestBorderColor,
  petsEnabled,
  onTogglePets,
  onAdjustRoom,
  onAdjustAdult,
  onAdjustChild,
  onApply,
}) => {
  const { colors } = useTheme();
  const isDark = colors.background === colors.bgDark;
  const palette = useMemo(() => getPalette(colors, isDark), [colors, isDark]);
  const styles = useMemo(() => getStyles(palette), [palette]);
  const applyTone = isDark ? 'onAccent' : 'primary';

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      variant="dialog"
      position="top"
      overlayOpacity={overlayOpacity}
      contentStyle={styles.modalContent}
    >
      <Animated.View style={[styles.guestSheet, sheetAnimatedStyle]}>
        <Typography variant="guestsTitle" tone="primary" style={styles.guestHeading}>
          Вкажіть кількість номерів та гостей
        </Typography>
        <View style={[styles.counterRow, styles.counterRowFirst]}>
          <Typography
            variant="guestsLabel"
            tone="primary"
            style={[styles.counterLabel, styles.counterLabelFirst]}
          >
            Номер
          </Typography>
          <View
            style={[styles.counterBox, styles.counterBoxFirst, { borderColor: guestBorderColor }]}
          >
            <Button variant="ghost" style={styles.counterButton} onPress={() => onAdjustRoom(-1)}>
              <Typography variant="guestsCount" tone="primary">
                -
              </Typography>
            </Button>
            <Typography variant="guestsCount" tone="primary">
              {roomCount}
            </Typography>
            <Button variant="ghost" style={styles.counterButton} onPress={() => onAdjustRoom(1)}>
              <Typography variant="guestsCount" tone="primary">
                +
              </Typography>
            </Button>
          </View>
        </View>
        <View style={[styles.counterRow, styles.counterRowSecond]}>
          <Typography
            variant="guestsLabel"
            tone="primary"
            style={[styles.counterLabel, styles.counterLabelSecond]}
          >
            Дорослі
          </Typography>
          <View
            style={[styles.counterBox, styles.counterBoxSecond, { borderColor: guestBorderColor }]}
          >
            <Button variant="ghost" style={styles.counterButton} onPress={() => onAdjustAdult(-1)}>
              <Typography variant="guestsCount" tone="primary">
                -
              </Typography>
            </Button>
            <Typography variant="guestsCount" tone="primary">
              {adultCount}
            </Typography>
            <Button variant="ghost" style={styles.counterButton} onPress={() => onAdjustAdult(1)}>
              <Typography variant="guestsCount" tone="primary">
                +
              </Typography>
            </Button>
          </View>
        </View>
        <View style={[styles.counterRow, styles.counterRowThird]}>
          <Typography
            variant="guestsLabel"
            tone="primary"
            style={[styles.counterLabel, styles.counterLabelThird]}
          >
            Діти
          </Typography>
          <View
            style={[styles.counterBox, styles.counterBoxThird, { borderColor: guestBorderColor }]}
          >
            <Button variant="ghost" style={styles.counterButton} onPress={() => onAdjustChild(-1)}>
              <Typography variant="guestsCount" tone="primary">
                -
              </Typography>
            </Button>
            <Typography variant="guestsCount" tone="primary">
              {childCount}
            </Typography>
            <Button variant="ghost" style={styles.counterButton} onPress={() => onAdjustChild(1)}>
              <Typography variant="guestsCount" tone="primary">
                +
              </Typography>
            </Button>
          </View>
        </View>
        <Typography variant="guestsHint" tone="primary" style={styles.counterHelper}>
          від 0 до 17 років
        </Typography>
        <Typography variant="guestsTitle" tone="primary" style={styles.petText}>
          Ви подорожуєте з тваринами
        </Typography>
        <Button variant="ghost" style={styles.petToggle} onPress={onTogglePets}>
          <View
            style={[styles.petThumb, petsEnabled ? styles.petThumbActive : styles.petThumbInactive]}
          />
        </Button>
        <Button variant="primary" onPress={onApply} style={styles.applyButton}>
          <Typography variant="guestsApply" tone={applyTone}>
            Застосувати
          </Typography>
        </Button>
      </Animated.View>
    </Modal>
  );
};

const getPalette = (colors: Record<string, string>, isDark: boolean) => {
  const shadow = colors.bgDark ?? colors.text;
  const surface = colors.surface;
  const surfaceLight = colors.surfaceLight ?? surface;
  const surfaceWarm = colors.surfaceWarm ?? surfaceLight;
  const toggleBg = isDark ? (colors.primaryDark ?? colors.bgCard ?? surface) : surfaceWarm;
  const toggleBorder = colors.bgCard ?? colors.text;
  const toggleThumb = isDark
    ? (colors.surfaceLight ?? colors.onPrimary)
    : (colors.bgCard ?? colors.text);
  return {
    shadow,
    sheetBg: isDark ? (colors.bgCard ?? surface) : surfaceWarm,
    transparent: colors.transparent ?? 'transparent',
    toggleBg,
    toggleBorder,
    toggleThumb,
  };
};

const getStyles = (palette: ReturnType<typeof getPalette>) =>
  StyleSheet.create({
    modalContent: {
      backgroundColor: palette.transparent,
      padding: 0,
    },
    guestSheet: {
      width: SCREEN_WIDTH,
      height: s(453),
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: radius.xl,
      borderBottomRightRadius: radius.xl,
      paddingTop: s(18),
      shadowColor: palette.shadow,
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 12,
      backgroundColor: palette.sheetBg,
      position: 'relative',
    },
    guestHeading: {
      textAlign: 'center',
      width: s(356),
      alignSelf: 'center',
    },
    counterRow: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: s(45),
    },
    counterRowFirst: {
      top: s(57),
    },
    counterRowSecond: {
      top: s(141),
    },
    counterRowThird: {
      top: s(215),
    },
    counterLabel: {
      position: 'absolute',
      textAlign: 'center',
    },
    counterLabelFirst: {
      left: s(35),
      top: s(14),
    },
    counterLabelSecond: {
      left: s(31),
      top: s(6),
    },
    counterLabelThird: {
      left: s(28),
      top: s(0),
    },
    counterBox: {
      position: 'absolute',
      height: s(45),
      top: 0,
      borderRadius: radius.xl,
      borderWidth: 2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: s(10),
      backgroundColor: palette.sheetBg,
    },
    counterBoxFirst: {
      width: s(152),
      left: s(232),
    },
    counterBoxSecond: {
      width: s(156),
      left: s(228),
    },
    counterBoxThird: {
      width: s(159),
      left: s(230),
    },
    counterButton: {
      width: s(31),
      height: s(32),
      borderRadius: radius.sm,
      paddingVertical: 0,
      paddingHorizontal: 0,
      borderWidth: 0,
      backgroundColor: palette.transparent,
    },
    counterHelper: {
      position: 'absolute',
      left: s(28),
      top: s(234),
      width: s(120),
      height: s(25),
      textAlign: 'center',
    },
    petText: {
      position: 'absolute',
      top: s(299),
      left: s(20),
      width: s(277),
      textAlign: 'center',
    },
    petToggle: {
      position: 'absolute',
      width: s(70),
      height: s(33),
      left: s(319),
      top: s(292),
      borderRadius: radius.xl,
      borderWidth: 3,
      borderColor: palette.toggleBorder,
      backgroundColor: palette.toggleBg,
      paddingVertical: 0,
      paddingHorizontal: 0,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    petThumb: {
      width: s(23),
      height: s(22),
      borderRadius: radius.lg,
      backgroundColor: palette.toggleThumb,
    },
    petThumbActive: {
      marginLeft: s(38),
    },
    petThumbInactive: {
      marginLeft: s(9),
    },
    applyButton: {
      position: 'absolute',
      width: s(199),
      height: s(46),
      left: (SCREEN_WIDTH - s(199)) / 2,
      bottom: s(49),
      borderRadius: radius.xl,
    },
  });

export default HomeGuestsModal;
