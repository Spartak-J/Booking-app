// Component: WelcomeScreenView. Used in: WelcomeScreen.
// Файл-часть для WelcomeScreen. Содержит весь UI и логику выбора роли. Не содержит навигации и обёрток.
// Файл полностью отредактирован. Больше не править без крайней необходимости. --- LEGACY SCREEN, планируется к замене на ui/components/Auth/WelcomeScreenView.tsx

import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import { useTranslation } from '@/i18n';
import { useAuthStore } from '@/store/authStore';
import { getColorTokens, getThemeColors, withOpacity } from '@/theme';
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
  const colors = useMemo(() => getThemeColors('light'), []);
  const tokens = useMemo(() => getColorTokens('light'), []);
  const styles = useMemo(() => getStyles(colors, tokens), [colors, tokens]);
  const [role, setRole] = useState<RoleOption | null>(null);
  const switchRole = useAuthStore((state) => state.switchRole);
  const { t } = useTranslation();
  const fallbackTitle = t('welcome.title') || 'Ласкаво просимо';
  const [fallback1 = 'Ласкаво', fallback2 = 'просимо'] = fallbackTitle.split(' ');
  const rawLine1 = t('welcome.titleLine1') || fallback1;
  const rawLine2 = t('welcome.titleLine2') || fallback2;
  const titleLine1 = rawLine1.includes('.') || rawLine1.includes('welcome.') ? 'Ласкаво' : rawLine1;
  const titleLine2 = rawLine2.includes('.') || rawLine2.includes('welcome.') ? 'просимо' : rawLine2;

  const handleContinue = () => {
    if (!role) return;
    switchRole(role);
    navigation.navigate(Routes.Login);
  };

  const renderRoleOption = (value: RoleOption, label: string) => (
    <Button variant="ghost" size="large" onPress={() => setRole(value)} style={styles.roleButton}>
      <View style={styles.radioCircle}>{role === value && <View style={styles.radioDot} />}</View>
      <Typography variant="optionLg" tone="primary">
        {label}
      </Typography>
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
          withOpacity(colors.surfaceLight, 0.05),
          withOpacity(colors.surfaceLight, 0.75),
          withOpacity(colors.surfaceLight, 0.95),
        ]}
        locations={[0, 0.35, 1]}
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
        <View style={styles.titleWrapper}>
          <View style={styles.titleCircle}>
            <BlurView intensity={75} tint="light" style={StyleSheet.absoluteFillObject} />
            <LinearGradient
              pointerEvents="none"
              colors={[
                withOpacity(colors.surfaceLight, 0.96),
                withOpacity(colors.surfaceLight, 0.45),
                withOpacity(colors.surfaceLight, 0.18),
              ]}
              locations={[0, 0.45, 1]}
              start={{ x: 0.1, y: 0.5 }}
              end={{ x: 0.9, y: 0.5 }}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
          <Typography variant="h1" tone="primary" style={styles.title}>
            {`${titleLine1}\n${titleLine2}`}
          </Typography>
        </View>

        {/* Остальной контент */}
        <View style={styles.bottomSection}>
          <View style={styles.selectorCard}>
            <View style={styles.selector}>
              {renderRoleOption('user', t('welcome.role.user'))}
              {renderRoleOption('owner', t('welcome.role.owner'))}
            </View>
          </View>
          <Button onPress={handleContinue} disabled={!role} style={styles.cta}>
            <Typography variant="optionLg" tone="onAccent" numberOfLines={1}>
              {t('welcome.cta')}
            </Typography>
          </Button>
        </View>
      </View>
    </View>
  );
};

const getStyles = (colors: Record<string, string>, tokens: Record<string, string>) =>
  StyleSheet.create({
    // Базовый контейнер экрана (fixed layout, без SafeArea)
    screen: {
      flex: 1,
      backgroundColor: colors.transparent,
    },
    // Абсолютный слой фона (фото на весь экран)
    backgroundLayer: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 0,
    },
    backgroundImage: {
      width: '100%',
      height: '100%',
    },
    // Декоративные круги под контентом, над фоном
    decorLayer: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 5,
    },
    fullImage: {
      width: '100%',
      height: '100%',
    },
    // Контентный столбец
    content: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xl * 2,
      paddingBottom: spacing.xl,
      justifyContent: 'flex-start',
      gap: spacing.lg * 1.2,
      zIndex: 3,
    },
    // Верхний блок с заголовком
    topSection: {
      gap: spacing.lg,
      alignItems: 'flex-start',
      width: '75%',
      marginTop: vs(64),
    },
    // Обёртка заголовка и локального круга-вуа̂ли
    titleWrapper: {
      position: 'absolute',
      top: vs(300),
      left: spacing.xl,
      zIndex: 20,
    },
    // Круглая вуаль (Ellipse 91) под текстом
    titleCircle: {
      position: 'absolute',
      width: s(314),
      height: s(314),
      borderRadius: s(360),
      top: -s(130),
      left: -s(120), // центр относительно текстового блока
      overflow: 'hidden',
      opacity: 1,
      zIndex: 1, // слой сразу после фона
    },
    // Текст заголовка
    title: {
      textAlign: 'left',
      maxWidth: s(220),
      zIndex: 2,
    },
    // Список радио-опций
    selector: {
      width: '100%',
      gap: spacing.md * 1.2,
      alignItems: 'flex-start',
      zIndex: 3,
    },
    // Обёртка для радио-группы (в макете без подложки)
    selectorCard: {
      backgroundColor: colors.transparent,
      borderRadius: radius.lg,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      zIndex: 3,
    },
    // Кнопка роли
    roleButton: {
      width: '100%',
      minHeight: vs(52),
      borderRadius: radius.lg,
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.md,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderWidth: 0,
    },
    radioCircle: {
      width: s(24),
      height: s(24),
      borderRadius: s(13),
      borderWidth: 2,
      borderColor: tokens.borderStrong,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: s(-40),
    },
    radioDot: {
      width: s(14),
      height: s(14),
      borderRadius: s(7),
      backgroundColor: tokens.textPrimary,
    },
    // Нижний блок с градиентом и CTA
    bottomSection: {
      paddingTop: spacing.xl,
      paddingBottom: spacing.xl,
      paddingHorizontal: spacing.lg,
      justifyContent: 'flex-end',
      marginTop: 'auto',
      width: '100%',
      gap: spacing.lg,
      zIndex: 3,
      alignItems: 'flex-start',
    },
    // Нижний полноширинный градиент-подвал
    bottomGradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: vs(300),
      zIndex: 3,
    },
    // CTA-кнопка
    cta: {
      width: '82%',
      minHeight: vs(48),
      marginBottom: vs(12),
      backgroundColor: tokens.accent,
      borderRadius: radius.lg,
      alignSelf: 'center',
      justifyContent: 'center',
    },
    // Текст CTA
    ctaText: {
      color: tokens.textOnAccent,
      textAlign: 'center',
      fontWeight: '700',
    },
  });

export default WelcomeScreenView;
