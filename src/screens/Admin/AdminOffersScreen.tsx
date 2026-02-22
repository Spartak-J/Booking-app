import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, ImageBackground, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Card, HeaderBar, IconButton, Pagination, Typography } from '@/ui';
import { useTranslation } from '@/i18n';
import { fonts, radius, spacing, useTheme } from '@/theme';
import { offersAdminService, type AdminOffer } from '@/services/admin';
import { AppLayout } from '@/layout/AppLayout';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { Routes } from '@/navigation/routes';
import { s } from '@/utils/scale';
import { getHotelImageSource } from '@/data/hotels/hotelImages.mock';
import AdminSearchMenu from '@/components/Admin/AdminSearchMenu';
import AdminSearchOptionsMenu from '@/components/Admin/AdminSearchOptionsMenu';
import { useAuth } from '@/hooks/useAuth';

const PAGE_SIZE = 6;
type SortOrder = 'asc' | 'desc';

const formatRating = (value: number) => value.toFixed(1).replace('.', ',');
const normalizePhone = (value?: string) => (value ?? '').replace(/[^\d+]/g, '').toLowerCase();

const matchesOfferQuery = (hotel: AdminOffer, query: string) => {
  if (!query) return true;

  const normalizedQuery = query.trim().toLowerCase();
  const phoneQuery = query
    .trim()
    .replace(/[^\d+]/g, '')
    .toLowerCase();
  const ownerEmail = (hotel.owner?.email ?? '').toLowerCase();

  return (
    hotel.name.toLowerCase().includes(normalizedQuery) ||
    ownerEmail.includes(normalizedQuery) ||
    normalizePhone(hotel.owner?.phone).includes(phoneQuery) ||
    (hotel.owner?.phone ?? '').toLowerCase().includes(normalizedQuery)
  );
};

const AdminOffersScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const { user } = useAuth();

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [searchOptionsVisible, setSearchOptionsVisible] = useState(false);
  const [offers, setOffers] = useState<AdminOffer[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const items = await offersAdminService.getAll();
      if (mounted) setOffers(items);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = offers.filter((hotel) => matchesOfferQuery(hotel, normalizedQuery));
    return filtered.sort((lhs, rhs) => {
      const cmp = lhs.name.toLowerCase().localeCompare(rhs.name.toLowerCase(), 'uk');
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [offers, query, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const items = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, currentPage]);

  const styles = useMemo(() => getStyles(tokens), [tokens]);

  return (
    <AppLayout variant="stack" header={false} edges={['top', 'left', 'right']}>
      <View style={styles.screen}>
        <HeaderBar
          title={t('admin.offers.title')}
          onBack={() => navigation.goBack()}
          showBack
          showMenu={false}
          showSearch={false}
          showAvatar
          avatarInitial={(user?.name ?? 'A').charAt(0).toUpperCase()}
        />

        <View style={styles.searchRow}>
          <AdminSearchMenu
            query={query}
            onQueryChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
            placeholder={t('admin.offers.searchPlaceholder')}
            onSearchPress={() => setSearchOptionsVisible((prev) => !prev)}
            style={styles.searchBox}
          />
        </View>

        <View style={styles.sortRow}>
          <IconButton
            onPress={() => {
              setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
              setPage(1);
            }}
            variant="ghost"
            style={styles.sortIconButton}
            icon={
              <MaterialCommunityIcons
                name={
                  sortOrder === 'asc'
                    ? 'sort-alphabetical-ascending'
                    : 'sort-alphabetical-descending'
                }
                size={s(24)}
                color={tokens.textPrimary}
              />
            }
          />
        </View>

        <AdminSearchOptionsMenu
          visible={searchOptionsVisible}
          onClose={() => setSearchOptionsVisible(false)}
          style={styles.searchOverlay}
          options={[
            {
              id: 'asc',
              label: t('admin.offers.sortAsc'),
              selected: sortOrder === 'asc',
              onPress: () => {
                setSortOrder('asc');
                setPage(1);
                setSearchOptionsVisible(false);
              },
            },
            {
              id: 'desc',
              label: t('admin.offers.sortDesc'),
              selected: sortOrder === 'desc',
              onPress: () => {
                setSortOrder('desc');
                setPage(1);
                setSearchOptionsVisible(false);
              },
            },
          ]}
        />

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            return (
              <Card
                variant="filled"
                style={styles.card}
                onPress={() => navigation.navigate(Routes.AdminOfferDetails, { offerId: item.id })}
              >
                <ImageBackground
                  source={getHotelImageSource(item)}
                  style={styles.image}
                  imageStyle={styles.imageStyle}
                >
                  <View style={styles.ratingBadge}>
                    <Typography variant="subtitle" tone="primary" style={styles.ratingText}>
                      {formatRating(item.rating)}
                    </Typography>
                    <MaterialCommunityIcons name="star" size={s(14)} color={tokens.textPrimary} />
                  </View>
                </ImageBackground>

                <View style={styles.cardBody}>
                  <Typography
                    variant="h2"
                    tone="primary"
                    numberOfLines={3}
                    style={styles.hotelTitle}
                  >
                    {item.name}
                  </Typography>
                  <Typography variant="subtitle" tone="primary" numberOfLines={1}>
                    {item.city}
                  </Typography>
                  <Typography variant="subtitle" tone="primary" numberOfLines={1}>
                    {item.owner?.phone ?? '-'}
                  </Typography>
                  <Typography variant="subtitle" tone="primary" numberOfLines={1}>
                    {item.owner?.email ?? '-'}
                  </Typography>
                </View>
              </Card>
            );
          }}
          ListFooterComponent={
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              maxVisible={5}
              style={styles.pagination}
            />
          }
        />
      </View>
    </AppLayout>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: spacing.sm,
      paddingBottom: spacing.sm,
      zIndex: 5,
    },
    searchBox: {
      width: s(374),
    },
    sortRow: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.sm,
    },
    sortIconButton: {
      width: s(56),
      height: s(56),
      borderRadius: radius.xl,
      backgroundColor: tokens.bgPanel,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 0,
    },
    searchOverlay: {
      top: s(150),
      bottom: 0,
      left: 0,
      right: 0,
    },
    list: {
      paddingHorizontal: 0,
      paddingBottom: 0,
      paddingTop: spacing.xs,
      gap: spacing.md,
    },
    card: {
      width: s(374),
      height: s(195),
      alignSelf: 'center',
      padding: spacing.md,
      borderRadius: radius.xxl,
      backgroundColor: tokens.bgScreen,
      borderWidth: 1,
      borderColor: tokens.borderStrong,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    image: {
      width: s(175),
      height: s(160),
      borderRadius: radius.xxl,
      overflow: 'hidden',
    },
    imageStyle: {
      resizeMode: 'cover',
      borderRadius: radius.xxl,
    },
    ratingBadge: {
      margin: spacing.sm,
      backgroundColor: tokens.bgScreen,
      borderRadius: radius.round,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      alignSelf: 'flex-start',
    },
    ratingText: {
      minWidth: s(34),
      textAlign: 'center',
    },
    cardBody: {
      flex: 1,
      justifyContent: 'center',
      gap: spacing.sm,
    },
    hotelTitle: {
      fontFamily: fonts.MontserratAlternatesBold,
    },
    pagination: {
      marginTop: spacing.md,
      marginBottom: 0,
      alignSelf: 'center',
    },
  });

export default AdminOffersScreen;
