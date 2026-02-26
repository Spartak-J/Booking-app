// Screen: BookingsScreen. Used in: RootNavigator.
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import BookingsScreenView, {
  ActiveBooking,
  PastBookingItem,
} from '@/components/Bookings/BookingsScreenView';
import { HotelsRepository } from '@/data/hotels';
import { Routes } from '@/navigation/routes';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/utils/price';
import { AppLayout } from '@/layout/AppLayout';
import { bookingService } from '@/services/bookingService';

import activeTripImage from '@/assets/images/2.png';
import pastImage1 from '@/assets/images/1.png';
import pastImage2 from '@/assets/images/2.png';
import pastImage3 from '@/assets/images/3.png';
import pastImage4 from '@/assets/images/4.png';
import pastImage5 from '@/assets/images/5.png';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const toTime = (value: string) => new Date(value).getTime();

export const BookingsScreen = () => {
  const navigation = useNavigation<Navigation>();
  const { user } = useAuth();
  const [activeBooking, setActiveBooking] = useState<ActiveBooking | null>(null);
  const [pastItems, setPastItems] = useState<PastBookingItem[]>([]);

  useEffect(() => {
    let active = true;
    const imageMap: Record<string, number> = {
      'hotel-1': pastImage1,
      'hotel-2': pastImage2,
      'hotel-3': pastImage3,
      'hotel-4': pastImage4,
      'hotel-5': pastImage5,
    };

    const formatDateRange = (start: string, end: string) => {
      const startDate = new Date(start);
      const endDate = new Date(end);
      return `${startDate.toLocaleDateString('uk-UA')} -${endDate.toLocaleDateString('uk-UA')}`;
    };

    const loadBookings = async () => {
      const userId = user?.id ?? 'user-1';
      const [{ items }, hotels] = await Promise.all([
        bookingService.getUserBookings(userId),
        HotelsRepository.getAll(),
      ]);
      if (!active) return;

      const activeItem = [...items]
        .filter((item) => item.status === 'active' || item.status === 'pending')
        .sort((a, b) => toTime(b.checkIn) - toTime(a.checkIn))[0];
      if (activeItem) {
        const activeHotelId = activeItem.hotelId ?? '';
        const hotel = hotels.find((item) => item.id === activeItem.hotelId);
        setActiveBooking({
          city: hotel?.city ?? 'Львів',
          hotelName: hotel?.name ?? 'Jam Hotel Staroyevreyska',
          dates: formatDateRange(activeItem.checkIn, activeItem.checkOut),
          price: `UAH ${formatPrice(activeItem.totalPrice, 'UAH', false)}`,
          image: imageMap[activeHotelId] ?? activeTripImage,
        });
      } else {
        setActiveBooking(null);
      }

      const pastBookings = items
        .filter((item) => item.status === 'completed')
        .sort((a, b) => toTime(b.checkOut) - toTime(a.checkOut));
      setPastItems(
        pastBookings.map((item) => {
          const pastHotelId = item.hotelId ?? '';
          const hotel = hotels.find((entry) => entry.id === item.hotelId);
          return {
            // Keep render keys stable even if mocks accidentally duplicate booking ids.
            id: `${item.orderId}-${item.hotelId ?? 'hotel'}-${item.checkIn}`,
            bookingId: item.orderId,
            hotelId: item.hotelId,
            title: hotel?.name ?? 'Jam Hotel Staroyevreyska',
            image: imageMap[pastHotelId] ?? pastImage1,
            dates: formatDateRange(item.checkIn, item.checkOut),
            price: `UAH ${formatPrice(item.totalPrice, 'UAH', false)}`,
            location: hotel?.address ?? 'вул. Наукова,61',
            rating: hotel?.rating ? hotel.rating.toFixed(1).replace('.', ',') : '8,1',
            infoText: hotel?.description ?? '',
            amenities: hotel?.amenities ?? [],
          };
        }),
      );
    };

    loadBookings();
    const unsubscribe = navigation?.addListener?.('focus', loadBookings);

    return () => {
      active = false;
      if (unsubscribe) unsubscribe();
    };
  }, [navigation, user?.id]);

  return (
    <AppLayout variant="tab" header={false}>
      <BookingsScreenView
        activeBooking={activeBooking}
        pastItems={pastItems}
        onBack={() => navigation.goBack()}
        onPressPastBooking={(item) =>
          navigation.navigate(Routes.PastBookingDetails, { booking: item })
        }
      />
    </AppLayout>
  );
};

export default BookingsScreen;
