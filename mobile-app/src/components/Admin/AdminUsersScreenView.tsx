import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { radius, spacing, typography, useTheme } from '@/theme';
import { Button, Card, HeaderBar, Pagination, ScreenContainer, Typography } from '@/ui';
import AdminSearchMenu from '@/components/Admin/AdminSearchMenu';
import AdminSearchOptionsMenu from '@/components/Admin/AdminSearchOptionsMenu';
import { s } from '@/utils/scale';

export type AdminUserCardItem = {
  id: string;
  name: string;
  phone?: string;
  email: string;
  city: string;
  rating: string;
  isBlocked: boolean;
};

type Props = {
  title: string;
  avatarInitial: string;
  query: string;
  sortMode: 'city' | 'rating';
  searchOptionsVisible: boolean;
  users: AdminUserCardItem[];
  page: number;
  totalPages: number;
  onQueryChange: (value: string) => void;
  onBack: () => void;
  onToggleSearchOptions: () => void;
  onSetSortMode: (mode: 'city' | 'rating') => void;
  onSetPage: (page: number) => void;
  onWrite: (userId: string) => void;
  onBlock: (userId: string) => void;
};

export const AdminUsersScreenView: React.FC<Props> = ({
  title,
  avatarInitial,
  query,
  sortMode,
  searchOptionsVisible,
  users,
  page,
  totalPages,
  onQueryChange,
  onBack,
  onToggleSearchOptions,
  onSetSortMode,
  onSetPage,
  onWrite,
  onBlock,
}) => {
  const { tokens } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => getStyles(tokens), [tokens]);

  return (
    <ScreenContainer scroll edges={['left', 'right']} contentContainerStyle={styles.content}>
      <HeaderBar
        title={title}
        onBack={onBack}
        showBack
        showMenu={false}
        showSearch={false}
        showAvatar
        avatarInitial={avatarInitial}
      />

      <AdminSearchMenu
        query={query}
        onQueryChange={onQueryChange}
        placeholder={t('admin.users.searchPlaceholder')}
        onSearchPress={onToggleSearchOptions}
        style={styles.searchBox}
      />

      <AdminSearchOptionsMenu
        visible={searchOptionsVisible}
        onClose={onToggleSearchOptions}
        style={styles.searchOverlay}
        options={[
          {
            id: 'city',
            label: t('admin.users.sortByCity'),
            selected: sortMode === 'city',
            onPress: () => {
              onSetSortMode('city');
              onToggleSearchOptions();
            },
          },
          {
            id: 'rating',
            label: t('admin.users.sortByRating'),
            selected: sortMode === 'rating',
            onPress: () => {
              onSetSortMode('rating');
              onToggleSearchOptions();
            },
          },
        ]}
      />

      <View style={styles.cards}>
        {users.map((item) => (
          <Card key={item.id} variant="outlined" style={styles.userCard}>
            <View style={styles.cardTopRow}>
              <Typography variant="h2" tone="primary" numberOfLines={1} style={styles.userName}>
                {item.name}
              </Typography>
              <View style={styles.ratingBadge}>
                <Typography variant="caption" tone="primary">
                  {item.rating}
                </Typography>
                <MaterialCommunityIcons name="star" size={s(14)} color={tokens.textPrimary} />
              </View>
            </View>

            <View style={styles.cityBadge}>
              <Typography variant="caption" tone="primary">
                {item.city}
              </Typography>
            </View>

            <Typography variant="body" tone="primary">
              {item.phone ?? '-'}
            </Typography>
            <Typography variant="body" tone="primary" numberOfLines={1}>
              {item.email}
            </Typography>

            <View style={styles.actionRow}>
              <Button
                title={t('admin.offers.write')}
                onPress={() => onWrite(item.id)}
                variant="ghost"
                size="small"
                style={styles.writeButton}
                textStyle={styles.writeButtonText}
              />
              <Button
                title={item.isBlocked ? t('admin.users.unblock') : t('admin.users.block')}
                onPress={() => onBlock(item.id)}
                variant="ghost"
                size="small"
                style={styles.blockButton}
                textStyle={styles.blockButtonText}
              />
            </View>
          </Card>
        ))}
      </View>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={onSetPage} maxVisible={5} />
    </ScreenContainer>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    content: {
      paddingTop: 0,
      paddingHorizontal: spacing.lg,
      paddingBottom: 0,
      gap: spacing.lg,
    },
    searchOverlay: {
      top: s(86),
      bottom: 0,
      left: 0,
      right: 0,
    },
    searchBox: {
      width: s(374),
      alignSelf: 'center',
    },
    cards: {
      gap: spacing.md,
    },
    userCard: {
      width: s(374),
      alignSelf: 'center',
      borderRadius: radius.xxl,
      borderColor: tokens.borderStrong,
      backgroundColor: tokens.bgScreen,
      gap: spacing.xs,
      overflow: 'hidden',
    },
    cardTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    userName: {
      flex: 1,
      marginRight: spacing.sm,
    },
    ratingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: tokens.bgCard,
      borderRadius: radius.xl,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },
    cityBadge: {
      alignSelf: 'flex-start',
      borderRadius: radius.xl,
      backgroundColor: tokens.bgPanel,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      marginBottom: spacing.xs,
    },
    actionRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
    writeButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: tokens.success,
      backgroundColor: tokens.bgScreen,
    },
    writeButtonText: {
      ...(typography.caption as object),
      color: tokens.success,
      textDecorationLine: 'underline',
    },
    blockButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: tokens.error,
      backgroundColor: tokens.bgScreen,
    },
    blockButtonText: {
      ...(typography.caption as object),
      color: tokens.error,
      textDecorationLine: 'underline',
    },
  });

export default AdminUsersScreenView;
