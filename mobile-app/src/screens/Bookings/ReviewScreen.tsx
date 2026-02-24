// Screen: ReviewScreen. Allows leaving a review after booking.
import React from 'react';
import { useNavigation } from '@react-navigation/native';

import { AppLayout } from '@/layout/AppLayout';
import ReviewScreenView from '@/components/Bookings/ReviewScreenView';

export const ReviewScreen = () => {
  const navigation = useNavigation();

  return (
    <AppLayout variant="stack" header={false}>
      <ReviewScreenView onBack={() => navigation.goBack()} />
    </AppLayout>
  );
};

export default ReviewScreen;
