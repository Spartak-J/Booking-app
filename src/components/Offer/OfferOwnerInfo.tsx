// Component: OfferOwnerInfo. Used in: OfferDetailsScreen.tsx.
import React, { useMemo, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

import { CachedImage } from '@/components/CachedImage';
import { useTheme } from '@/theme';
import { Typography } from '@/ui';
import { getColorTokens, radius } from '@/theme';

const DESIGN_WIDTH = 412;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / DESIGN_WIDTH;
const s = (value: number) => value * scale;

type OfferOwnerInfoProps = {
  name: string;
  avatar?: string;
  reviewsCount: number;
  rating: number;
  yearsHosting: number;
  languages: string;
};

export const OfferOwnerInfo = ({
  name,
  avatar,
  reviewsCount,
  rating,
  yearsHosting,
  languages,
}: OfferOwnerInfoProps) => {
  const { colors, mode } = useTheme();
  const tokens = useMemo(() => getColorTokens(colors, mode), [colors, mode]);
  const isDark = mode === 'dark' || colors.background === colors.bgDark;
  const styles = useMemo(() => getStyles(colors, tokens, isDark), [colors, tokens, isDark]);
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Typography variant="h2" tone="primary" style={styles.headerText}>
          Інформація про власника
        </Typography>
        <TouchableOpacity style={styles.toggleButton} onPress={() => setExpanded((v) => !v)}>
          <View style={styles.toggleCircle}>
            <ChevronDown
              size={s(16)}
              color={colors.textPrimary ?? colors.text}
              style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
            />
          </View>
        </TouchableOpacity>
      </View>

      {expanded && (
        <View style={styles.infoCard}>
          <View style={styles.avatarWrap}>
            {avatar ? (
              <CachedImage uri={avatar} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback} />
            )}
          </View>
          <View style={styles.infoText}>
            <Typography variant="caption" tone="primary" style={styles.infoLine}>
              {reviewsCount} відгуків
            </Typography>
            <Typography variant="caption" tone="primary" style={styles.infoLine}>
              Рейтинг {rating.toFixed(1)}
            </Typography>
            <Typography variant="caption" tone="primary" style={styles.infoLine}>
              {yearsHosting} рік приймає гостей
            </Typography>
            <Typography variant="caption" tone="primary" style={styles.infoLine}>
              {languages}
            </Typography>
          </View>
          <View style={styles.nameRow}>
            <Typography variant="h2" tone="primary" style={styles.ownerName}>
              {name}
            </Typography>
            <Typography variant="caption" style={styles.contactText}>
              Зв’язатися з власником
            </Typography>
          </View>
        </View>
      )}
    </View>
  );
};

const getStyles = (colors: any, tokens: ReturnType<typeof getColorTokens>, isDark: boolean) =>
  StyleSheet.create({
    container: {
      marginTop: s(20),
    },
    headerRow: {
      height: s(43),
      backgroundColor: isDark ? colors.bgDarkAlt : colors.surfaceLightDarker,
      borderRadius: radius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: s(12),
    },
    headerText: {
      fontSize: s(20),
      fontWeight: '600',
    },
    toggleButton: {
      width: s(30),
      height: s(30),
      alignItems: 'center',
      justifyContent: 'center',
    },
    toggleCircle: {
      width: s(30),
      height: s(30),
      borderRadius: s(15),
      borderWidth: 1,
      borderColor: tokens.borderStrong,
      alignItems: 'center',
      justifyContent: 'center',
    },
    infoCard: {
      marginTop: s(12),
      backgroundColor: isDark ? colors.bgDarkAlt : colors.surfaceLight,
      borderRadius: radius.md,
      padding: s(12),
      minHeight: s(170),
    },
    avatarWrap: {
      position: 'absolute',
      left: s(12),
      top: s(12),
      width: s(170),
      height: s(120),
      borderRadius: radius.md,
      overflow: 'hidden',
    },
    avatar: {
      width: '100%',
      height: '100%',
    },
    avatarFallback: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.border,
    },
    infoText: {
      marginLeft: s(190),
      gap: s(6),
      marginTop: s(6),
    },
    infoLine: {
      fontSize: s(13),
      lineHeight: s(16),
    },
    nameRow: {
      position: 'absolute',
      left: s(12),
      right: s(12),
      bottom: s(10),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    ownerName: {
      fontSize: s(20),
      fontWeight: '600',
    },
    contactText: {
      fontSize: s(12),
      lineHeight: s(15),
      color: colors.primary,
      textDecorationLine: 'underline',
    },
  });
