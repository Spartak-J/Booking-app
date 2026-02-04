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
    <View style={styles.container}>
      <Image source={backgroundImageSource} style={styles.backgroundImage} />

      <LinearGradient
        colors={[withOpacity(colors.surfaceLight, 0), colors.surfaceLight]}
        locations={[0.04, 0.75]}
        style={styles.bottomGradient}
      />

      <View style={StyleSheet.absoluteFill}>
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

        <Typography variant="h1" tone="primary" style={styles.title}>
          {t('welcome.title')}
        </Typography>

        <View style={styles.selector}>
          {renderRoleOption('user', t('welcome.role.user'))}
          {renderRoleOption('owner', t('welcome.role.owner'))}

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
    container: {
      flex: 1,
      backgroundColor: tokens.bgPanel,
    },
    backgroundImage: {
      position: 'absolute',
      width: s(740),
      height: vs(982),
      left: s(-200),
      top: vs(-21),
    },
    bottomGradient: {
      position: 'absolute',
      width: '100%',
      height: vs(350),
      bottom: 0,
    },
    fullImage: {
      width: '100%',
      height: '100%',
    },
    title: {
      position: 'absolute',
      top: vs(278),
      left: s(16),
    },
    selector: {
      position: 'absolute',
      left: s(22),
      top: vs(640),
      width: s(368),
      gap: vs(20),
    },
    roleButton: {
      width: s(368),
      height: vs(44),
      borderRadius: s(20),
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
      gap: s(12),
      paddingVertical: 0,
      paddingHorizontal: 0,
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
    },
    cta: {
      width: s(224),
      height: vs(44),
      backgroundColor: tokens.accent,
      borderRadius: 20,
      alignSelf: 'center',
      marginTop: vs(5),
      justifyContent: 'center',
    },
    ctaText: {
      color: tokens.textOnAccent,
      textAlign: 'center',
    },
  });

export default WelcomeScreenView;
