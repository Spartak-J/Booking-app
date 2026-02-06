import React, { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { IconButton, Typography } from '@/ui';
import { useTheme, spacing, radius } from '@/theme';
import { useTranslation } from '@/i18n';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import KeysBackground from '@/components/layout/KeysBackground';
import nomessageBlack from '@/assets/images/nomessage_black.png';
import nomessageWhite from '@/assets/images/nomessage_white.png';

type MessagesScreenViewProps = {
  onBack: () => void;
};

const ICON_SIZE = 198;

const MessagesScreenView: React.FC<MessagesScreenViewProps> = ({ onBack }) => {
  const { tokens, colors, mode } = useTheme();
  const { t } = useTranslation();
  const isDark = mode === 'dark' || colors.background === colors.bgDark;
  const palette = useMemo(
    () => ({
      background: tokens.bgScreen,
      text: isDark ? '#F5F3EE' : '#0D2D4A',
      icon: isDark ? '#F5F3EE' : '#0D2D4A',
      image: isDark ? nomessageWhite : nomessageBlack,
    }),
    [isDark, tokens.bgScreen],
  );
  const styles = useMemo(() => getStyles(palette), [palette]);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <IconButton
          onPress={onBack}
          style={styles.headerButton}
          icon={
            <MaterialCommunityIcons name="arrow-left" size={spacing.lg} color={palette.icon} />
          }
        />
        <Typography variant="subtitle" style={styles.headerTitle}>
          {t('messages.title')}
        </Typography>
        {/* hidden menu placeholder to keep title centered */}
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.emptyState}>
        <Image source={palette.image} style={styles.emptyIcon} />
        <Typography variant="caption" style={styles.emptyText}>
          {t('messages.empty')}
        </Typography>
      </View>

      <KeysBackground />
    </View>
  );
};

const getStyles = (palette: { background: string; text: string; icon: string }) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: palette.background,
    },
    header: {
      height: spacing.xxl,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
    },
    headerButton: {
      width: spacing.xl,
      height: spacing.xl,
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
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md,
    },
    emptyIcon: {
      width: ICON_SIZE,
      height: ICON_SIZE,
      resizeMode: 'contain',
    },
    emptyText: {
      color: palette.text,
      textAlign: 'center',
      fontWeight: '500',
      fontSize: 14,
    },
  });

export default MessagesScreenView;
