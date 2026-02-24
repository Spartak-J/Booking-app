// Component: BackButton. Used in: AdminDashboardScreen.tsx, AdminUserDetailsScreen.tsx, AdminOfferDetailsScreen.tsx….
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '@/theme';
import { spacing, radius } from '@/theme';
import { useTranslation } from '@/i18n';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/ui';

export const BackButton: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const { t } = useTranslation();
  const role = useAuthStore((state) => state.role);
  const target = role === 'owner' ? 'OwnerSearch' : 'Search';

  return (
    <View style={styles.wrapper}>
      <Button
        title={`← ${t('nav.back')}`}
        variant="ghost"
        size="small"
        style={styles.button}
        onPress={() => {
          // Всегда уходим на главный экран поиска (через корневой таб-навигатор)
          (navigation as any)?.navigate?.('Main', { screen: target });
        }}
      />
    </View>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      marginBottom: spacing.sm,
    },
    button: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignSelf: 'flex-start',
    },
  });
