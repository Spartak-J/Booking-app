import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { HeaderBar, ScreenContainer, Typography, Input, Button } from '@/ui';
import { useTranslation } from '@/i18n';
import { spacing, radius } from '@/theme';
import { useTheme, withOpacity } from '@/theme';
import type { RootStackParamList } from '@/navigation/RootNavigator';

// Экран: вход администратора (email). Логика авторизации пока заглушка.
const AdminEntryScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const styles = useMemo(() => getStyles(tokens), [tokens]);

  return (
    <ScreenContainer
      scroll
      edges={['top', 'left', 'right']}
      contentContainerStyle={styles.screenContent}
    >
      <HeaderBar
        title={t('admin.entry.title')}
        onBack={() => navigation.goBack()}
        showBack
        showSearch={false}
        showMenu={false}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          <Typography variant="subtitle" tone="primary" style={styles.label}>
            {t('admin.entry.prompt')}
          </Typography>
          <Input
            placeholder={t('admin.entry.emailPlaceholder')}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Button title={t('admin.entry.continue')} onPress={() => undefined} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    screenContent: {
      paddingBottom: spacing.xl,
    },
    content: {
      padding: spacing.lg,
      gap: spacing.lg,
    },
    formCard: {
      backgroundColor: withOpacity(tokens.textPrimary, 0.03),
      borderRadius: radius.lg,
      padding: spacing.lg,
      gap: spacing.md,
    },
    label: {
      fontWeight: '600',
    },
  });

export default AdminEntryScreen;
