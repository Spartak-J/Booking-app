import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { Animated, Easing } from 'react-native';

import HomeMenuSheet from '@/components/Home/HomeMenuSheet';
import { MENU_ITEMS } from '@/components/Home/homeNavigationData';
import LandmarksCityScreenView from '@/components/Landmarks/LandmarksCityScreenView';
import { useTranslation } from '@/i18n';
import { AppLayout } from '@/layout/AppLayout';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { Routes } from '@/navigation/routes';
import { landmarkService } from '@/services/landmarkService';
import { s } from '@/utils/scale';

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type ScreenRoute = RouteProp<RootStackParamList, Routes.LandmarksCity>;
const OVERLAY_ANIMATION_DURATION = 250;

export const LandmarksCityScreen = () => {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<ScreenRoute>();
  const { t } = useTranslation();

  const cityIdFromParams = route.params?.cityId;
  const cityNameFromParams = route.params?.cityName;

  const { data: city } = useQuery({
    queryKey: ['landmarks-city-guide-city', cityIdFromParams, cityNameFromParams],
    queryFn: async () => {
      const cityById = await landmarkService.findCityById(cityIdFromParams);
      if (cityById) return cityById;
      return landmarkService.findCityByName(cityNameFromParams);
    },
  });

  const { data: guide } = useQuery({
    queryKey: ['landmarks-city-guide', city?.id, cityIdFromParams],
    queryFn: () => landmarkService.getCityGuideByCityId(city?.id ?? cityIdFromParams),
  });

  const [searchMenuVisible, setSearchMenuVisible] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [guests, setGuests] = useState('2');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [calendarStart, setCalendarStart] = useState<number | null>(null);
  const [calendarEnd, setCalendarEnd] = useState<number | null>(null);
  const [displayMonth, setDisplayMonth] = useState({ month: 1, year: 2026 });
  const [menuOpen, setMenuOpen] = useState(false);
  const menuAnimation = useMemo(() => new Animated.Value(0), []);

  const cityName = city?.name ?? cityNameFromParams ?? '';
  const guestsValue = Number(guests);
  const parsedGuests =
    Number.isFinite(guestsValue) && guestsValue > 0 ? Math.floor(guestsValue) : undefined;
  const monthLabels = useMemo(() => t('calendar.months').split(','), [t]);
  const weekLabels = useMemo(() => t('calendar.weekdays').split(','), [t]);
  const monthLabel = `${monthLabels[displayMonth.month] ?? ''} ${displayMonth.year}`;

  const parseDateParts = (value?: string) => {
    if (!value) {
      return { day: null, month: null, year: null };
    }
    const parts = value.split('-');
    if (parts.length !== 3) {
      return { day: null, month: null, year: null };
    }
    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const day = Number(parts[2]);
    return {
      day: Number.isNaN(day) ? null : day,
      month: Number.isNaN(month) ? null : month,
      year: Number.isNaN(year) ? null : year,
    };
  };

  const padValue = (value: number) => String(value).padStart(2, '0');

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

  const openDatePicker = () => {
    const fromParts = parseDateParts(dateFrom);
    const toParts = parseDateParts(dateTo);
    const month = fromParts.month ?? toParts.month ?? displayMonth.month;
    const year = fromParts.year ?? toParts.year ?? displayMonth.year;
    setDisplayMonth({ month, year });
    setCalendarStart(fromParts.day ?? toParts.day ?? null);
    setCalendarEnd(toParts.day ?? null);
    setDatePickerVisible(true);
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
    setMenuOpen(true);
    menuAnimation.setValue(0);
    animateOverlay(menuAnimation, true);
  };

  const closeMenu = () => {
    animateOverlay(menuAnimation, false, () => setMenuOpen(false));
  };

  const changeMonth = (direction: number) => {
    setDisplayMonth((prev) => {
      let nextMonth = prev.month + direction;
      let nextYear = prev.year;
      if (nextMonth < 0) {
        nextMonth = 11;
        nextYear -= 1;
      } else if (nextMonth > 11) {
        nextMonth = 0;
        nextYear += 1;
      }
      return { month: nextMonth, year: nextYear };
    });
  };

  const isCalendarDayDisabled = (day: number) => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const candidate = new Date(displayMonth.year, displayMonth.month, day);
    return candidate < todayStart;
  };

  const selectCalendarDay = (day: number) => {
    if (isCalendarDayDisabled(day)) {
      return;
    }
    if (!calendarStart || calendarEnd) {
      setCalendarStart(day);
      setCalendarEnd(null);
      return;
    }
    setCalendarEnd(day);
  };

  const applyDateRange = () => {
    if (!calendarStart) {
      setDatePickerVisible(false);
      return;
    }
    const startDay = calendarEnd ? Math.min(calendarStart, calendarEnd) : calendarStart;
    const endDay = calendarEnd ? Math.max(calendarStart, calendarEnd) : calendarStart;
    const month = padValue(displayMonth.month + 1);
    const year = displayMonth.year;
    setDateFrom(`${year}-${month}-${padValue(startDay)}`);
    setDateTo(`${year}-${month}-${padValue(endDay)}`);
    setDatePickerVisible(false);
  };

  if (!guide) {
    return null;
  }

  return (
    <AppLayout variant="stack" header={false}>
      <LandmarksCityScreenView
        cityName={cityName}
        guide={guide}
        onBack={() => navigation.goBack()}
        onOpenMenu={openMenu}
        onFindStay={() => setSearchMenuVisible(true)}
        menuSheet={
          <HomeMenuSheet
            visible={menuOpen}
            onClose={closeMenu}
            animatedStyle={{
              opacity: menuAnimation,
              transform: [
                {
                  translateY: menuAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-s(64), 0],
                  }),
                },
              ],
            }}
            items={MENU_ITEMS}
          />
        }
        searchMenuVisible={searchMenuVisible}
        cityQuery={cityName}
        dateFrom={dateFrom}
        dateTo={dateTo}
        guests={guests}
        onGuestsChange={setGuests}
        datePickerVisible={datePickerVisible}
        monthLabel={monthLabel}
        weekLabels={weekLabels}
        calendarDays={calendarDays}
        calendarStart={calendarStart}
        calendarEnd={calendarEnd}
        isCalendarDayDisabled={isCalendarDayDisabled}
        onOpenDatePicker={openDatePicker}
        onCloseDatePicker={() => setDatePickerVisible(false)}
        onPrevMonth={() => changeMonth(-1)}
        onNextMonth={() => changeMonth(1)}
        onSelectDay={selectCalendarDay}
        onApplyDate={applyDateRange}
        onCloseSearchMenu={() => setSearchMenuVisible(false)}
        onSearchSubmit={() => {
          setSearchMenuVisible(false);
          navigation.navigate(Routes.SearchResults, {
            filters: {
              cityName,
              guests: parsedGuests,
              dates: dateFrom && dateTo ? { from: dateFrom, to: dateTo } : undefined,
              onlyActive: true,
            },
          });
        }}
      />
    </AppLayout>
  );
};

export default LandmarksCityScreen;
