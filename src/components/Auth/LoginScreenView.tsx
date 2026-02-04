// Component: LoginScreenView. Used in: LoginScreen.
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View, Dimensions, Image } from 'react-native';
import * as yup from 'yup';

import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/theme';
import { radius, spacing } from '@/theme';
import { Button, Input, ScreenContainer, Typography } from '@/ui';
import { useTranslation } from '@/i18n';
import { Routes } from '@/navigation/routes';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import googleIcon from '@/assets/images/google.png';
import facebookIcon from '@/assets/images/facebook.png';

const DESIGN_WIDTH = 412;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = SCREEN_WIDTH / DESIGN_WIDTH;
const s = (v: number) => v * scale;

type FormValues = {
  email: string;
  password: string;
};

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export const LoginScreenView = () => {
  const { login } = useAuth();
  const navigation = useNavigation<Navigation>();
  const { tokens } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => getStyles(tokens), [tokens]);

  const schema = useMemo(
    () =>
      yup.object({
        email: yup.string().required(),
        password: yup.string().required(),
      }),
    [],
  );

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const offsetTop = (SCREEN_HEIGHT - s(688)) / 2;

  return (
    <ScreenContainer style={styles.screen} edges={['left', 'right']}>
      <View style={[styles.formWrapper, { top: offsetTop }]}>
        <Typography variant="h1" tone="primary" style={[styles.title, { top: s(24) }]}>
          {t('auth.login.title')}
        </Typography>

        <Typography variant="body" tone="primary" style={[styles.subtitle, { top: s(70) }]}>
          {t('auth.login.subtitle')}
        </Typography>

        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              placeholder={t('auth.placeholder.email')}
              containerStyle={[styles.inputContainer, { top: s(150) }]}
              inputStyle={styles.input}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              placeholder={t('auth.placeholder.password')}
              secureTextEntry
              containerStyle={[styles.inputContainer, { top: s(216) }]}
              inputStyle={styles.input}
            />
          )}
        />

        <View style={[styles.cta, { top: s(286) }]}>
          <Button title={t('auth.login.continue')} onPress={handleSubmit(login)} />
        </View>

        <View style={[styles.dividerRow, { top: s(356) }]}>
          <View style={styles.dividerDot} />
          <View style={styles.dividerLine} />
          <View style={styles.dividerDot} />
        </View>

        <Typography variant="caption" tone="primary" style={[styles.socialTitle, { top: s(376) }]}>
          {t('auth.login.social')}
        </Typography>

        <View style={[styles.socialButton, { top: s(416) }]}>
          <Button
            variant="ghost"
            size="large"
            style={styles.socialOutline}
            onPress={() => console.log('Google login')}
          >
            <View style={styles.socialContent}>
              <Image source={googleIcon} style={styles.socialIcon} />
              <Typography style={styles.socialText}>{t('auth.login.google')}</Typography>
            </View>
          </Button>
        </View>

        <View style={[styles.socialButton, { top: s(472) }]}>
          <Button
            variant="ghost"
            size="large"
            style={styles.socialOutline}
            onPress={() => console.log('Facebook login')}
          >
            <View style={styles.socialContent}>
              <Image source={facebookIcon} style={styles.socialIcon} />
              <Typography style={styles.socialText}>{t('auth.login.facebook')}</Typography>
            </View>
          </Button>
        </View>

        <Button
          variant="ghost"
          size="small"
          style={[styles.footerRow, { top: s(573) }]}
          textStyle={styles.footerText}
          title={t('auth.login.noAccount')}
          onPress={() => navigation.navigate(Routes.Register)}
        />
      </View>
    </ScreenContainer>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    screen: {
      backgroundColor: tokens.bgScreen,
    },
    formWrapper: {
      position: 'absolute',
      width: s(408),
      height: s(642),
      left: '50%',
      transform: [{ translateX: -s(204) }],
      borderRadius: 20,
    },
    title: {
      position: 'absolute',
      alignSelf: 'center',
    },
    subtitle: {
      position: 'absolute',
      alignSelf: 'center',
    },
    inputContainer: {
      position: 'absolute',
      alignSelf: 'center',
      width: s(378),
    },
    input: {
      width: s(378),
      height: s(46),
      borderRadius: 20,
      borderWidth: 1,
      borderColor: tokens.borderStrong,
      paddingHorizontal: spacing.lg,
      color: tokens.textPrimary,
    },
    cta: {
      position: 'absolute',
      alignSelf: 'center',
      width: s(222),
      height: s(46),
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dividerRow: {
      position: 'absolute',
      alignSelf: 'center',
      width: s(356),
      flexDirection: 'row',
      alignItems: 'center',
    },
    dividerLine: {
      flex: 1,
      height: s(3),
      backgroundColor: tokens.borderStrong,
    },
    dividerDot: {
      width: s(10),
      height: s(10),
      borderRadius: radius.sm,
      backgroundColor: tokens.borderStrong,
    },
    socialTitle: {
      position: 'absolute',
      alignSelf: 'center',
    },
    socialButton: {
      position: 'absolute',
      alignSelf: 'center',
      width: s(378),
      height: s(46),
      borderRadius: 20,
      justifyContent: 'center',
    },
    socialOutline: {
      width: '100%',
      height: '100%',
      borderWidth: 1,
      borderColor: tokens.borderStrong,
      borderRadius: 20,
      justifyContent: 'center',
      paddingVertical: 0,
      paddingHorizontal: 0,
    },
    socialContent: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: s(16),
      width: '100%',
    },
    socialIcon: {
      width: s(26),
      height: s(26),
      resizeMode: 'contain',
    },
    socialText: {
      flex: 1,
      textAlign: 'center',
      marginRight: s(26),
      color: tokens.textPrimary,
    },
    footerRow: {
      position: 'absolute',
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: 0,
      paddingHorizontal: 0,
      borderWidth: 0,
    },
    footerText: {
      color: tokens.textPrimary,
      textAlign: 'center',
    },
  });

export default LoginScreenView;
