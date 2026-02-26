import React, { useMemo } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';

import AdminToolsStatusPanel from '@/components/Admin/AdminToolsStatusPanel';
import { Card, ListItem, ScreenShell, Typography } from '@/ui';
import { useTheme, spacing } from '@/theme';
import { useTranslation } from '@/i18n';

type Props = {
  onBack: () => void;
  onOpenUsers: () => void;
  onOpenOffers: () => void;
  onOpenMessages: () => void;
  systemStatus?: React.ComponentProps<typeof AdminToolsStatusPanel>['data'];
  systemStatusLoading?: boolean;
  onRefreshCurrency?: () => void;
  currencyRefreshing?: boolean;
  currencyRefreshInfo?: string;
  currencyUpdatedAtLabel?: string;
};

const SettingsScreenView: React.FC<Props> = ({
  onBack,
  onOpenUsers,
  onOpenOffers,
  onOpenMessages,
  systemStatus,
  systemStatusLoading,
  onRefreshCurrency,
  currencyRefreshing,
  currencyRefreshInfo,
  currencyUpdatedAtLabel,
}) => {
  const { tokens } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => getStyles(tokens), [tokens]);

  const menuItems = [
    {
      id: 'users',
      title: t('profile.settings.item.users'),
      icon: 'account-multiple-outline' as const,
      onPress: onOpenUsers,
    },
    {
      id: 'offers',
      title: t('profile.settings.item.offers'),
      icon: 'home-city-outline' as const,
      onPress: onOpenOffers,
    },
    {
      id: 'messages',
      title: t('profile.settings.item.messages'),
      icon: 'message-text-outline' as const,
      onPress: onOpenMessages,
    },
  ];

  return (
    <ScreenShell title={t('profile.settings.title')} onBack={onBack} showKeys>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card variant="filled" style={styles.infoCard}>
          <Typography variant="subtitle" tone="primary">
            {t('profile.settings.summary.title')}
          </Typography>
          <Typography variant="body" tone="secondary">
            {t('profile.settings.summary.body')}
          </Typography>
        </Card>

        <AdminToolsStatusPanel
          data={systemStatus}
          loading={systemStatusLoading}
          onRefreshCurrency={onRefreshCurrency}
          currencyRefreshing={currencyRefreshing}
          currencyRefreshInfo={currencyRefreshInfo}
          currencyUpdatedAtLabel={currencyUpdatedAtLabel}
        />

        <View style={styles.list}>
          {menuItems.map((item) => (
            <ListItem
              key={item.id}
              title={item.title}
              onPress={item.onPress}
              left={<MaterialCommunityIcons name={item.icon} size={spacing.lg} color={tokens.textPrimary} />}
            />
          ))}
        </View>
      </ScrollView>
    </ScreenShell>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl,
      gap: spacing.lg,
    },
    infoCard: {
      gap: spacing.sm,
      backgroundColor: tokens.bgCard,
    },
    list: {
      gap: spacing.md,
    },
  });

export default SettingsScreenView;
