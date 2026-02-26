// Screen: OwnerBookingsScreen. Owner view of bookings for their listings.
import React, { useMemo, useState } from 'react';
import { FlatList, Image, RefreshControl, StyleSheet, View } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AppLayout } from '@/layout/AppLayout';
import type { MainTabParamList, RootStackParamList } from '@/navigation/RootNavigator';
import { useAuthStore } from '@/store/authStore';
import { ownerBookingsService } from '@/services/owner';
import { HotelsRepository } from '@/data/hotels';
import { mockOffers } from '@/utils/mockData';
import { formatDateRange } from '@/utils/date';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/theme';
import { ScreenShell, Loader, Typography, Input } from '@/ui';
import { spacing } from '@/theme';
import OwnerBookingCard from '@/components/Owner/OwnerBookingCard';
import HomeDatePickerModal from '@/components/Home/HomeDatePickerModal';
import { BookingsTabs } from '@/components/Bookings/BookingsTabs';
import noBookingBlackImage from '@/assets/images/nobooking_black.png';
import noBookingWhiteImage from '@/assets/images/nobooking_white.png';
import { s } from '@/utils/scale';

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type TabRoute = RouteProp<MainTabParamList, 'Bookings'>;

type BookingView = {
  id: string;
  dateRange: string;
  checkIn: string;
  guestsLabel: string;
  roomTypeLabel?: string;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  note?: string;
  status: 'active' | 'cancelled' | 'completed';
};
type TabKey = 'active' | 'past' | 'cancelled';

const makeGuestNote = (bookingId: string) =>
  bookingId.endsWith('1')
    ? 'У зв’язку зі складною ситуацією зі світлом, чи є у вас генератор або альтернатива?'
    : 'Будемо о 15:00, потрібен код від дверей.';

const extractNotePart = (note: string | undefined, key: string): string | undefined => {
  if (!note) return undefined;
  const match = note.match(new RegExp(`${key}:\\s*([^|]+)`));
  return match?.[1]?.trim();
};

const resolveVisualStatus = (
  status: 'active' | 'pending' | 'cancelled' | 'completed',
  checkIn: string,
): 'active' | 'completed' | 'cancelled' => {
  if (status === 'cancelled') return 'cancelled';
  if (status === 'completed') return 'completed';

  const checkInDate = new Date(checkIn);
  const now = new Date();

  if (!Number.isNaN(checkInDate.getTime()) && checkInDate >= now) {
    return 'active';
  }

  if (status === 'active') return 'active';
  return 'completed';
};

