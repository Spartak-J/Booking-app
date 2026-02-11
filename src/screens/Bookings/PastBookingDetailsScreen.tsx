// Screen: PastBookingDetailsScreen. Used in: RootNavigator.
import React, { useEffect, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import PastBookingDetailsScreenView from '@/components/Bookings/PastBookingDetailsScreenView';
import { HotelsRepository } from '@/data/hotels';
import { Hotel, Owner, Review } from '@/data/types';
import { AppLayout } from '@/layout/AppLayout';
import { Routes } from '@/navigation/routes';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { reviewService } from '@/services/reviewService';

type Route = RouteProp<RootStackParamList, Routes.PastBookingDetails>;
type Navigation = NativeStackNavigationProp<RootStackParamList>;

export const PastBookingDetailsScreen = () => {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Navigation>();
  const booking = params?.booking;
  const [hotel, setHotel] = useState<Hotel | undefined>(undefined);
  const [owner, setOwner] = useState<Owner | undefined>(undefined);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [canLeaveReview, setCanLeaveReview] = useState(false);

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

      if (booking?.bookingId) {
        const eligibility = await reviewService.canLeaveReview(booking.bookingId);
        if (!active) return;
        setCanLeaveReview(eligibility.allowed);
      } else {
        setCanLeaveReview(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [booking?.hotelId, booking?.id, booking?.title, booking?.bookingId]);

  return (
    <AppLayout variant="stack">
      <PastBookingDetailsScreenView
        onBack={() => navigation.goBack()}
        onLeaveReview={canLeaveReview ? () => {
          /* TODO: navigate to review flow */
        } : undefined}
        booking={booking}
        hotel={hotel}
        owner={owner}
        reviews={reviews}
      />
    </AppLayout>
  );
};

export default PastBookingDetailsScreen;
