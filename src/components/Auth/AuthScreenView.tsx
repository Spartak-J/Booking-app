// Shared Auth screen view for login & register
// Экран завершен. Не править без крайней необходимости, чтобы не сломать верстку. Если нужно изменить UI, правь именно этот компонент, а не экраны в папке screens.
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as yup from 'yup';

import googleIcon from '@/assets/images/google.png';
import facebookIcon from '@/assets/images/facebook.png';
import { useTranslation } from '@/i18n';
import { useAuth } from '@/hooks/useAuth';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { Routes } from '@/navigation/routes';
import { useTheme, radius, spacing, typography } from '@/theme';
import { Button, IconButton, Input, LineWithDots, ScreenContainer, Typography } from '@/ui';
import { s } from '@/utils/scale';

type AuthMode = 'login' | 'register';

type FormValues = {
  name?: string;
  email: string;
  password: string;
};

type Navigation = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  mode: AuthMode;
};

export const AuthScreenView: React.FC<Props> = ({ mode }) => {
  const navigation = useNavigation<Navigation>();
  const { login, register } = useAuth();
  const { tokens } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => getStyles(tokens), [tokens]);

  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const schema = useMemo(() => {
    const base = {
      email: yup.string().required(),
      password: yup.string().required(),
    };
    if (mode === 'register') {
      return yup.object({ ...base, name: yup.string().required() });
    }
    return yup.object(base);
  }, [mode]);

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = handleSubmit((values) => {
    if (mode === 'register') {
      if (!agreed) return;
      register(values as Required<FormValues>);
    } else {
      login(values);
    }
  });

  const isRegister = mode === 'register';

  // Высота карточки под макет: login ~642dp, register ~688dp
  const cardMinHeight = isRegister ? s(688) : s(642);

  return (
    <ScreenContainer
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
      scroll={false}
      withKeyboardAvoiding
      edges={['left', 'right']}
    >
      <View style={styles.formWrapper}>
        <View style={[styles.card, { minHeight: cardMinHeight }]}>
        <View style={styles.headerBlock}>
          <Typography variant="h1" tone="primary" style={styles.title}>
            {t(isRegister ? 'auth.register.title' : 'auth.login.title')}
          </Typography>

          <Typography variant="body" tone="primary" style={styles.subtitle}>
            {t(isRegister ? 'auth.register.subtitle' : 'auth.login.subtitle')}
          </Typography>
        </View>

        <View style={styles.fieldsBlock}>
          {isRegister ? (
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
          ) : null}

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
              <View style={styles.passwordFieldWrap}>
                <Input
                  value={value}
                  onChangeText={onChange}
                  placeholder={t('auth.placeholder.password')}
                  secureTextEntry={!showPassword}
                  containerStyle={styles.inputContainer}
                  inputStyle={[styles.input, styles.passwordInput]}
                />
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={tokens.textPrimary}
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword((prev) => !prev)}
                />
              </View>
            )}
          />

          {isRegister ? (
            <View style={styles.termsRow}>
              <IconButton
                onPress={() => setAgreed((p) => !p)}
                variant={agreed ? 'filled' : 'outlined'}
                size="sm"
                icon={agreed ? <Typography variant="caption" tone="onAccent">✓</Typography> : null}
              />
              <Typography variant="caption" tone="primary" style={styles.termsText}>
                {t('auth.register.terms')}
              </Typography>
            </View>
          ) : null}

          <View style={styles.ctaContainer}>
            <Button
              onPress={onSubmit}
              disabled={isRegister && !agreed}
              style={styles.cta}
              variant="primary"
            >
              <Typography variant="buttonMd" tone="onAccent" style={styles.ctaText}>
                {t(isRegister ? 'auth.register.continue' : 'auth.login.continue')}
              </Typography>
            </Button>
          </View>
        </View>

        <LineWithDots
          width={s(320)}
          thickness={2}
          dotSize={12}
          style={styles.dividerRow}
        />

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
          textStyle={styles.footerText}
          title={t(isRegister ? 'auth.register.haveAccount' : 'auth.login.noAccount')}
          onPress={() =>
            navigation.navigate(isRegister ? Routes.Login : Routes.Register)
          }
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
    },
    // Центровка карточки по макету; редактируй padding для смещения по экрану
    screenContent: {
      flexGrow: 1,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xl * 1.6,
      justifyContent: 'center',
      alignItems: 'center',
    },
    // Обёртка для карточки (держит maxWidth и центрирование)
    formWrapper: {
      flex: 1,
      width: '100%',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.lg,
    },
    // Карточка формы
    card: {
      width: '100%',
      borderRadius: 0,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xl * 1.4,
      gap: spacing.lg,
    },
    // Заголовок + подзаголовок
    headerBlock: {
      gap: spacing.xs,
      alignItems: 'center',
    },
    title: {
      textAlign: 'center',
    },
    subtitle: {
      textAlign: 'center',
    },
    // Поля ввода
    fieldsBlock: {
      gap: spacing.md,
    },
    // Контейнер поля
    inputContainer: {
      width: '100%',
    },
    passwordFieldWrap: {
      position: 'relative',
    },
    // Само поле (высота/радиус)
    input: {
      width: '100%',
      height: s(46),
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: tokens.borderStrong,
      paddingHorizontal: spacing.lg,
      color: tokens.textPrimary,
    },
    passwordInput: {
      paddingRight: spacing.xl * 2,
    },
    eyeIcon: {
      position: 'absolute',
      right: spacing.md,
      top: s(13),
    },
    // Чекбокс согласия (только register)
    termsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    termsText: {
      flex: 1,
      color: tokens.textPrimary,
    },
    // Разделитель между формой и соц-кнопками (LineWithDots)
    dividerRow: {
      alignSelf: 'center',
      marginVertical: spacing.md,
    },
    // CTA-кнопка: размеры/радиус по макету
    ctaContainer: {
      marginTop: spacing.lg * 2, // отдельный отступ от полей до кнопки
    },
    cta: {
      width: s(222),
      height: s(46),
      alignSelf: 'center',
      borderRadius: radius.xl,
      paddingVertical: s(15),
      paddingHorizontal: s(49),
      justifyContent: 'center',
      backgroundColor: tokens.accent,
    },
    ctaText: {
      textAlign: 'center',
      // используем типографику вместо локальных размеров
      ...typography.buttonMd,
      color: tokens.textOnAccent,
    },
    // Соц-кнопки
    socialBlock: {
      gap: spacing.md,
      marginTop: spacing.sm,
    },
    socialTitle: {
      textAlign: 'center',
    },
    // Обводка соц-кнопок
    socialOutline: {
      alignSelf: 'stretch',
      borderWidth: 1,
      borderColor: tokens.borderStrong,
      borderRadius: radius.lg,
      justifyContent: 'center',
      paddingVertical: 4,
      paddingHorizontal: 0,
    },
    // Контент соц-кнопки
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
    // Ссылка переключения режимов
    footerRow: {
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: 0,
      paddingHorizontal: 0,
      borderWidth: 0,
      marginTop: 0,
    },
    footerText: {
      color: tokens.textPrimary,
      textAlign: 'center',
    },
  });

export default AuthScreenView;