export const OwnerBookingsScreen = () => {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<TabRoute>();
  const owner = useAuthStore((state) => state.user);
  const { t } = useTranslation();
  const { tokens, mode } = useTheme();
  const isDark = mode === 'dark';
  const queryClient = useQueryClient();
  const rootState = navigation.getState();
  const mainRoute = rootState.routes.find((item) => item.name === 'Main');
  const mainRouteParams = (
    mainRoute as { params?: { screen?: string; params?: { offerId?: string } } } | undefined
  )?.params;
  const selectedOfferId =
    route.params?.offerId ??
    (mainRouteParams?.screen === 'Bookings' ? mainRouteParams?.params?.offerId : undefined);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{ from?: string; to?: string }>({});
  const [calendarStart, setCalendarStart] = useState<number | null>(null);
  const [calendarEnd, setCalendarEnd] = useState<number | null>(null);
  const [displayMonth, setDisplayMonth] = useState(() => {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
  });
  const [collapsedIds, setCollapsedIds] = useState<string[]>([]);
  const [tab, setTab] = useState<TabKey>('active');

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

  const monthLabels = useMemo(() => t('calendar.months').split(','), [t]);
  const weekLabels = useMemo(() => t('calendar.weekdays').split(','), [t]);
  const monthLabel = `${monthLabels[displayMonth.month] ?? ''} ${displayMonth.year}`;

  const dateFilterLabel = useMemo(() => {
    if (selectedRange.from && selectedRange.to) {
      return formatDateRange(selectedRange.from, selectedRange.to);
    }
    return '';
  }, [selectedRange.from, selectedRange.to]);
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
    const fromParts = parseDateParts(selectedRange.from);
    const toParts = parseDateParts(selectedRange.to);
    const month = fromParts.month ?? toParts.month ?? displayMonth.month;
    const year = fromParts.year ?? toParts.year ?? displayMonth.year;
    setDisplayMonth({ month, year });
    setCalendarStart(fromParts.day ?? toParts.day ?? null);
    setCalendarEnd(toParts.day ?? null);
    setDatePickerVisible(true);
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

  const selectCalendarDay = (day: number) => {
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
    setSelectedRange({
      from: `${year}-${month}-${padValue(startDay)}`,
      to: `${year}-${month}-${padValue(endDay)}`,
    });
    setDatePickerVisible(false);
  };

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['owner-bookings', owner?.id, selectedOfferId, selectedRange.from, selectedRange.to],
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnReconnect: true,
    queryFn: async () => {
      const [{ items }, hotels] = await Promise.all([
        ownerBookingsService.getOwnerBookings(owner?.id ?? 'owner-1', {
          ...selectedRange,
          offerId: selectedOfferId,
        }),
        HotelsRepository.getAll(),
      ]);
      return { items, hotels };
    },
  });

  const bookings: BookingView[] = useMemo(() => {
    const items = data?.items ?? [];
    const hotels = data?.hotels ?? [];
    return items
      .map((item) => {
        const offer = mockOffers.find((o) => o.id === item.offerId);
        const hotel = hotels.find((h) => h.id === item.hotelId);
        void hotel;
        const dateRange = formatDateRange(item.checkIn, item.checkOut);
        const guestsLabel = `${item.guests} ${t('owner.bookings.guestsShort')}`;
        const roomTypeLabel = offer?.type ? t(`owner.form.type.${offer.type}` as any) : undefined;
        const guestName = [item.mainGuestFirstName, item.mainGuestLastName]
          .filter(Boolean)
          .join(' ')
          .trim() || undefined;
        const guestPhone = item.clientPhoneNumber ?? extractNotePart(item.clientNote, 'Phone');
        const guestEmail = item.clientEmail ?? extractNotePart(item.clientNote, 'Email');
        const note = item.clientNote?.trim() || makeGuestNote(item.orderId);
        return {
          id: item.orderId,
          dateRange,
          checkIn: item.checkIn,
          guestsLabel,
          roomTypeLabel,
          guestName,
          guestPhone,
          guestEmail,
          note,
          status: resolveVisualStatus(item.status, item.checkIn),
        };
      })
      .sort((a, b) => (a.dateRange > b.dateRange ? -1 : 1));
  }, [data?.items, data?.hotels, t]);

  const toggle = (id: string) => {
    setCollapsedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };
  const styles = useMemo(() => getStyles(tokens), [tokens]);
  const tabBookings = useMemo(() => {
    if (tab === 'active') return bookings.filter((item) => item.status === 'active');
    if (tab === 'past') return bookings.filter((item) => item.status === 'completed');
    return bookings.filter((item) => item.status === 'cancelled');
  }, [bookings, tab]);
  const isEmpty = !isLoading && tabBookings.length === 0;
  const emptyText = tab === 'active'
    ? selectedOfferId
      ? t('owner.bookings.emptyForObject')
      : t('owner.bookings.empty')
    : tab === 'past'
      ? t('bookings.emptyPast')
      : t('bookings.emptyCancelled');

  return (
    <AppLayout variant="tab" header={false}>
      <ScreenShell
        title={t('owner.tabs.bookings')}
        titleBold
        onBack={() => navigation.goBack()}
        contentStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
      >
        {isLoading ? (
          <Loader variant="skeleton" height={140} />
        ) : isEmpty ? (
          <View style={styles.emptyState}>
            <Image
              source={isDark ? noBookingWhiteImage : noBookingBlackImage}
              style={styles.emptyImage}
            />
            <Typography variant="body" tone="secondary" style={styles.emptyText}>
              {emptyText}
            </Typography>
          </View>
        ) : (
          <>
            <BookingsTabs
              value={tab}
              onChange={setTab}
              colors={{
                text: tokens.textPrimary,
                border: tokens.borderStrong,
                accent: tokens.accent,
              }}
            />
            <Input
              value={dateFilterLabel}
              placeholder={t('common.date')}
              editable={false}
              onPressIn={openDatePicker}
              showSoftInputOnFocus={false}
              caretHidden
              rightSlot={
                <MaterialCommunityIcons name="magnify" size={18} color={tokens.textPrimary} />
              }
              onRightSlotPress={openDatePicker}
              containerStyle={{ marginBottom: spacing.sm }}
            />
            <FlatList
              data={tabBookings}
              contentContainerStyle={styles.listContent}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <OwnerBookingCard
                  {...item}
                  expanded={!collapsedIds.includes(item.id)}
                  onToggle={toggle}
                  noteTitle={t('owner.bookings.wishes')}
                  themeMode={mode}
                />
              )}
              ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
              refreshControl={
                <RefreshControl
                  refreshing={isRefetching}
                  onRefresh={() => {
                    queryClient.invalidateQueries({ queryKey: ['owner-bookings', owner?.id] });
                    refetch();
                  }}
                  tintColor={tokens.accent}
                />
              }
            />
          </>
        )}
        <HomeDatePickerModal
          visible={datePickerVisible}
          onClose={() => setDatePickerVisible(false)}
          overlayOpacity={0.45}
          sheetAnimatedStyle={{ opacity: 1, transform: [{ translateY: 0 }] }}
          monthLabel={monthLabel}
          weekLabels={weekLabels}
          calendarDays={calendarDays}
          calendarStart={calendarStart}
          calendarEnd={calendarEnd}
          onPrevMonth={() => changeMonth(-1)}
          onNextMonth={() => changeMonth(1)}
          onSelectDay={selectCalendarDay}
          onApply={applyDateRange}
        />
      </ScreenShell>
    </AppLayout>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    listContent: {
      paddingBottom: spacing.xl,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
    },
    emptyImage: {
      width: s(198),
      height: s(198),
      resizeMode: 'contain',
    },
    emptyText: {
      textAlign: 'center',
      color: tokens.textPrimary,
    },
  });

export default OwnerBookingsScreen;
