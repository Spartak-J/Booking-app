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
import { s, SCREEN_HEIGHT } from '@/utils/scale';
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

  const offsetTop = (SCREEN_HEIGHT - s(688)) / 2;

  return (
    <ScreenContainer style={styles.screen} edges={['left', 'right']}>
      <View style={[styles.formWrapper, { top: offsetTop }]}>
        <Typography variant="h1" tone="primary" style={[styles.title, { top: s(24) }]}>
          {t('auth.register.title')}
        </Typography>

        <Typography variant="body" tone="primary" style={[styles.subtitle, { top: s(70) }]}>
          {t('auth.register.subtitle')}
        </Typography>

        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              placeholder={t('auth.placeholder.name')}
              containerStyle={[styles.inputContainer, { top: s(130) }]}
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
              containerStyle={[styles.inputContainer, { top: s(196) }]}
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
              containerStyle={[styles.inputContainer, { top: s(262) }]}
              inputStyle={styles.input}
            />
          )}
        />

        <View style={[styles.termsRow, { top: s(330) }]}>
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

        <View style={[styles.cta, { top: s(380) }]}>
          <Button
            title={t('auth.register.continue')}
            onPress={handleSubmit(register)}
            disabled={!agreed}
          />
        </View>

        <View style={[styles.dividerRow, { top: s(450) }]}>
          <View style={styles.dividerDot} />
          <View style={styles.dividerLine} />
          <View style={styles.dividerDot} />
        </View>

        <Typography variant="caption" tone="primary" style={[styles.socialTitle, { top: s(470) }]}>
          {t('auth.login.social')}
        </Typography>

        <View style={[styles.socialButton, { top: s(510) }]}>
          <Button variant="ghost" size="large" style={styles.socialOutline} onPress={() => {}}>
            <View style={styles.socialContent}>
              <Image source={googleIcon} style={styles.socialIcon} />
              <Typography style={styles.socialText}>{t('auth.login.google')}</Typography>
            </View>
          </Button>
        </View>

        <View style={[styles.socialButton, { top: s(566) }]}>
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
          style={[styles.footerRow, { top: s(630) }]}
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
      backgroundColor: tokens.bgScreen,
    },
    formWrapper: {
      position: 'absolute',
      width: s(408),
      height: s(688),
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
    termsRow: {
      position: 'absolute',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      gap: spacing.sm,
      left: s(15),
    },
    termsText: {
      color: tokens.textPrimary,
    },
    cta: {
      position: 'absolute',
      alignSelf: 'center',
      width: s(222),
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
    footerRow: {
      position: 'absolute',
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
