// Component: SearchResultsScreenView. Used in: SearchResultsScreen.
import React, { useMemo, useState } from 'react';
import { Animated, Easing, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { FiltersModal } from '@/components/FiltersModal';
import { OfferCard } from '@/components/OfferCard';
import { SortSheet } from '@/components/SortSheet';
import HomeMenuSheet from '@/components/Home/HomeMenuSheet';
import { MENU_ITEMS } from '@/components/Home/homeNavigationData';
import { SearchWindow } from '@/components/Search/SearchWindow';
import { OfferFilters } from '@/services/offerService';
import { Offer, City, PaginatedResponse } from '@/types';
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';
import { useAuthStore } from '@/store/authStore';
import { Button, HeaderBar, Modal, Pagination, Typography } from '@/ui';
import { radius } from '@/theme';
import { s } from '@/utils/scale';

const OVERLAY_ANIMATION_DURATION = 250;

type SearchResultsScreenViewProps = {
  filters: OfferFilters;
  setFilters: React.Dispatch<React.SetStateAction<OfferFilters>>;
  cities?: City[];
  data?: PaginatedResponse<Offer>;
  isLoading: boolean;
  isFetching: boolean;
  onRefresh: () => void;
  onBack: () => void;
  onPressOffer: (offer: Offer) => void;
};

export const SearchResultsScreenView: React.FC<SearchResultsScreenViewProps> = ({
  filters,
  setFilters,
  cities,
  data,
  isLoading,
  isFetching,
  onRefresh,
  onBack,
  onPressOffer,
}) => {
  const { colors, mode } = useTheme();
  const isDark = mode === 'dark';
  const palette = useMemo(() => getPalette(colors, isDark), [colors, isDark]);
  const styles = useMemo(() => getStyles(palette), [palette]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { t } = useTranslation();
  const guestMode = useAuthStore((s) => s.guestMode);
  const leaveGuestMode = useAuthStore((s) => s.leaveGuestMode);
  const menuAnimation = useMemo(() => new Animated.Value(0), []);
  const menuSheetAnimatedStyle = useMemo(
    () => ({
      opacity: menuAnimation,
      transform: [
        {
          translateY: menuAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [-s(64), 0],
          }),
        },
      ],
    }),
    [menuAnimation],
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalItems = data?.items?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return (data?.items ?? []).slice(start, start + pageSize);
  }, [data?.items, currentPage]);

  const applyFilters = (next: OfferFilters) => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, ...next }));
  };

  const onSortChange = (sort?: OfferFilters['sort']) => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, sort }));
  };

  const openFilters = () => {
    setSortOpen(false);
    setFiltersOpen(true);
  };

  const animateOverlay = (anim: Animated.Value, open: boolean, onComplete?: () => void) => {
    Animated.timing(anim, {
      toValue: open ? 1 : 0,
      duration: OVERLAY_ANIMATION_DURATION,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => onComplete?.());
  };

  const openMenu = () => {
    setSortOpen(false);
    setFiltersOpen(false);
    setSearchOpen(false);
    setMenuOpen(true);
    menuAnimation.setValue(0);
    animateOverlay(menuAnimation, true);
  };

  const closeMenu = () => {
    animateOverlay(menuAnimation, false, () => setMenuOpen(false));
  };

  const openSearchWindow = () => {
    setSortOpen(false);
    setFiltersOpen(false);
    setMenuOpen(false);
    setSearchOpen(true);
  };

  const closeSearchWindow = () => setSearchOpen(false);

  const formatDateLabel = (value?: string) => {
    if (!value) return '';
    if (value.includes('.')) return value;
    const parts = value.split('-');
    if (parts.length === 3) return `${parts[2]}.${parts[1]}`;
    return value;
  };

  const cityLabel = filters.cityName ?? t('common.city');
  const dateLabel =
    filters.dates?.from && filters.dates?.to
      ? `${formatDateLabel(filters.dates.from)}-${formatDateLabel(filters.dates.to)}`
      : t('common.date');
  const guestsLabel = filters.guests
    ? `${filters.guests} ${t('bookings.guests')}`
    : t('common.guestsLabel');

  return (
    <View style={styles.screen}>
      <HeaderBar
        onBack={onBack}
        onSearch={openSearchWindow}
        onMenu={openMenu}
        style={styles.headerBar}
        backStyle={styles.headerBack}
        searchStyle={styles.headerSearch}
        menuStyle={styles.headerMenu}
      />

      {guestMode && (
        <Button variant="ghost" style={styles.guestBanner} onPress={leaveGuestMode}>
          <View style={styles.guestContent}>
            <Typography variant="body" tone="primary">
              {t('auth.guestBanner')}
            </Typography>
            <Typography variant="caption" tone="accent">
              {t('auth.guestBannerCta')}
            </Typography>
          </View>
        </Button>
      )}

      <View style={styles.actionRow}>
        <Button
          variant="ghost"
          style={[styles.actionButton, styles.actionButtonSmall]}
          onPress={openFilters}
        >
          <View style={styles.actionContent}>
            <MaterialCommunityIcons name="filter-variant" size={s(18)} color={palette.actionIcon} />
            <Typography variant="searchChip" style={styles.actionText}>
              {t('home.filters')}
            </Typography>
          </View>
        </Button>
        <Button
          variant="ghost"
          style={[styles.actionButton, styles.actionButtonLarge]}
          onPress={() => setSortOpen((prev) => !prev)}
        >
          <View style={styles.actionContent}>
            <MaterialCommunityIcons
              name="sort-descending"
              size={s(18)}
              color={palette.actionIcon}
            />
            <Typography variant="searchChip" style={styles.actionText}>
              {t('home.sort')}
            </Typography>
          </View>
        </Button>
      </View>

      <Modal
        visible={sortOpen}
        onClose={() => setSortOpen(false)}
        variant="sheet"
        position="bottom"
        overlayOpacity={isDark ? 0.6 : 0.4}
        contentStyle={styles.sortModalContent}
      >
        <SortSheet
          value={filters.sort}
          onChange={(next) => {
            onSortChange(next);
            setSortOpen(false);
          }}
        />
      </Modal>

      <FlatList
        data={pagedItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <OfferCard offer={item} onPress={() => onPressOffer(item)} />
          </View>
        )}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            maxVisible={5}
            style={styles.pagination}
          />
        }
        refreshControl={
          <RefreshControl refreshing={isFetching && !isLoading} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Typography variant="caption" tone="secondary" style={styles.empty}>
            {isLoading ? t('bookings.loading') : t('home.empty')}
          </Typography>
        }
      />

      <FiltersModal
        visible={filtersOpen}
        initialFilters={filters}
        onClose={() => {
          setFiltersOpen(false);
          setSortOpen(false);
        }}
        onApply={applyFilters}
        cities={cities}
      />

      <SearchWindow
        visible={searchOpen}
        onClose={closeSearchWindow}
        cityLabel={cityLabel}
        dateLabel={dateLabel}
        guestsLabel={guestsLabel}
        onApply={closeSearchWindow}
      />

      <HomeMenuSheet
        visible={menuOpen}
        onClose={closeMenu}
        animatedStyle={menuSheetAnimatedStyle}
        items={MENU_ITEMS}
      />
    </View>
  );
};

