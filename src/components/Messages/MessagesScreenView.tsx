// Component: MessagesScreenView. Used in: MessagesScreen.
import React, { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { HeaderBar, Typography } from '@/ui';
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';
import { getColorTokens } from '@/theme';
import { s } from '@/utils/scale';
import KeysBackground from '@/components/layout/KeysBackground';
import FooterNavOverlay from '@/components/layout/FooterNavOverlay';

import noMessageBlackImage from '@/assets/images/nomessage_black.png';
import noMessageWhiteImage from '@/assets/images/nomessage_white.png';

type MessagesScreenViewProps = {
  onBack: () => void;
  onSearch: () => void;
};

export const MessagesScreenView: React.FC<MessagesScreenViewProps> = ({ onBack, onSearch }) => {
  const { colors, mode } = useTheme();
  const isDark = mode === 'dark' || colors.background === colors.bgDark;
  const tokens = useMemo(() => getColorTokens(colors, mode), [colors, mode]);
  const palette = useMemo(
    () => ({
      background: tokens.bgPanel,
      header: tokens.bgHeader,
      text: tokens.textPrimary,
    }),
    [tokens],
  );
  const styles = useMemo(() => getStyles(palette), [palette]);
  const { t } = useTranslation();

  const emptyImage = isDark ? noMessageWhiteImage : noMessageBlackImage;

  return (
    <View style={styles.root}>
      <View style={styles.screen}>
        <HeaderBar
          title={t('messages.title')}
          onBack={onBack}
          onSearch={onSearch}
          backIconName="chevron-left"
          backIconSize={s(20)}
          searchIconSize={s(18)}
          style={styles.header}
          titleStyle={styles.title}
          backStyle={styles.backButton}
          searchStyle={styles.searchButton}
        />
      </View>

      <View style={styles.emptyState} pointerEvents="none">
        <Image source={emptyImage} style={styles.centerImage} />
        <Typography
          variant="body"
          style={styles.emptyText}
          numberOfLines={2}
          ellipsizeMode="tail"
          adjustsFontSizeToFit
          minimumFontScale={0.85}
        >
          {t('messages.empty')}
        </Typography>
      </View>

      <KeysBackground />
      <FooterNavOverlay activeId="messages" />
    </View>
  );
};

type Palette = {
  background: string;
  header: string;
  text: string;
};

const getStyles = (palette: Palette) =>
  // LEGACY VIEW — UI pending redesign
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: palette.background,
    },
    screen: {
      flex: 1,
      backgroundColor: palette.background,
    },
    emptyState: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
    },
    header: {
      height: s(36),
      backgroundColor: palette.background,
    },
    backButton: {
      position: 'absolute',
      left: s(19),
      top: s(6.5),
      width: s(24),
      height: s(24),
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 6,
    },
    title: {
      color: palette.text,
      fontSize: s(16),
      fontWeight: '700',
      textAlign: 'center',
    },
    centerImage: {
      width: s(198),
      height: s(198),
      resizeMode: 'contain',
    },
    emptyText: {
      marginTop: s(10),
      color: palette.text,
      fontSize: s(14),
      fontWeight: '500',
      textAlign: 'center',
    },
    searchButton: {
      position: 'absolute',
      right: s(19),
      top: s(6),
      width: s(24),
      height: s(24),
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 6,
    },
  });

export default MessagesScreenView;
