import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button, Card, ScreenShell, Typography } from '@/ui';
import { useTheme, spacing } from '@/theme';
import { useTranslation } from '@/i18n';
import type { Role } from '@/types';

type Props = {
  role: Role;
  onBack: () => void;
  onOpenMessages: () => void;
};

const HelpScreenView: React.FC<Props> = ({ role, onBack, onOpenMessages }) => {
  const { tokens } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => getStyles(tokens), [tokens]);

  const subtitle =
    role === 'owner'
      ? t('profile.help.subtitle.owner')
      : role === 'admin'
        ? t('profile.help.subtitle.admin')
        : t('profile.help.subtitle.user');

  const faq = [
    {
      id: 'checkin',
      title: t('profile.help.faq.checkin.title'),
      body: t('profile.help.faq.checkin.body'),
    },
    {
      id: 'payment',
      title: t('profile.help.faq.payment.title'),
      body: t('profile.help.faq.payment.body'),
    },
    {
      id: 'status',
      title: t('profile.help.faq.status.title'),
      body: t('profile.help.faq.status.body'),
    },
  ];

  return (
    <ScreenShell title={t('profile.help.title')} onBack={onBack} showKeys>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Typography variant="body" tone="secondary">
          {subtitle}
        </Typography>

        <View style={styles.list}>
          {faq.map((item) => (
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

        <Card variant="filled" style={styles.supportCard}>
          <Typography variant="subtitle" tone="primary">
            {t('profile.help.support.title')}
          </Typography>
          <Typography variant="body" tone="secondary">
            {t('profile.help.support.body')}
          </Typography>
          <Button title={t('profile.help.support.action')} onPress={onOpenMessages} />
        </Card>
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
    supportCard: {
      gap: spacing.md,
      backgroundColor: tokens.bgCard,
    },
  });

export default HelpScreenView;
