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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
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

  return (
    <ScreenContainer
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
      scroll
      withKeyboardAvoiding
    >
      <View style={styles.root}>
        <View style={styles.topSection}>
          <View style={styles.headerBlock}>
            <Typography variant="h1" tone="primary" style={styles.title}>
              {t('auth.login.title')}
            </Typography>
            <Typography variant="body" tone="primary" style={styles.subtitle}>
              {t('auth.login.subtitle')}
            </Typography>
          </View>

          <View style={styles.fieldsBlock}>
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  placeholder={t('auth.placeholder.email')}
                  containerStyle={styles.inputContainer}
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
                  containerStyle={styles.inputContainer}
                  inputStyle={styles.input}
                />
              )}
            />
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.dividerRow}>
            <View style={styles.dividerDot} />
            <View style={styles.dividerLine} />
            <View style={styles.dividerDot} />
          </View>

          <Button title={t('auth.login.continue')} onPress={handleSubmit(login)} />

          <View style={styles.socialBlock}>
            <Typography variant="caption" tone="primary" style={styles.socialTitle}>
              {t('auth.login.social')}
            </Typography>

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
            style={styles.footerRow}
            textStyle={styles.footerText}
            title={t('auth.login.noAccount')}
            onPress={() => navigation.navigate(Routes.Register)}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: tokens.bgScreen,
    },
    screenContent: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xl,
    },
    root: {
      flex: 1,
      width: '100%',
      maxWidth: s(420),
      alignSelf: 'center',
      gap: spacing.lg,
    },
    topSection: {
      gap: spacing.xl,
    },
    title: {
      textAlign: 'center',
    },
    subtitle: {
      textAlign: 'center',
    },
    headerBlock: {
      gap: spacing.xs,
      alignItems: 'center',
    },
    fieldsBlock: {
      gap: spacing.md,
    },
    inputContainer: {
      width: '100%',
    },
    input: {
      width: '100%',
      height: s(46),
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: tokens.borderStrong,
      paddingHorizontal: spacing.lg,
      color: tokens.textPrimary,
    },
    bottomSection: {
      gap: spacing.lg,
    },
    dividerRow: {
      alignSelf: 'center',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    dividerLine: {
      flex: 1,
      height: s(2),
      backgroundColor: tokens.borderStrong,
    },
    dividerDot: {
      width: s(8),
      height: s(8),
      borderRadius: radius.sm,
      backgroundColor: tokens.borderStrong,
    },
    socialBlock: {
      gap: spacing.md,
      marginTop: spacing.md,
    },
    socialTitle: {
      textAlign: 'center',
    },
    socialButton: {
      width: '100%',
      height: s(46),
      borderRadius: radius.md,
      justifyContent: 'center',
    },
    socialOutline: {
      alignSelf: 'stretch',
      borderWidth: 1,
      borderColor: tokens.borderStrong,
      borderRadius: radius.md,
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
