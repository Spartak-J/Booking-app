// Component: RegisterScreenView. Used in: RegisterScreen.
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from '@/i18n';
import { StyleSheet, View, Image } from 'react-native';
import * as yup from 'yup';

import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/theme';
import { radius, spacing } from '@/theme';
import { Button, IconButton, Input, ScreenContainer, Typography } from '@/ui';
import { s } from '@/utils/scale';
import { Routes } from '@/navigation/routes';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import googleIcon from '@/assets/images/google.png';
import facebookIcon from '@/assets/images/facebook.png';

type FormValues = {
  name: string;
  email: string;
  password: string;
};

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export const RegisterScreenView = () => {
  const { register } = useAuth();
  const navigation = useNavigation<Navigation>();
  const [agreed, setAgreed] = useState(false);
  const { tokens } = useTheme();
  const styles = useMemo(() => getStyles(tokens), [tokens]);
  const { t } = useTranslation();

  const schema = useMemo(
    () =>
      yup.object({
        name: yup.string().required(),
        email: yup.string().required(),
        password: yup.string().required(),
      }),
    [],
  );

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', email: '', password: '' },
  });

  return (
    <ScreenContainer
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
      scroll
      withKeyboardAvoiding
    >
      <View style={styles.formWrapper}>
        <View style={styles.headerBlock}>
          <Typography variant="h1" tone="primary" style={styles.title}>
            {t('auth.register.title')}
          </Typography>

          <Typography variant="body" tone="primary" style={styles.subtitle}>
            {t('auth.register.subtitle')}
          </Typography>
        </View>

        <View style={styles.fieldsBlock}>
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                placeholder={t('auth.placeholder.name')}
                containerStyle={styles.inputContainer}
                inputStyle={styles.input}
              />
            )}
          />

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

          <View style={styles.termsRow}>
            <IconButton
              onPress={() => setAgreed((p) => !p)}
              variant={agreed ? 'filled' : 'outlined'}
              size="sm"
              icon={
                agreed ? (
                  <Typography variant="caption" tone="onAccent">
                    ✓
                  </Typography>
                ) : null
              }
            />
            <Typography variant="caption" tone="primary" style={styles.termsText}>
              {t('auth.register.terms')}
            </Typography>
          </View>

          <Button
            title={t('auth.register.continue')}
            onPress={handleSubmit(register)}
            disabled={!agreed}
          />
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerDot} />
          <View style={styles.dividerLine} />
          <View style={styles.dividerDot} />
        </View>

        <View style={styles.socialBlock}>
          <Typography variant="caption" tone="primary" style={styles.socialTitle}>
            {t('auth.login.social')}
          </Typography>

          <Button variant="ghost" size="large" style={styles.socialOutline} onPress={() => {}}>
            <View style={styles.socialContent}>
              <Image source={googleIcon} style={styles.socialIcon} />
              <Typography style={styles.socialText}>{t('auth.login.google')}</Typography>
            </View>
          </Button>

          <Button variant="ghost" size="large" style={styles.socialOutline} onPress={() => {}}>
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
          textStyle={styles.footerLink}
          title={t('auth.register.haveAccount')}
          onPress={() => navigation.navigate(Routes.Login)}
        />
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
    formWrapper: {
      flex: 1,
      width: '100%',
      maxWidth: s(420),
      alignSelf: 'center',
      gap: spacing.lg,
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
    termsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      gap: spacing.sm,
    },
    termsText: {
      color: tokens.textPrimary,
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
    },
    socialIcon: {
      width: s(26),
      height: s(26),
      resizeMode: 'contain',
    },
    socialText: {
      flex: 1,
      textAlign: 'center',
      color: tokens.textPrimary,
      marginRight: s(26),
    },
    socialBlock: {
      gap: spacing.md,
      marginTop: spacing.md,
    },
    footerRow: {
      alignSelf: 'center',
      width: s(300),
      justifyContent: 'center',
      paddingVertical: 0,
      paddingHorizontal: 0,
      borderWidth: 0,
    },
    footerLink: {
      color: tokens.textPrimary,
      textAlign: 'center',
      textDecorationLine: 'underline',
    },
  });

export default RegisterScreenView;
