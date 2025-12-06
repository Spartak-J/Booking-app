import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as yup from 'yup';

import { useAuth } from '@/hooks/useAuth';
import { spacing } from '@/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { FormContainer, FormField } from '@/components/Form';

type FormValues = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup.string().email('Введите корректный email').required('Email обязателен'),
  password: yup.string().min(6, 'Минимум 6 символов').required('Пароль обязателен'),
});

export const LoginScreen = () => {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' },
  });
  const { login, loading } = useAuth();
  const navigation = useNavigation();
  const { colors } = useThemeColors();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const onSubmit = (values: FormValues) => login(values);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход</Text>
      <FormContainer>
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange, onBlur } }) => (
            <FormField
              label="Email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              error={formState.errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange, onBlur } }) => (
            <FormField
              label="Пароль"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              error={formState.errors.password?.message}
            />
          )}
        />
      </FormContainer>
      <Button title={loading ? 'Входим...' : 'Войти'} onPress={handleSubmit(onSubmit)} />
      <Button
        title="Создать аккаунт"
        color={colors.accent}
        onPress={() => navigation.navigate('Register' as never)}
      />
    </View>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: spacing.lg,
      gap: spacing.lg,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
    },
  });
