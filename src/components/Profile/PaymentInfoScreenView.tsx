// Component: PaymentInfoScreenView. Used in: PaymentInfoScreen.
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button, Card, HeaderBar, Typography } from '@/ui';
import { useTheme } from '@/theme';
import { spacing, typography } from '@/theme';
import { useTranslation } from '@/i18n';
import type { PaymentCard } from '@/data/payment/types';
import KeysBackground from '@/components/layout/KeysBackground';
import { s } from '@/utils/scale';

type PaymentInfoScreenViewProps = {
  cards: PaymentCard[];
  onBack: () => void;
  onAddCard: () => void;
};

export const PaymentInfoScreenView: React.FC<PaymentInfoScreenViewProps> = ({
  cards,
  onBack,
  onAddCard,
}) => {
  const { tokens } = useTheme();
  const styles = useMemo(() => getStyles(tokens), [tokens]);
  const { t } = useTranslation();
  const contentStyle = useMemo(() => [styles.content], [styles.content]);

  return (
    <View style={styles.root}>
      <HeaderBar title={t('profile.payment.title')} onBack={onBack} />

      <ScrollView contentContainerStyle={contentStyle} showsVerticalScrollIndicator={false}>
        <Typography variant="subtitle" tone="primary" style={styles.sectionTitle}>
          {t('profile.payment.yourCard')}
        </Typography>

        {cards.length === 0 ? (
          <Typography variant="body" tone="secondary" style={styles.emptyText}>
            {t('profile.payment.noCard')}
          </Typography>
        ) : (
          <View style={styles.cards}>
            {cards.map((card) => (
              <Card key={card.id} variant="filled" style={styles.card}>
                <Typography variant="menu" tone="primary" style={styles.cardTitle}>
                  {card.holderName}
                </Typography>
                <Typography variant="body" tone="primary" style={styles.cardNumber}>
                  {card.numberMasked}
                </Typography>
                <Typography variant="caption" tone="secondary">
                  {card.expiry}
                </Typography>
              </Card>
            ))}
          </View>
        )}

        <Button title={t('profile.payment.addCard')} onPress={onAddCard} style={styles.addButton} />
      </ScrollView>

      <KeysBackground variant="yellow" />
    </View>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  // LEGACY STYLES: contains hardcoded typography values
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: tokens.bgScreen,
    },
    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      gap: spacing.lg,
    },
    sectionTitle: {
      ...(typography.subtitle as object),
      color: tokens.textPrimary,
    },
    emptyText: {
      color: tokens.textSecondary,
    },
    cards: {
      gap: spacing.md,
    },
    card: {
      backgroundColor: tokens.bgCard,
    },
    cardTitle: {
      ...(typography.menu as object),
      color: tokens.textPrimary,
    },
    cardNumber: {
      ...(typography.body as object),
      color: tokens.textPrimary,
    },
    addButton: {
      alignSelf: 'center',
      minWidth: s(180),
    },
  });

export default PaymentInfoScreenView;
