import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

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
  query: string;
  sortOrder: 'asc' | 'desc';
  filterMode: 'all' | 'blocked' | 'active';
  searchOptionsVisible: boolean;
  users: AdminUserCardItem[];
  page: number;
  totalPages: number;
  onQueryChange: (value: string) => void;
  onBack: () => void;
  onMenu: () => void;
  onToggleSearchOptions: () => void;
  onSetSortOrder: (mode: 'asc' | 'desc') => void;
  onSetFilterMode: (mode: 'all' | 'blocked' | 'active') => void;
  onSetPage: (page: number) => void;
  onWrite: (userId: string) => void;
  onBlock: (userId: string) => void;
};

export const AdminUsersScreenView: React.FC<Props> = ({
  title,
  query,
  sortOrder,
  filterMode,
  searchOptionsVisible,
  users,
  page,
  totalPages,
  onQueryChange,
  onBack,
  onMenu,
  onToggleSearchOptions,
  onSetSortOrder,
  onSetFilterMode,
  onSetPage,
  onWrite,
  onBlock,
}) => {
  const { tokens } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => getStyles(tokens), [tokens]);

  return (
    <ScreenContainer edges={['top', 'left', 'right']} style={styles.screen}>
      <HeaderBar
        title={title}
        onBack={onBack}
        onMenu={onMenu}
        showBack
        showMenu
        showSearch={false}
      />

      <View style={styles.content}>
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
              id: 'all',
              label: 'Всі користувачі',
              selected: filterMode === 'all',
              onPress: () => {
                onSetFilterMode('all');
                onToggleSearchOptions();
              },
            },
            {
              id: 'blocked',
              label: 'Тільки заблоковані',
              selected: filterMode === 'blocked',
              onPress: () => {
                onSetFilterMode('blocked');
                onToggleSearchOptions();
              },
            },
            {
              id: 'active',
              label: 'Тільки активні',
              selected: filterMode === 'active',
              onPress: () => {
                onSetFilterMode('active');
                onToggleSearchOptions();
              },
            },
            {
              id: 'asc',
              label: 'Сортування А-Я',
              selected: sortOrder === 'asc',
              onPress: () => {
                onSetSortOrder('asc');
                onToggleSearchOptions();
              },
            },
            {
              id: 'desc',
              label: 'Сортування Я-А',
              selected: sortOrder === 'desc',
              onPress: () => {
                onSetSortOrder('desc');
                onToggleSearchOptions();
              },
            },
          ]}
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
        </ScrollView>
      </View>
    </ScreenContainer>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingTop: spacing.md,
      paddingHorizontal: spacing.lg,
      paddingBottom: 0,
      gap: spacing.lg,
    },
    scrollContent: {
      gap: spacing.lg,
      paddingBottom: spacing.lg,
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
