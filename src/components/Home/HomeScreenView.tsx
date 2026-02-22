// Component: HomeScreenView. Used in: HomeScreen.
import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { Animated, Easing, Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { FiltersModal } from '@/components/FiltersModal';
import { PopularCities } from '@/components/Home/PopularCities';
import HomeCountries from '@/components/Home/HomeCountries';
import Recommendations from '@/components/Home/Recommendations';
import SpecialOffers from '@/components/Home/SpecialOffers';
import HomeHeader from '@/components/Home/HomeHeader';
import GuestBanner from '@/components/Home/GuestBanner';
import { cityService } from '@/services/cityService';
import { offerService, OfferFilters } from '@/services/offerService';
import { useTheme } from '@/theme';
import { useAuthStore } from '@/store/authStore';
import { s } from '@/utils/scale';
import HomeMenuSheet from '@/components/Home/HomeMenuSheet';
import { COUNTRY_BUBBLES, OFFER_PROMOS } from '@/components/Home/homeData';
import { MENU_ITEMS } from '@/components/Home/homeNavigationData';
import HomeDatePickerModal from '@/components/Home/HomeDatePickerModal';
import HomeGuestsModal from '@/components/Home/HomeGuestsModal';
import { useHomeLabels } from '@/components/Home/useHomeLabels';
import { useTranslation } from '@/i18n';
import { Button, ScreenContainer, Typography } from '@/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getLocalCityGuide } from '@/data/landmarks/cityGuide.local';
import type { CityCard } from '@/components/Home/types';
import type { RecommendationCard } from '@/components/Home/types';
import { mockOffers } from '@/utils/mockData';

const OVERLAY_ANIMATION_DURATION = 250;
const RECOMMENDED_CITY_NAMES = [
  'Львів',
  'Київ',
  'Одеса',
  'Яремче',
  'Ужгород',
  'Чернівці',
  'Івано-Франківськ',
  "Кам'янець-Подільський",
  'Луцьк',
  'Буковель',
] as const;

const animateOverlay = (anim: Animated.Value, open: boolean, onComplete?: () => void) => {
  Animated.timing(anim, {
    toValue: open ? 1 : 0,
    duration: OVERLAY_ANIMATION_DURATION,
    easing: Easing.out(Easing.ease),
    useNativeDriver: true,
  }).start(() => onComplete?.());
};

type HomeScreenViewProps = {
  onSearch: (filters: OfferFilters) => void;
  onOpenCity: (cityName: string) => void;
  onOpenLandmarks: () => void;
  onOpenOffer: (offerId: string) => void;
};

export const HomeScreenView: React.FC<HomeScreenViewProps> = ({
  onSearch,
  onOpenCity,
  onOpenLandmarks,
  onOpenOffer,
}) => {
  const [filters, setFilters] = useState<OfferFilters>({ onlyActive: true });
  // TODO: move default city label to i18n or data source.
  const [keyword, setKeyword] = useState('Львів');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [calendarStart, setCalendarStart] = useState<number | null>(null);
  const [calendarEnd, setCalendarEnd] = useState<number | null>(null);
  const [displayMonth, setDisplayMonth] = useState({ month: 0, year: 2026 });
  const [guestsModalOpen, setGuestsModalOpen] = useState(false);
  const [roomCount, setRoomCount] = useState(1);
  const [adultCount, setAdultCount] = useState(filters.guests ?? 2);
  const [childCount, setChildCount] = useState(0);
  const [petsEnabled, setPetsEnabled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCityInputFocused, setIsCityInputFocused] = useState(false);
  const { colors, resolvedMode } = useTheme();
  const { t } = useTranslation();
  const guestMode = useAuthStore((s) => s.guestMode);
  const leaveGuestMode = useAuthStore((s) => s.leaveGuestMode);
  const dateAnimation = useMemo(() => new Animated.Value(0), []);
  const guestAnimation = useMemo(() => new Animated.Value(0), []);
  const menuAnimation = useMemo(() => new Animated.Value(0), []);
  const insets = useSafeAreaInsets();
  const dateSheetAnimatedStyle = useMemo(
    () => ({
      opacity: dateAnimation,
      transform: [
        {
          translateY: dateAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [s(48), 0],
          }),
        },
      ],
    }),
    [dateAnimation],
  );
  const guestSheetAnimatedStyle = useMemo(
    () => ({
      opacity: guestAnimation,
      transform: [
        {
          translateY: guestAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [s(64), 0],
          }),
        },
      ],
    }),
    [guestAnimation],
  );
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
  const isDark = resolvedMode === 'dark';
  const palette = useMemo(() => getPalette(colors, isDark), [colors, isDark]);
  const styles = useMemo(() => getStyles(colors), [colors]);
  const contentStyle = useMemo(() => [styles.content], [styles.content]);
  const { data: cities } = useQuery({ queryKey: ['cities'], queryFn: cityService.getAll });
  const { data: recommendationOffers } = useQuery({
    queryKey: ['home-recommendation-offers'],
    queryFn: async () => {
      const { items } = await offerService.getAll({ onlyActive: true, sort: 'recommended' });
      return items;
    },
  });
  const popularCityCards = useMemo<CityCard[]>(() => {
    const apiCities = cities ?? [];
    return RECOMMENDED_CITY_NAMES.map((cityName) => {
      const backendCity = apiCities.find(
        (city) => city.name.trim().toLowerCase() === cityName.trim().toLowerCase(),
      );
      const guide = getLocalCityGuide({
        cityId: backendCity ? String(backendCity.id) : undefined,
        cityName,
      });
      return {
        id: String(backendCity?.id ?? guide.cityId ?? cityName),
        name: backendCity?.name ?? cityName,
        image: guide.heroImage,
      };
    });
  }, [cities]);
  const citySuggestions = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    if (query.length < 1) return [];

    const fromApi = (cities ?? []).map((city) => city.name).filter(Boolean);
    const uniqueNames = Array.from(new Set([...fromApi, ...RECOMMENDED_CITY_NAMES]));

    return uniqueNames.filter((name) => name.toLowerCase().includes(query)).slice(0, 8);
  }, [cities, keyword]);

  const fallbackRecommendationOffers = useMemo(() => {
    return mockOffers.slice(0, 8);
  }, []);

  const recommendationCards = useMemo<RecommendationCard[]>(() => {
    const source =
      (recommendationOffers ?? []).length > 0
        ? (recommendationOffers ?? [])
        : fallbackRecommendationOffers;

    return source.slice(0, 8).map((offer) => ({
      id: `recommendation-${offer.id}`,
      offerId: offer.id,
      name: offer.title,
      rating: offer.rating ? offer.rating.toFixed(1).replace('.', ',') : '0,0',
      maxGuests: offer.maxGuests ?? offer.guests,
      image: offer.images?.[0]
        ? { uri: offer.images[0] }
        : { uri: 'https://picsum.photos/seed/reco-fallback/400/700' },
    }));
  }, [fallbackRecommendationOffers, recommendationOffers]);

  const formatDayLabel = (value: number) => String(value).padStart(2, '0');

  const padMonthNumber = (value: number) => String(value + 1).padStart(2, '0');

  const parseDateParts = (value?: string) => {
    if (!value) {
      return { day: null, month: null };
    }
    if (value.includes('.')) {
      const [day, month] = value.split('.');
      const dayNumber = Number(day);
      const monthNumber = Number(month);
      return {
        day: Number.isNaN(dayNumber) ? null : dayNumber,
        month: Number.isNaN(monthNumber) ? null : monthNumber - 1,
      };
    }
    const parts = value.split('-');
    if (parts.length === 3) {
      const dayNumber = Number(parts[2]);
      const monthNumber = Number(parts[1]);
      return {
        day: Number.isNaN(dayNumber) ? null : dayNumber,
        month: Number.isNaN(monthNumber) ? null : monthNumber - 1,
      };
    }
    return { day: null, month: null };
  };

  const changeMonth = (direction: number) => {
    setDisplayMonth((prev) => {
      let nextMonth = prev.month + direction;
      let nextYear = prev.year;
      if (nextMonth < 0) {
        nextMonth = 11;
        nextYear -= 1;
      }
      if (nextMonth > 11) {
        nextMonth = 0;
        nextYear += 1;
      }
      return { month: nextMonth, year: nextYear };
    });
  };

  const adjustCount = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    delta: number,
    min = 0,
    max = 10,
  ) => {
    setter((prev) => {
      const next = prev + delta;
      if (next < min) return min;
      if (next > max) return max;
      return next;
    });
  };

  const closeDatePicker = (callback?: unknown) => {
    animateOverlay(dateAnimation, false, () => {
      setDatePickerVisible(false);
      if (typeof callback === 'function') {
        callback();
      }
    });
  };

  const openDatePicker = () => {
    const fromParts = parseDateParts(filters.dates?.from);
    const toParts = parseDateParts(filters.dates?.to);
    const month = fromParts.month ?? toParts.month ?? displayMonth.month;
    setDisplayMonth((prev) => ({ ...prev, month }));
    setCalendarStart(fromParts.day ?? toParts.day ?? 7);
    setCalendarEnd(toParts.day ?? fromParts.day ?? 12);
    setDatePickerVisible(true);
    dateAnimation.setValue(0);
    animateOverlay(dateAnimation, true);
  };

  const applyDateRange = () => {
    if (!calendarStart || !calendarEnd) {
      closeDatePicker();
      return;
    }
    const startDay = Math.min(calendarStart, calendarEnd);
    const endDay = Math.max(calendarStart, calendarEnd);
    const monthNumber = padMonthNumber(displayMonth.month);
    const from = `${formatDayLabel(startDay)}.${monthNumber}`;
    const to = `${formatDayLabel(endDay)}.${monthNumber}`;
    setFilters((prev) => ({ ...prev, dates: { from, to } }));
    closeDatePicker();
  };

  const closeGuestsModal = (callback?: unknown) => {
    animateOverlay(guestAnimation, false, () => {
      setGuestsModalOpen(false);
      if (typeof callback === 'function') {
        callback();
      }
    });
  };

  const openGuestsModal = () => {
    setAdultCount(filters.guests ?? adultCount ?? 2);
    setGuestsModalOpen(true);
    guestAnimation.setValue(0);
    animateOverlay(guestAnimation, true);
  };

  const applyGuestSelection = () => {
    const totalSelected = adultCount + childCount;
    setFilters((prev) => ({ ...prev, guests: totalSelected || 1 }));
    closeGuestsModal();
  };

  const closeMenu = () => {
    animateOverlay(menuAnimation, false, () => setMenuOpen(false));
  };

  const openMenu = () => {
    setMenuOpen(true);
    menuAnimation.setValue(0);
    animateOverlay(menuAnimation, true);
  };

  const calendarDays = useMemo(() => {
    const { month, year } = displayMonth;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekday = new Date(year, month, 1).getDay();
    const offset = (firstWeekday + 6) % 7;
    const totalCells = offset + daysInMonth;
    const trailing = (7 - (totalCells % 7)) % 7;
    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
      ...Array.from({ length: trailing }, () => null),
    ];
  }, [displayMonth]);

  const handleSelectDay = (day: number) => {
    if (isCalendarDayDisabled(day)) {
      return;
    }
    if (!calendarStart || (calendarStart && calendarEnd)) {
      setCalendarStart(day);
      setCalendarEnd(null);
    } else {
      setCalendarEnd(day);
    }
  };

  const isCalendarDayDisabled = (day: number) => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const candidate = new Date(displayMonth.year, displayMonth.month, day);
    return candidate < todayStart;
  };

  const monthLabels = useMemo(() => t('calendar.months').split(','), [t]);
  const weekLabels = useMemo(() => t('calendar.weekdays').split(','), [t]);

  const { heroDateLabel, heroGuestLabel, guestBorderColor, currentMonthLabel } = useHomeLabels({
    filters,
    keyword,
    displayMonth,
    monthLabels,
  });

  return (
    <View style={styles.screen}>
      <ScreenContainer
        style={styles.scroll}
        edges={['left', 'right']}
        withKeyboardAvoiding={false}
        contentContainerStyle={styles.containerContent}
      >
        <HomeHeader
          heroCityLabel={keyword}
          heroCityPlaceholder={t('home.placeholder')}
          onChangeCity={setKeyword}
          onCityFocus={() => setIsCityInputFocused(true)}
          onCityBlur={() => setIsCityInputFocused(false)}
          heroDateLabel={heroDateLabel}
          heroGuestLabel={heroGuestLabel}
          onOpenMenu={openMenu}
          onOpenDatePicker={openDatePicker}
          onOpenGuests={openGuestsModal}
          onSearch={() => onSearch({ ...filters, cityName: keyword || undefined })}
          topInset={insets.top}
          heroHeight={s(132) + insets.top}
        />
        {isCityInputFocused && citySuggestions.length > 0 ? (
          <View style={styles.suggestionsWrap}>
            {citySuggestions.map((name, index) => (
              <Button
                key={name}
                variant="ghost"
                style={[
                  styles.suggestionItem,
                  index === citySuggestions.length - 1 ? styles.suggestionItemLast : null,
                ]}
                onPress={() => {
                  setKeyword(name);
                  setIsCityInputFocused(false);
                  Keyboard.dismiss();
                }}
              >
                <Typography variant="body" tone="primary">
                  {name}
                </Typography>
              </Button>
            ))}
          </View>
        ) : null}

        <ScrollView style={styles.bodyScroll} contentContainerStyle={contentStyle}>
          {guestMode && <GuestBanner onPress={leaveGuestMode} />}

          <PopularCities data={popularCityCards} onOpenCity={onOpenCity} />
          <Recommendations data={recommendationCards} onOpenOffer={onOpenOffer} />
          <SpecialOffers
            data={OFFER_PROMOS}
            onPress={(id) => {
              if (id === 'landmarks') {
                onOpenLandmarks();
              }
            }}
          />

          <HomeCountries data={COUNTRY_BUBBLES} />
        </ScrollView>
      </ScreenContainer>

      <HomeDatePickerModal
        visible={datePickerVisible}
        onClose={closeDatePicker}
        overlayOpacity={palette.overlayOpacity}
        sheetAnimatedStyle={dateSheetAnimatedStyle}
        monthLabel={currentMonthLabel}
        weekLabels={weekLabels}
        calendarDays={calendarDays}
        calendarStart={calendarStart}
        calendarEnd={calendarEnd}
        isDayDisabled={isCalendarDayDisabled}
        onPrevMonth={() => changeMonth(-1)}
        onNextMonth={() => changeMonth(1)}
        onSelectDay={handleSelectDay}
        onApply={applyDateRange}
      />

      <HomeGuestsModal
        visible={guestsModalOpen}
        onClose={closeGuestsModal}
        overlayOpacity={palette.overlayOpacity}
        sheetAnimatedStyle={guestSheetAnimatedStyle}
        roomCount={roomCount}
        adultCount={adultCount}
        childCount={childCount}
        guestBorderColor={guestBorderColor}
        petsEnabled={petsEnabled}
        onTogglePets={() => setPetsEnabled((prev) => !prev)}
        onAdjustRoom={(delta) => adjustCount(setRoomCount, delta, 1)}
        onAdjustAdult={(delta) => adjustCount(setAdultCount, delta, 1)}
        onAdjustChild={(delta) => adjustCount(setChildCount, delta, 0)}
        onApply={applyGuestSelection}
      />

      <FiltersModal
        visible={filtersOpen}
        initialFilters={filters}
        onClose={() => setFiltersOpen(false)}
        onApply={(next) => setFilters((prev) => ({ ...prev, ...next }))}
        cities={cities}
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

const getPalette = (colors: any, isDark: boolean) => ({
  transparent: colors.transparent,
  overlayOpacity: isDark ? 0.7 : 0.5,
});

const getStyles = (colors: Record<string, string>) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    content: {
      gap: s(18),
      flexGrow: 1,
    },
    suggestionsWrap: {
      marginTop: -s(6),
      marginHorizontal: s(20),
      borderRadius: s(14),
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.bgPanel,
      overflow: 'hidden',
    },
    suggestionItem: {
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      borderRadius: 0,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.transparent,
      paddingVertical: s(10),
      paddingHorizontal: s(14),
    },
    suggestionItemLast: {
      borderBottomWidth: 0,
    },
    scroll: {
      flex: 1,
    },
    containerContent: {
      flex: 1,
    },
    bodyScroll: { flex: 1 },
  });

export default HomeScreenView;
