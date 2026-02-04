// Component: HomeScreenView. Used in: HomeScreen.
import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { Animated, Easing, ImageBackground, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FiltersModal } from '@/components/FiltersModal';
import { PopularCities } from '@/components/Home/PopularCities';
import HomeCountries from '@/components/Home/HomeCountries';
import Recommendations from '@/components/Home/Recommendations';
import SpecialOffers from '@/components/Home/SpecialOffers';
import HomeHeader from '@/components/Home/HomeHeader';
import GuestBanner from '@/components/Home/GuestBanner';
import { cityService } from '@/services/cityService';
import { OfferFilters } from '@/services/offerService';
import { useTheme } from '@/theme';
import { useAuthStore } from '@/store/authStore';
import { s } from '@/utils/scale';
import HomeMenuSheet from '@/components/Home/HomeMenuSheet';
import {
  CITY_CARDS,
  COUNTRY_BUBBLES,
  OFFER_PROMOS,
  RECOMMENDATIONS,
} from '@/components/Home/homeData';
import { MENU_ITEMS } from '@/components/Home/homeNavigationData';
import HomeDatePickerModal from '@/components/Home/HomeDatePickerModal';
import HomeGuestsModal from '@/components/Home/HomeGuestsModal';
import { useHomeLabels } from '@/components/Home/useHomeLabels';
import entertainmentImage from '@/assets/images/entertainment.png';
import { useTranslation } from '@/i18n';

// TODO: move month labels to i18n resources.
const MONTH_LABELS = [
  'Січень',
  'Лютий',
  'Березень',
  'Квітень',
  'Травень',
  'Червень',
  'Липень',
  'Серпень',
  'Вересень',
  'Жовтень',
  'Листопад',
  'Грудень',
];

// TODO: move week labels to i18n resources.
const WEEK_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

const OVERLAY_ANIMATION_DURATION = 250;

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
  onOpenLandmarks: () => void;
};

export const HomeScreenView: React.FC<HomeScreenViewProps> = ({ onSearch, onOpenLandmarks }) => {
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
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const guestMode = useAuthStore((s) => s.guestMode);
  const leaveGuestMode = useAuthStore((s) => s.leaveGuestMode);
  const dateAnimation = useMemo(() => new Animated.Value(0), []);
  const guestAnimation = useMemo(() => new Animated.Value(0), []);
  const menuAnimation = useMemo(() => new Animated.Value(0), []);
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
  const isDark = colors.background === colors.bgDark;
  const palette = useMemo(() => getPalette(colors, isDark), [colors, isDark]);
  const styles = useMemo(() => getStyles(palette), [palette]);
  const contentStyle = useMemo(
    () => [styles.content, { paddingBottom: s(50) + insets.bottom }],
    [styles.content, insets.bottom],
  );
  const { data: cities } = useQuery({ queryKey: ['cities'], queryFn: cityService.getAll });

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
    if (!calendarStart || (calendarStart && calendarEnd)) {
      setCalendarStart(day);
      setCalendarEnd(null);
    } else {
      setCalendarEnd(day);
    }
  };

  const { heroDateLabel, heroGuestLabel, guestBorderColor, currentMonthLabel } = useHomeLabels({
    filters,
    keyword,
    displayMonth,
    monthLabels: MONTH_LABELS,
  });

  return (
    <View style={styles.screen}>
      <View style={styles.background}>
        <ImageBackground
          source={entertainmentImage}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={contentStyle}
          showsVerticalScrollIndicator={false}
        >
          <HomeHeader
            heroCityLabel={keyword}
            heroCityPlaceholder={t('home.placeholder')}
            onChangeCity={setKeyword}
            heroDateLabel={heroDateLabel}
            heroGuestLabel={heroGuestLabel}
            onOpenMenu={openMenu}
            onOpenDatePicker={openDatePicker}
            onOpenGuests={openGuestsModal}
            onSearch={() => onSearch({ ...filters, cityName: keyword || undefined })}
          />

          {guestMode && <GuestBanner onPress={leaveGuestMode} />}

          <PopularCities data={CITY_CARDS} />
          <Recommendations data={RECOMMENDATIONS} />
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
      </View>

      <HomeDatePickerModal
        visible={datePickerVisible}
        onClose={closeDatePicker}
        overlayOpacity={palette.overlayOpacity}
        sheetAnimatedStyle={dateSheetAnimatedStyle}
        monthLabel={currentMonthLabel}
        weekLabels={WEEK_LABELS}
        calendarDays={calendarDays}
        calendarStart={calendarStart}
        calendarEnd={calendarEnd}
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
  background: isDark
    ? (colors.bgDark ?? colors.background)
    : (colors.surfaceLightDarker ?? colors.background),
  transparent: colors.transparent,
  overlayOpacity: isDark ? 0.7 : 0.5,
  debugBg: colors.primary,
  debugText: colors.onPrimary ?? colors.surfaceLight,
});

const getStyles = (palette: ReturnType<typeof getPalette>) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: palette.background,
    },
    background: {
      flex: 1,
      backgroundColor: palette.background,
      width: '100%',
      height: '100%',
      position: 'relative',
    },
    backgroundImage: {
      ...StyleSheet.absoluteFillObject,
    },
    content: {
      gap: s(18),
      flexGrow: 1,
    },
    scroll: {
      flex: 1,
      zIndex: 1,
      position: 'relative',
    },
  });

export default HomeScreenView;
