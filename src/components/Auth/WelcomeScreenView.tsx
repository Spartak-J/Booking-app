// Component: WelcomeScreenView. Used in: WelcomeScreen.
import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { useTranslation } from '@/i18n';
import { useAuthStore } from '@/store/authStore';
import { useTheme, withOpacity } from '@/theme';
import { Button, DecorativeBubble, Typography } from '@/ui';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { Routes } from '@/navigation/routes';
import { s, vs } from '@/utils/scale';
import { spacing, radius } from '@/theme';

import img1 from '@/assets/images/1.png';
import img2 from '@/assets/images/2.png';
import img3 from '@/assets/images/3.png';
import img4 from '@/assets/images/4.png';
import img5 from '@/assets/images/5.png';
import backgroundImageSource from '@/assets/images/WelcomeScreen.png';

// LEGACY SCREEN
// TODO: migrate to ui/components

type RoleOption = 'user' | 'owner';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

type PropertyImage = {
  id: number;
  source: number;
  left: number;
  top: number;
};

const propertyImages: PropertyImage[] = [
  { id: 1, source: img1, left: 20, top: 90 },
  { id: 2, source: img2, left: 124, top: 156 },
  { id: 3, source: img3, left: 182, top: 277 },
  { id: 4, source: img4, left: 124, top: 393 },
  { id: 5, source: img5, left: 22, top: 460 },
];

export const WelcomeScreenView = () => {
  const navigation = useNavigation<Navigation>();
  const { colors, tokens } = useTheme();
  const styles = useMemo(() => getStyles(colors, tokens), [colors, tokens]);
  const [role, setRole] = useState<RoleOption | null>(null);
  const switchRole = useAuthStore((state) => state.switchRole);
  const { t } = useTranslation();
  const fallbackTitle = t('welcome.title') || 'Ласкаво просимо';
  const [fallback1 = 'Ласкаво', fallback2 = 'просимо'] = fallbackTitle.split(' ');
  const rawLine1 = t('welcome.titleLine1') || fallback1;
  const rawLine2 = t('welcome.titleLine2') || fallback2;
  const titleLine1 =
    rawLine1.includes('.') || rawLine1.includes('welcome.') ? 'Ласкаво' : rawLine1;
  const titleLine2 =
    rawLine2.includes('.') || rawLine2.includes('welcome.') ? 'просимо' : rawLine2;

  const handleContinue = () => {
    if (!role) return;
    switchRole(role);
    navigation.navigate(Routes.Login);
  };

  const renderRoleOption = (value: RoleOption, label: string) => (
    <Button variant="ghost" size="large" onPress={() => setRole(value)} style={styles.roleButton}>
      <View style={styles.radioCircle}>{role === value && <View style={styles.radioDot} />}</View>
      <Typography style={styles.radioLabel}>{label}</Typography>
    </Button>
  );

  return (
    <View style={styles.screen}>
      <View pointerEvents="none" style={styles.backgroundLayer}>
        <Image source={backgroundImageSource} style={styles.backgroundImage} resizeMode="cover" />
      </View>

      <LinearGradient
        pointerEvents="none"
        colors={[
          withOpacity(colors.surfaceLight, 0),
          withOpacity(colors.surfaceLight, 0.7),
          withOpacity(colors.surfaceLight, 0.08),
        ]}
        locations={[0, 0.65, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.titleOverlay}
      />

      <LinearGradient
        pointerEvents="none"
        colors={[
          withOpacity(colors.surfaceLight, 0),
          withOpacity(colors.surfaceLight, 0.35),
          withOpacity(colors.surfaceLight, 0.85),
        ]}
        locations={[0, 0.55, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.bottomGradient}
      />

      <View style={styles.decorLayer} pointerEvents="none">
        {propertyImages.map((item) => (
          <View
            key={item.id}
            style={{ position: 'absolute', left: s(item.left), top: vs(item.top) }}
          >
            <DecorativeBubble size="md" variant="surface">
              <Image source={item.source} style={styles.fullImage} resizeMode="cover" />
            </DecorativeBubble>
          </View>
        ))}
      </View>

      <View style={styles.content}>
        <View style={styles.topSection}>
          <View style={styles.titleWrapper}>
            <Typography variant="h1" tone="primary" style={styles.title}>
              {`${titleLine1}\n${titleLine2}`}
            </Typography>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.selector}>
            {renderRoleOption('user', t('welcome.role.user'))}
            {renderRoleOption('owner', t('welcome.role.owner'))}
          </View>
          <Button
            title={t('welcome.cta')}
            onPress={handleContinue}
            disabled={!role}
            style={styles.cta}
            textStyle={styles.ctaText}
          />
        </View>
      </View>
    </View>
  );
};

const getStyles = (colors: Record<string, string>, tokens: Record<string, string>) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.transparent,
    },
    backgroundLayer: {
      ...StyleSheet.absoluteFillObject,
      top: -spacing.xl * 2,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
    },
    backgroundImage: {
      width: '100%',
      height: '100%',
    },
    decorLayer: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 2,
    },
    fullImage: {
      width: '100%',
      height: '100%',
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xl * 9.3,
      paddingBottom: spacing.xl,
      justifyContent: 'flex-start',
      gap: spacing.lg * 1.2,
      zIndex: 3,
    },
    topSection: {
      gap: spacing.lg,
      alignItems: 'flex-start',
      width: '80%',
    },
    titleWrapper: {
      position: 'relative',
      paddingLeft: spacing.lg,
      paddingTop: spacing.xl * 3.3,
    },
    title: {
      textAlign: 'left',
      paddingHorizontal: spacing.sm,
      maxWidth: '80%',
    },
    selector: {
      width: '100%',
      gap: spacing.md * 1.2,
      paddingHorizontal: spacing.sm,
      alignItems: 'flex-start',
      zIndex: 3,
    },
    roleButton: {
      width: '100%',
      minHeight: vs(44),
      borderRadius: radius.lg,
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderWidth: 0,
    },
    radioCircle: {
      width: s(32),
      height: s(32),
      borderRadius: s(16),
      borderWidth: 2,
      borderColor: tokens.borderStrong,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: s(6),
    },
    radioDot: {
      width: s(20),
      height: s(20),
      borderRadius: s(10),
      backgroundColor: tokens.textPrimary,
    },
    radioLabel: {
      color: tokens.textPrimary,
      fontWeight: '700',
    },
    bottomSection: {
      paddingTop: spacing.xl,
      paddingBottom: spacing.xl,
      paddingHorizontal: spacing.lg,
      justifyContent: 'flex-end',
      marginTop: 'auto',
      width: '100%',
      gap: spacing.lg * 1.5,
      zIndex: 3,
      alignItems: 'center',
    },
    titleOverlay: {
      position: 'absolute',
      left: -spacing.xl * 2,
      top: spacing.xl * 1.2,
      width: '95%',
      height: vs(320),
      borderTopRightRadius: radius.xl * 2,
      borderBottomRightRadius: radius.xl * 2.4,
      opacity: 0.9,
      zIndex: 1,
    },
    bottomGradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: vs(360),
      zIndex: 1,
    },
    cta: {
      width: '72%',
      minHeight: vs(44),
      backgroundColor: tokens.accent,
      borderRadius: radius.lg,
      alignSelf: 'center',
      justifyContent: 'center',
    },
    ctaText: {
      color: tokens.textOnAccent,
      textAlign: 'center',
    },
  });

export default WelcomeScreenView;
