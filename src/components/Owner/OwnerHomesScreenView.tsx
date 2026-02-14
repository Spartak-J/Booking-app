// Component: OwnerHomesScreenView. Used in: OwnerHomesScreen.
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Button, Card, IconButton, Loader, ScreenShell, Typography } from '@/ui';
import { useTheme } from '@/theme';
import { spacing, radius, typography } from '@/theme';
import { s } from '@/utils/scale';
import { CachedImage } from '@/components/CachedImage';

export type OwnerHomeItem = {
  id: string;
  title: string;
  address?: string;
  city?: string;
  price?: string;
  isActive?: boolean;
  image?: string;
  rating?: number;
  reviewsCount?: number;
};

type OwnerHomesScreenViewProps = {
  homes: OwnerHomeItem[];
  isLoading: boolean;
  onBack: () => void;
  onAdd: () => void;
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
  onOpenReviews: (id: string) => void;
  onOpenBookings: (id: string) => void;
  title: string;
  addLabel: string;
  emptyText: string;
  stateActiveLabel: string;
  stateHiddenLabel: string;
  editLabel: string;
  reviewsLabel: string;
  bookingsLabel: string;
};

export const OwnerHomesScreenView: React.FC<OwnerHomesScreenViewProps> = ({
  homes,
  isLoading,
  onBack,
  onAdd,
  onOpen,
  onEdit,
  onOpenReviews,
  onOpenBookings,
  title,
  addLabel,
  emptyText,
  stateActiveLabel,
  stateHiddenLabel,
  editLabel,
  reviewsLabel,
  bookingsLabel,
}) => {
  const { tokens } = useTheme();
  const styles = useMemo(() => getStyles(tokens), [tokens]);

  return (
    <ScreenShell
      title={title}
      onBack={onBack}
      contentStyle={styles.content}
      rightSlot={
        <IconButton
          onPress={() => {}}
          icon={<MaterialCommunityIcons name="magnify" size={s(22)} />}
          variant="ghost"
          size="sm"
        />
      }
    >
      {isLoading ? (
        <View style={styles.loaderBlock}>
          <Loader variant="skeleton" height={s(120)} />
          <Loader variant="skeleton" height={s(120)} />
        </View>
      ) : (
        <FlatList
          data={homes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card} padding="sm" onPress={() => onOpen(item.id)}>
              <Typography
                variant="subtitle"
                tone="primary"
                numberOfLines={1}
                style={styles.cardTitle}
              >
                {item.title}
              </Typography>
              <View style={styles.cardTop}>
                <View style={styles.previewWrapper}>
                  {item.image ? (
                    <CachedImage uri={item.image} style={styles.preview} />
                  ) : (
                    <View style={[styles.preview, styles.previewPlaceholder]} />
                  )}
                </View>

                <View style={styles.cardMeta}>
                  <View style={styles.metaRow}>
                    <MaterialCommunityIcons
                      name="map-marker-outline"
                      size={s(14)}
                      color={tokens.textPrimary}
                    />
                    <Typography
                      variant="caption"
                      tone="primary"
                      numberOfLines={2}
                      style={styles.metaText}
                    >
                      {item.address || item.city || ''}
                    </Typography>
                  </View>

                  <View style={styles.metaRow}>
                    <MaterialCommunityIcons
                      name="star-outline"
                      size={s(14)}
                      color={tokens.textPrimary}
                    />
                    <Typography variant="caption" tone="primary" style={styles.metaText}>
                      {item.rating?.toFixed(1) ?? '0.0'}
                    </Typography>
                    <Typography variant="caption" tone="secondary" style={styles.metaText}>
                      • {item.reviewsCount ?? 0}
                    </Typography>
                  </View>

                  <Typography
                    variant="caption"
                    tone="primary"
                    numberOfLines={1}
                    style={styles.priceText}
                  >
                    {item.price ?? ''}
                  </Typography>

                  <View style={styles.actionColumn}>
                    <Button
                      size="small"
                      variant="ghost"
                      title={reviewsLabel}
                      onPress={() => onOpenReviews(item.id)}
                    />
                    <Button
                      size="small"
                      variant="ghost"
                      title={editLabel}
                      onPress={() => onEdit(item.id)}
                    />
                    <Button
                      size="small"
                      variant="ghost"
                      title={bookingsLabel}
                      onPress={() => onOpenBookings(item.id)}
                    />
                  </View>
                </View>
              </View>
              <Typography
                variant="caption"
                tone={item.isActive ? 'accent' : 'secondary'}
                style={styles.statusText}
                numberOfLines={1}
              >
                {item.isActive ? stateActiveLabel : stateHiddenLabel}
              </Typography>
            </Card>
          )}
          contentContainerStyle={styles.list}
          ListFooterComponent={
            <Card style={styles.addCard} padding="sm">
              <View style={styles.addImagePlaceholder}>
                <Button title={addLabel} size="small" onPress={onAdd} />
              </View>
            </Card>
          }
          ListEmptyComponent={
            <Typography variant="caption" tone="secondary" style={styles.empty}>
              {emptyText}
            </Typography>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenShell>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.xl,
    },
    list: {
      gap: spacing.md,
      paddingBottom: spacing.xl,
    },
    card: {
      gap: spacing.sm,
      borderRadius: radius.lg,
    },
    cardTitle: {
      ...(typography.subtitle as object),
      textAlign: 'center',
      marginTop: spacing.xs,
    },
    cardTop: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    previewWrapper: {
      width: s(170),
      height: s(220),
      borderRadius: radius.sm,
      overflow: 'hidden',
      backgroundColor: tokens.bgPanel,
    },
    preview: {
      width: '100%',
      height: '100%',
    },
    previewPlaceholder: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardMeta: {
      flex: 1,
      gap: spacing.sm,
      justifyContent: 'center',
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    priceText: {
      ...(typography.caption as object),
      color: tokens.textPrimary,
    },
    metaText: {
      ...(typography.caption as object),
      color: tokens.textPrimary,
      flexShrink: 1,
    },
    actionColumn: {
      gap: spacing.xs,
      marginTop: spacing.xs,
    },
    statusText: {
      textAlign: 'right',
      paddingHorizontal: spacing.xs,
    },
    loaderBlock: {
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    empty: {
      textAlign: 'center',
      paddingVertical: spacing.lg,
    },
    addCard: {
      width: s(132),
      minHeight: s(122),
      justifyContent: 'center',
      borderRadius: radius.lg,
      alignSelf: 'flex-start',
    },
    addImagePlaceholder: {
      minHeight: s(98),
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: tokens.bgSurface,
    },
  });

export default OwnerHomesScreenView;
