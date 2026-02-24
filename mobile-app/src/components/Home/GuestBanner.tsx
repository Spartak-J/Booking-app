// Component: GuestBanner. Used in: HomeScreen.tsx.
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Typography } from '@/ui';
import { radius } from '@/theme';
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';
import { s } from '@/utils/scale';

export type GuestBannerProps = {
  onPress: () => void;
};

export const GuestBanner: React.FC<GuestBannerProps> = ({ onPress }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <Button variant="ghost" style={styles.banner} onPress={onPress}>
      <View style={styles.content}>
        <Typography variant="body" tone="primary">
          {t('auth.guestBanner')}
        </Typography>
        <Typography variant="caption" tone="accent">
          {t('auth.guestBannerCta')}
        </Typography>
      </View>
    </Button>
  );
};

const getStyles = (colors: Record<string, string>) =>
  StyleSheet.create({
    banner: {
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      marginHorizontal: s(20),
      paddingVertical: s(10),
      paddingHorizontal: s(14),
      gap: s(4),
    },
    content: {
      gap: s(4),
    },
  });

export default GuestBanner;