const getPalette = (colors: Record<string, string>, isDark: boolean) => ({
  background: isDark
    ? (colors.bgDark ?? colors.background)
    : (colors.surfaceLight ?? colors.background),
  headerBg: isDark
    ? (colors.bgDark ?? colors.background)
    : (colors.surfaceLight ?? colors.background),
  chipBg: isDark
    ? (colors.bgDark ?? colors.surface)
    : (colors.surfaceLightDarker ?? colors.surface),
  icon: isDark ? (colors.surfaceLight ?? colors.onPrimary) : (colors.textPrimary ?? colors.text),
  headerIcon: isDark
    ? (colors.surfaceLight ?? colors.onPrimary)
    : (colors.textPrimary ?? colors.text),
  actionIcon: isDark
    ? (colors.surfaceLight ?? colors.onPrimary)
    : (colors.textPrimary ?? colors.text),
  actionText: isDark
    ? (colors.surfaceLight ?? colors.onPrimary)
    : (colors.textPrimary ?? colors.text),
  actionBg: isDark ? colors.bgDark : colors.surfaceWarm,
  border: colors.border,
  paginationText: isDark
    ? (colors.surfaceLight ?? colors.onPrimary)
    : (colors.textPrimary ?? colors.text),
  paginationActiveText: isDark
    ? (colors.bgDark ?? colors.text)
    : (colors.surfaceLight ?? colors.onPrimary),
  paginationActiveBg: isDark
    ? (colors.surfaceLight ?? colors.onPrimary)
    : (colors.textPrimary ?? colors.bgDark ?? colors.text),
});

const getStyles = (palette: ReturnType<typeof getPalette>) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: palette.background,
    },
    headerBar: {
      height: s(36),
      backgroundColor: palette.headerBg,
      zIndex: 3,
    },
    headerBack: {
      position: 'absolute',
      left: s(20),
      top: s(2),
      width: s(32),
      height: s(32),
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerSearch: {
      position: 'absolute',
      right: s(60),
      top: s(2),
      width: s(32),
      height: s(32),
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerMenu: {
      position: 'absolute',
      right: s(20),
      top: s(2),
      width: s(32),
      height: s(32),
      alignItems: 'center',
      justifyContent: 'center',
    },
    guestBanner: {
      backgroundColor: palette.headerBg,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: palette.border,
      paddingVertical: s(10),
      paddingHorizontal: s(14),
      marginTop: s(12),
      marginHorizontal: s(20),
    },
    guestContent: {
      gap: s(4),
    },
    actionRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: s(16),
      marginTop: s(6),
      marginBottom: s(10),
    },
    actionButton: {
      height: s(28),
      paddingHorizontal: s(10),
      paddingVertical: s(5),
      borderRadius: radius.xl,
      backgroundColor: palette.actionBg,
    },
    actionButtonSmall: {
      width: s(101),
    },
    actionButtonLarge: {
      width: s(136),
    },
    actionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(6),
    },
    actionText: {
      color: palette.actionText,
    },
    sortModalContent: {
      padding: 0,
      backgroundColor: 'transparent',
    },
    list: {
      paddingTop: s(8),
      alignItems: 'center',
    },
    cardWrap: {
      width: s(371),
    },
    empty: {
      textAlign: 'center',
      paddingVertical: s(20),
    },
    pagination: {
      marginTop: s(16),
      marginBottom: s(18),
      width: s(307),
      height: s(39),
      borderRadius: radius.xl,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      alignSelf: 'center',
      paddingHorizontal: s(6),
    },
  });

export default SearchResultsScreenView;
