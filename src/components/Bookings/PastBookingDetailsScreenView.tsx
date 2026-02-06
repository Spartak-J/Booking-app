// Component: PastBookingDetailsScreenView. Used in: PastBookingDetailsScreen.
import React from 'react';

import { PastBookingDetails } from '@/components/Bookings/PastBookingDetails';
import type { Hotel, Owner, Review } from '@/data/types';
import { EmptyState } from '@/ui';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/theme';

import noBookingBlackImage from '@/assets/images/nobooking_black.png';
import noBookingWhiteImage from '@/assets/images/nobooking_white.png';

type BookingPayload = {
  id: string;
  hotelId?: string;
  title: string;
  image: number;
  dates?: string;
  price?: string;
  location?: string;
  rating?: string;
  infoText?: string;
  amenities?: string[];
};

type PastBookingDetailsScreenViewProps = {
  booking?: BookingPayload;
  hotel?: Hotel;
  owner?: Owner;
  reviews: Review[];
  onBack: () => void;
  onLeaveReview?: () => void;
};

export const PastBookingDetailsScreenView: React.FC<PastBookingDetailsScreenViewProps> = ({
  booking,
  hotel,
  owner,
  reviews,
  onBack,
  onLeaveReview,
}) => {
  const { t } = useTranslation();
  const { colors, mode } = useTheme();
  const isDark = mode === 'dark' || colors.background === colors.bgDark;
  const emptyImage = isDark ? noBookingWhiteImage : noBookingBlackImage;

  if (!booking) {
    return <EmptyState title={t('bookings.notFound')} image={emptyImage} />;
  }

  return (
    <PastBookingDetails
      onBack={onBack}
      onLeaveReview={onLeaveReview}
      booking={booking}
      hotel={hotel}
      owner={owner}
      reviews={reviews}
    />
  );
};

export default PastBookingDetailsScreenView;
