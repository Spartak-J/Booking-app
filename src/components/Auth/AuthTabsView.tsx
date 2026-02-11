// Component: AuthTabsView. Used in: AuthTabsScreen.
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, View } from 'react-native';
import * as yup from 'yup';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/theme';
import { spacing } from '@/theme';
import { useTranslation } from '@/i18n';
import { Button, Card, Input, ScreenContainer, Typography } from '@/ui';

type AuthTab = 'login' | 'register' | 'reset';

type LoginValues = { email: string; password: string };
type RegisterValues = { name: string; email: string; password: string };
type ResetValues = { email: string };

export const AuthTabsView = () => {
  const [tab, setTab] = useState<AuthTab>('login');
  const { login, register, googleLogin, resetPassword, loading } = useAuth();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const loginSchema = useMemo(
    () =>
      yup.object({
        email: yup.string().email(t('auth.errors.email')).required(t('auth.errors.requiredEmail')),
        password: yup
          .string()
          .min(6, t('auth.errors.passwordLength'))
          .required(t('auth.errors.requiredPassword')),
      }),
    [t],
  );

  const registerSchema = useMemo(
    () =>
      yup.object({
        name: yup.string().required(t('auth.errors.requiredName')),
        email: yup.string().email(t('auth.errors.email')).required(t('auth.errors.requiredEmail')),
        password: yup
          .string()
          .min(6, t('auth.errors.passwordLength'))
          .required(t('auth.errors.requiredPassword')),
      }),
    [t],
  );

  const resetSchema = useMemo(
    () =>
      yup.object({
        email: yup.string().email(t('auth.errors.email')).required(t('auth.errors.requiredEmail')),
      }),
    [t],
  );

  const loginForm = useForm<LoginValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: 'demo@oselya.app', password: 'password' },
  });
  const [loginShowPassword, setLoginShowPassword] = useState(false);

  const registerForm = useForm<RegisterValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });
  const [registerShowPassword, setRegisterShowPassword] = useState(false);

  const resetForm = useForm<ResetValues>({
    resolver: yupResolver(resetSchema),
    defaultValues: { email: '' },
  });

  const handleLogin = (values: LoginValues) => login(values);
  const handleRegister = (values: RegisterValues) => register(values);
  const handleReset = async (values: ResetValues) => {
    await resetPassword(values.email);
    Alert.alert(t('auth.submit.reset'), t('auth.submit.reset'));
    setTab('login');
  };


  const renderTabButton = (key: AuthTab, label: string) => (
    <Button
      key={key}
      title={label}
      size="small"
      variant={tab === key ? 'primary' : 'ghost'}
      style={styles.tabButton}
      onPress={() => setTab(key)}
    />
  );

  return (
    <ScreenContainer style={styles.screen} edges={['left', 'right']}>
      <View style={styles.container}>
        <Typography variant="h1" tone="accent">
          OSELYA
        </Typography>
        <Card style={styles.tabs} padding="xs">
          <View style={styles.tabRow}>
            {renderTabButton('login', t('auth.login'))}
            {renderTabButton('register', t('auth.register'))}
            {renderTabButton('reset', t('auth.reset'))}
          </View>
        </Card>

        <View style={styles.content}>
          {tab === 'login' && (
            <Card style={styles.formCard} padding="lg">
              <Controller
                control={loginForm.control}
                name="email"
                render={({ field: { value, onChange, onBlur } }) => (
                  <Input
                    label={t('auth.email')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={loginForm.formState.errors.email?.message}
                  />
                )}
              />
            <Controller
              control={loginForm.control}
              name="password"
              render={({ field: { value, onChange, onBlur } }) => (
                <View style={styles.passwordRow}>
                  <Input
                    label={t('auth.password')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!loginShowPassword}
                    error={loginForm.formState.errors.password?.message}
                    inputStyle={{ paddingRight: spacing.xl }}
                  />
                  <MaterialCommunityIcons
                    name={loginShowPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textPrimary}
                    style={styles.eyeIcon}
                    onPress={() => setLoginShowPassword((prev) => !prev)}
                  />
                </View>
              )}
            />
              <Button
                title={t('auth.submit.login')}
                onPress={loginForm.handleSubmit(handleLogin)}
                isLoading={loading}
              />
              <Button title={t('auth.google')} variant="ghost" onPress={googleLogin} />
            </Card>
          )}

          {tab === 'register' && (
            <Card style={styles.formCard} padding="lg">
              <Controller
                control={registerForm.control}
                name="name"
                render={({ field: { value, onChange, onBlur } }) => (
                  <Input
                    label={t('auth.name')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={registerForm.formState.errors.name?.message}
                  />
                )}
              />
              <Controller
                control={registerForm.control}
                name="email"
                render={({ field: { value, onChange, onBlur } }) => (
                  <Input
                    label={t('auth.email')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={registerForm.formState.errors.email?.message}
                  />
                )}
              />
            <Controller
              control={registerForm.control}
              name="password"
              render={({ field: { value, onChange, onBlur } }) => (
                <View style={styles.passwordRow}>
                  <Input
                    label={t('auth.password')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!registerShowPassword}
                    error={registerForm.formState.errors.password?.message}
                    inputStyle={{ paddingRight: spacing.xl }}
                  />
                  <MaterialCommunityIcons
                    name={registerShowPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textPrimary}
                    style={styles.eyeIcon}
                    onPress={() => setRegisterShowPassword((prev) => !prev)}
                  />
                </View>
              )}
            />
              <Button
                title={t('auth.submit.register')}
                onPress={registerForm.handleSubmit(handleRegister)}
                isLoading={loading}
              />
              <Button title={t('auth.google')} variant="ghost" onPress={googleLogin} />
            </Card>
          )}

          {tab === 'reset' && (
            <Card style={styles.formCard} padding="lg">
              <Controller
                control={resetForm.control}
                name="email"
                render={({ field: { value, onChange, onBlur } }) => (
                  <Input
                    label={t('auth.email')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={resetForm.formState.errors.email?.message}
                  />
                )}
              />
              <Button
                title={t('auth.submit.reset')}
                onPress={resetForm.handleSubmit(handleReset)}
                isLoading={loading}
              />
            </Card>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
};

const getStyles = (colors: Record<string, string>) =>
  StyleSheet.create({
    screen: {
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      padding: spacing.xl,
      gap: spacing.lg,
      maxWidth: 520,
      alignSelf: 'center',
    },
    tabs: {
      padding: 0,
    },
    tabRow: {
      flexDirection: 'row',
      gap: spacing.xs,
    },
    tabButton: {
      flex: 1,
    },
    content: {
      flex: 1,
      gap: spacing.lg,
    },
    formCard: {
      gap: spacing.md,
    },
    passwordRow: {
      position: 'relative',
    },
    eyeIcon: {
      position: 'absolute',
      right: spacing.md,
      top: spacing.md + 4,
    },
  });

export default AuthTabsView;
