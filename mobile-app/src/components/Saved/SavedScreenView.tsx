// Component: SavedScreenView. Used in: SavedScreen.
import React, { useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { useTranslation } from '@/i18n';
import { spacing } from '@/theme';
import { OfferCard } from '@/components/OfferCard';
import type { Offer } from '@/types';
import { Card, ScreenShell, Typography } from '@/ui';

type SavedScreenViewProps = {
  offers: Offer[];
  onBack: () => void;
  onOpenOffer: (offerId: string) => void;
};

export const SavedScreenView: React.FC<SavedScreenViewProps> = ({ offers, onBack, onOpenOffer }) => {
  const { t } = useTranslation();
  const styles = useMemo(() => getStyles(), []);

  return (
    <ScreenShell title={t('saved.title')} onBack={onBack} showKeys contentStyle={styles.content}>
      {offers.length === 0 ? (
        <Card style={styles.card} padding="lg">
          <Typography variant="caption" tone="secondary">
            {t('saved.empty')}
          </Typography>
        </Card>
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OfferCard offer={item} onPress={() => onOpenOffer(item.id)} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </ScreenShell>
  );
};

const getStyles = () =>
  StyleSheet.create({
    content: {
      padding: spacing.lg,
      gap: spacing.md,
    },
    listContent: {
      gap: spacing.md,
    },
    card: {},
  });

export default SavedScreenView;
