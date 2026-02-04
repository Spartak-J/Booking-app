// Screen: PastBookingDetailsScreen. Used in: RootNavigator.
import React, { useEffect, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import PastBookingDetailsScreenView from '@/components/Bookings/PastBookingDetailsScreenView';
import { HotelsRepository } from '@/data/hotels';
import { Hotel, Owner, Review } from '@/data/types';
import { ScreenContainer } from '@/ui';
import { Routes } from '@/navigation/routes';
import { RootStackParamList } from '@/navigation/RootNavigator';

type Route = RouteProp<RootStackParamList, Routes.PastBookingDetails>;
type Navigation = NativeStackNavigationProp<RootStackParamList>;

export const PastBookingDetailsScreen = () => {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Navigation>();
  const booking = params?.booking;
  const [hotel, setHotel] = useState<Hotel | undefined>(undefined);
  const [owner, setOwner] = useState<Owner | undefined>(undefined);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    let active = true;
    const hotelId = booking?.hotelId ?? booking?.id;
    if (!hotelId) return;

    const load = async () => {
      let foundHotel = await HotelsRepository.getHotelById(hotelId);
      if (!foundHotel && booking?.title) {
        const allHotels = await HotelsRepository.getHotels();
        foundHotel = allHotels.find((item) => item.name === booking.title);
      }
      const resolvedHotelId = foundHotel?.id ?? hotelId;
      const foundReviews = await HotelsRepository.getReviewsByHotel(resolvedHotelId);
      const foundOwner = foundHotel?.ownerId
        ? await HotelsRepository.getOwner(foundHotel.ownerId)
        : undefined;

      if (!active) return;
      setHotel(foundHotel);
      setOwner(foundOwner);
      setReviews(foundReviews);
    };

    load();
    return () => {
      active = false;
    };
  }, [booking?.hotelId, booking?.id, booking?.title]);

  return (
    <ScreenContainer edges={['top', 'left', 'right']} withKeyboardAvoiding={false}>
      <PastBookingDetailsScreenView
        onBack={() => navigation.goBack()}
        booking={booking}
        hotel={hotel}
        owner={owner}
        reviews={reviews}
      />
    </ScreenContainer>
  );
};

export default PastBookingDetailsScreen;
