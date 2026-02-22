import React, { useMemo } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button, Card, ScreenShell, Typography } from '@/ui';
import { spacing } from '@/theme';
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';

type Props = {
  onBack: () => void;
  onOpenHelp: () => void;
  onGoHome: () => void;
};

const AboutScreenView: React.FC<Props> = ({ onBack, onOpenHelp, onGoHome }) => {
  const { tokens } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => getStyles(tokens), [tokens]);

  const values = [
    { id: 'safe', icon: 'shield-check-outline' as const, text: t('profile.about.values.safe') },
    { id: 'fast', icon: 'lightning-bolt-outline' as const, text: t('profile.about.values.fast') },
    { id: 'local', icon: 'map-marker-radius-outline' as const, text: t('profile.about.values.local') },
  ];

  return (
    <ScreenShell title={t('profile.about.title')} onBack={onBack} showKeys>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card variant="filled" style={styles.heroCard}>
          <Typography variant="h2" tone="primary">
            {t('profile.about.heroTitle')}
          </Typography>
          <Typography variant="body" tone="secondary">
            {t('profile.about.heroBody')}
          </Typography>
        </Card>

        <Card variant="filled" style={styles.card}>
          <Typography variant="subtitle" tone="primary">
            {t('profile.about.missionTitle')}
          </Typography>
          <Typography variant="body" tone="secondary">
            {t('profile.about.missionBody')}
          </Typography>
        </Card>

        <Card variant="filled" style={styles.card}>
          <Typography variant="subtitle" tone="primary">
            {t('profile.about.valuesTitle')}
          </Typography>
          <View style={styles.valuesList}>
            {values.map((item) => (
              <View key={item.id} style={styles.valueRow}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={spacing.lg}
                  color={tokens.textPrimary}
                />
                <Typography variant="body" tone="secondary" style={styles.valueText}>
                  {item.text}
                </Typography>
              </View>
            ))}
          </View>
        </Card>

        <Card variant="filled" style={styles.card}>
          <Typography variant="subtitle" tone="primary">
            {t('profile.about.contactsTitle')}
          </Typography>
          <Typography variant="body" tone="secondary">
            {t('profile.about.contactsBody')}
          </Typography>
          <View style={styles.actions}>
            <Button title={t('profile.about.cta.help')} onPress={onOpenHelp} />
            <Button variant="ghost" title={t('profile.about.cta.home')} onPress={onGoHome} />
          </View>
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
    heroCard: {
      gap: spacing.sm,
      backgroundColor: tokens.bgCard,
    },
    card: {
      gap: spacing.md,
      backgroundColor: tokens.bgCard,
    },
    valuesList: {
      gap: spacing.sm,
    },
    valueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    valueText: {
      flex: 1,
    },
    actions: {
      gap: spacing.sm,
    },
  });

export default AboutScreenView;
