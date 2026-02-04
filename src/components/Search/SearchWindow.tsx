// Component: SearchWindow. Used in: SearchResultsScreen.tsx.
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Modal, Typography, Button } from '@/ui';
import { useTheme } from '@/theme';
import { radius, withOpacity, getColorTokens } from '@/theme';
import { s, SCREEN_WIDTH } from '@/utils/scale';

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
  cityLabel: string;
  dateLabel: string;
  guestsLabel: string;
};

export const SearchWindow: React.FC<Props> = ({
  visible,
  onClose,
  onApply,
  cityLabel,
  dateLabel,
  guestsLabel,
}) => {
  const { colors, mode } = useTheme();
  const isDark = mode === 'dark' || colors.background === colors.bgDark;
  const tokens = useMemo(() => getColorTokens(colors, mode), [colors, mode]);
  const palette = useMemo(
    () => ({
      panelBg: tokens.bgPanel,
      rowBg: withOpacity(tokens.bgField, isDark ? 0.4 : 0.6),
      border: tokens.textPrimary,
      text: tokens.textPrimary,
      buttonBg: tokens.accent,
      buttonText: tokens.textOnAccent,
    }),
    [isDark, tokens],
  );
  const styles = useMemo(() => getStyles(palette), [palette]);

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      variant="dialog"
      position="top"
      overlayOpacity={0.25}
      contentStyle={styles.modalContent}
    >
      <View style={styles.container}>
        <Pressable style={styles.searchRow}>
          <MaterialCommunityIcons name="map-marker" size={s(13)} color={palette.text} />
          <Typography variant="searchChip" style={styles.searchText}>
            {cityLabel}
          </Typography>
        </Pressable>
        <Pressable style={styles.searchRow}>
          <MaterialCommunityIcons name="calendar-month-outline" size={s(13)} color={palette.text} />
          <Typography variant="searchChip" style={styles.searchText}>
            {dateLabel}
          </Typography>
        </Pressable>
        <Pressable style={styles.searchRow}>
          <MaterialCommunityIcons name="account-group" size={s(14)} color={palette.text} />
          <Typography variant="searchChip" style={styles.searchText}>
            {guestsLabel}
          </Typography>
        </Pressable>
        <Button variant="primary" style={styles.findButton} onPress={onApply}>
          <View style={styles.findContent}>
            <MaterialCommunityIcons name="magnify" size={s(16)} color={palette.buttonText} />
            <Typography variant="menu" style={styles.findText}>
              Знайти
            </Typography>
          </View>
        </Button>
      </View>
    </Modal>
  );
};

const getStyles = (palette: {
  panelBg: string;
  rowBg: string;
  border: string;
  text: string;
  buttonBg: string;
  buttonText: string;
}) =>
  StyleSheet.create({
    modalContent: {
      backgroundColor: 'transparent',
      padding: 0,
      borderRadius: 0,
    },
    container: {
      width: SCREEN_WIDTH,
      height: s(271),
      backgroundColor: palette.panelBg,
      borderBottomLeftRadius: radius.lg,
      borderBottomRightRadius: radius.lg,
      paddingTop: s(15),
      paddingHorizontal: s(20),
      gap: s(10),
    },
    searchRow: {
      height: s(50),
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.rowBg,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: s(10),
      gap: s(10),
    },
    searchText: {
      color: palette.text,
      fontSize: s(14),
    },
    findButton: {
      width: s(365),
      height: s(50),
      borderRadius: radius.lg,
      backgroundColor: palette.buttonBg,
      alignSelf: 'center',
      marginTop: s(10),
    },
    findContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: s(10),
    },
    findText: {
      color: palette.buttonText,
      fontFamily: 'MontserratAlternates-Bold',
      fontSize: s(20),
    },
  });

export default SearchWindow;
