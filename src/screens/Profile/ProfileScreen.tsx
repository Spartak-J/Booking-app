import React, { useState, useMemo } from 'react';
import { Button, StyleSheet, Switch, Text, View } from 'react-native';

import { useAuth } from '@/hooks/useAuth';
import { spacing, radius } from '@/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { FormContainer, FormField } from '@/components/Form';
import { Skeleton } from '@/components/Skeleton';

export const ProfileScreen = () => {
  const { user, role, updateRole, logout, isAuthenticated, updateProfile } = useAuth();
  const { colors, mode, toggle } = useThemeColors();
  const [isDark, setIsDark] = useState(mode === 'dark');
  const [language, setLanguage] = useState('ru');
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  const onSave = () => {
    updateProfile({ name, email });
  };

  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Профиль</Text>
      {!user && <Skeleton height={120} />}
      <FormContainer>
        <FormField label="Имя" value={name} onChangeText={setName} />
        <FormField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Text style={styles.label}>Роль</Text>
        <Text style={styles.value}>{role === 'owner' ? 'Арендодатель' : 'Арендатор'}</Text>
        <FormField label="Язык" value={language} onChangeText={setLanguage} />
        <Button title="Сохранить" onPress={onSave} />
      </FormContainer>

      <View style={styles.switcher}>
        <Text style={styles.label}>Тёмная тема</Text>
        <Switch
          value={isDark}
          onValueChange={(next) => {
            setIsDark(next);
            toggle();
          }}
        />
      </View>

      <View style={styles.actions}>
        <Button
          title="Переключиться в режим арендатора"
          onPress={() => updateRole('user')}
          color={role === 'user' ? colors.muted : colors.primary}
        />
        <Button
          title="Переключиться в режим арендодателя"
          onPress={() => updateRole('owner')}
          color={role === 'owner' ? colors.muted : colors.accent}
        />
      </View>

      {isAuthenticated && (
        <Button title="Выйти" onPress={logout} color={colors.error ?? '#dc2626'} />
      )}
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
    heading: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
    },
    label: {
      color: colors.muted,
      fontSize: 14,
    },
    value: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: spacing.sm,
    },
    switcher: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      padding: spacing.lg,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actions: {
      gap: spacing.md,
    },
  });
