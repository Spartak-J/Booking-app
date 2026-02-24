import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Card, ScreenShell, Typography } from '@/ui';
import { useTheme, spacing } from '@/theme';
import { useTranslation } from '@/i18n';
import type { Role } from '@/types';

type Props = {
  role: Role;
  onBack: () => void;
};

const PrivacyScreenView: React.FC<Props> = ({ role, onBack }) => {
  const { tokens } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => getStyles(tokens), [tokens]);

  const subtitle =
    role === 'owner'
      ? t('profile.privacy.subtitle.owner')
      : role === 'admin'
        ? t('profile.privacy.subtitle.admin')
        : t('profile.privacy.subtitle.user');

  const items = [
    {
      id: 'data',
      title: t('profile.privacy.item.data.title'),
      body: t('profile.privacy.item.data.body'),
    },
    {
      id: 'sharing',
      title: t('profile.privacy.item.sharing.title'),
      body: t('profile.privacy.item.sharing.body'),
    },
    {
      id: 'security',
      title: t('profile.privacy.item.security.title'),
      body: t('profile.privacy.item.security.body'),
    },
  ];

  return (
    <ScreenShell title={t('profile.privacy.title')} onBack={onBack} showKeys>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Typography variant="body" tone="secondary">
          {subtitle}
        </Typography>

        <View style={styles.list}>
          {items.map((item) => (
            <Card key={item.id} variant="filled" style={styles.card}>
              <Typography variant="subtitle" tone="primary">
                {item.title}
              </Typography>
              <Typography variant="body" tone="secondary">
                {item.body}
              </Typography>
            </Card>
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
    list: {
      gap: spacing.md,
    },
    card: {
      gap: spacing.sm,
      backgroundColor: tokens.bgCard,
    },
  });

export default PrivacyScreenView;
