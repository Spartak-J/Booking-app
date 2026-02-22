// Component: PaymentInfoScreenView. Used in: PaymentInfoScreen.
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button, Card, ScreenShell, Typography } from '@/ui';
import { useTheme } from '@/theme';
import { radius, spacing, typography } from '@/theme';
import { useTranslation } from '@/i18n';
import type { PaymentCard } from '@/data/payment/types';
import { s } from '@/utils/scale';

type PaymentInfoScreenViewProps = {
  cards: PaymentCard[];
  onBack: () => void;
  onAddCard: () => void;
  footer?: React.ReactNode;
};

export const PaymentInfoScreenView: React.FC<PaymentInfoScreenViewProps> = ({
  cards,
  onBack,
  onAddCard,
  footer,
}) => {
  const { tokens } = useTheme();
  const styles = useMemo(() => getStyles(tokens), [tokens]);
  const { t } = useTranslation();
  const contentStyle = useMemo(() => [styles.scrollContent], [styles.scrollContent]);

  return (
    <ScreenShell
      title={t('profile.payment.title')}
      onBack={onBack}
      showKeys
      footerSlot={footer}
      contentStyle={styles.shellContent}
    >
      <ScrollView contentContainerStyle={contentStyle} showsVerticalScrollIndicator={false}>
        <View style={styles.surface}>
          <Typography variant="subtitle" tone="primary" style={styles.sectionTitle}>
            {t('profile.payment.yourCard')}
          </Typography>

          {cards.length === 0 ? (
            <Typography variant="body" tone="secondary" style={styles.emptyText}>
              {t('profile.payment.noCard')}
            </Typography>
          ) : null}

          <View style={styles.tilesGrid}>
            {cards.map((card) => (
              <Card key={card.id} variant="filled" style={styles.cardTile}>
                <Typography variant="caption" tone="secondary" style={styles.tileLabel}>
                  {card.holderName}
                </Typography>
                <Typography variant="menu" tone="primary" style={styles.tileNumber}>
                  {card.numberMasked}
                </Typography>
                <Typography variant="caption" tone="secondary" style={styles.tileExpiry}>
                  {card.expiry}
                </Typography>
              </Card>
            ))}

            <Button onPress={onAddCard} variant="ghost" style={styles.addTileButton}>
              <View style={styles.addTileInnerCta}>
                <Typography variant="caption" tone="onAccent" style={styles.addTileInnerText}>
                  {t('profile.payment.addCard')}
                </Typography>
              </View>
            </Button>
          </View>
        </View>
      </ScrollView>
    </ScreenShell>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  // LEGACY STYLES: contains hardcoded typography values
  StyleSheet.create({
    shellContent: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: 0,
    },
    scrollContent: {
      paddingBottom: spacing.xl,
    },
    surface: {
      backgroundColor: tokens.bgSurface,
      borderRadius: radius.xl,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      gap: spacing.md,
    },
    sectionTitle: {
      ...(typography.subtitle as object),
      color: tokens.textPrimary,
      textAlign: 'center',
    },
    emptyText: {
      color: tokens.textSecondary,
      textAlign: 'center',
    },
    tilesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    cardTile: {
      width: s(156),
      minHeight: s(124),
      borderRadius: radius.lg,
      backgroundColor: tokens.bgField,
      borderWidth: 1,
      borderColor: tokens.border,
      padding: spacing.sm,
      justifyContent: 'space-between',
    },
    tileLabel: {
      ...(typography.caption as object),
      color: tokens.textSecondary,
    },
    tileNumber: {
      ...(typography.caption as object),
      color: tokens.textPrimary,
    },
    tileExpiry: {
      ...(typography.caption as object),
      color: tokens.textSecondary,
    },
    addTileButton: {
      width: s(156),
      minHeight: s(124),
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: tokens.border,
      backgroundColor: tokens.bgField,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
    },
    addTileInnerCta: {
      minWidth: s(108),
      borderRadius: radius.xl,
      backgroundColor: tokens.accent,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addTileInnerText: {
      ...(typography.caption as object),
      textAlign: 'center',
    },
  });

export default PaymentInfoScreenView;
