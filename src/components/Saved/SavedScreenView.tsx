// Component: SavedScreenView. Used in: SavedScreen.
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { spacing } from '@/theme';
import { OfferCard } from '@/components/OfferCard';
import type { Offer } from '@/types';
import { Card, Typography } from '@/ui';

type SavedScreenViewProps = {
  offers: Offer[];
  onOpenOffer: (offerId: string) => void;
};

export const SavedScreenView: React.FC<SavedScreenViewProps> = ({ offers, onOpenOffer }) => {
  const { t } = useTranslation();
  const styles = useMemo(() => getStyles(), []);

  return (
    <View style={styles.content}>
      <Typography variant="h2" tone="primary">
        {t('saved.title')}
      </Typography>
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
    </View>
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
