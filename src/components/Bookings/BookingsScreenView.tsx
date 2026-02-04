// Component: BookingsScreenView. Used in: BookingsScreen.
import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { HeaderBar, Typography } from '@/ui';
import { useTheme } from '@/theme';
import { getColorTokens } from '@/theme';
import { useTranslation } from '@/i18n';
import { s } from '@/utils/scale';
import { BookingsTabs } from '@/components/Bookings/BookingsTabs';
import { ActiveTripCard } from '@/components/Bookings/ActiveTripCard';
import { PastTripsList } from '@/components/Bookings/PastTripsList';
import KeysBackground from '@/components/layout/KeysBackground';

import noBookingBlackImage from '@/assets/images/nobooking_black.png';
import noBookingWhiteImage from '@/assets/images/nobooking_white.png';

type TabKey = 'active' | 'past' | 'cancelled';

export type ActiveBooking = {
  city: string;
  hotelName: string;
  dates: string;
  price: string;
  image: number;
};

export type PastBookingItem = {
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

type BookingsScreenViewProps = {
  activeBooking: ActiveBooking | null;
  pastItems: PastBookingItem[];
  onBack: () => void;
  onPressPastBooking: (item: PastBookingItem) => void;
};

export const BookingsScreenView: React.FC<BookingsScreenViewProps> = ({
  activeBooking,
  pastItems,
  onBack,
  onPressPastBooking,
}) => {
  const { colors, mode } = useTheme();
  const isDark = mode === 'dark' || colors.background === colors.bgDark;
  const tokens = useMemo(() => getColorTokens(colors, mode), [colors, mode]);
  const palette = useMemo(
    () => ({
      background: tokens.bgPanel,
      header: tokens.bgHeader,
      text: tokens.textPrimary,
      border: tokens.borderStrong,
      accent: tokens.accent,
      cardBg: isDark ? colors.bgCard : tokens.bgField,
      chipBg: isDark ? colors.bgDarkAlt : tokens.bgPanel,
      imageBorder: isDark ? tokens.textPrimary : tokens.bgPanel,
      detailsBorder: isDark ? tokens.textPrimary : tokens.textPrimary,
      priceText: tokens.accent,
    }),
    [tokens, isDark, colors],
  );
  const styles = useMemo(() => getStyles(palette), [palette]);
  const [tab, setTab] = useState<TabKey>('cancelled');
  const { t } = useTranslation();

  const emptyImage = isDark ? noBookingWhiteImage : noBookingBlackImage;

  return (
    <View style={styles.root}>
      <View style={styles.screen}>
        <HeaderBar
          title={t('profile.menu.trips')}
          onBack={onBack}
          backIconName="chevron-left"
          backIconSize={s(20)}
          style={styles.header}
          titleStyle={styles.title}
          backStyle={styles.backButton}
        />

        <BookingsTabs
          value={tab}
          onChange={setTab}
          colors={{
            text: palette.text,
            border: palette.border,
            accent: palette.accent,
          }}
        />

        {tab === 'active' && activeBooking ? (
          <ActiveTripCard
            city={activeBooking.city}
            hotelName={activeBooking.hotelName}
            dates={activeBooking.dates}
            price={activeBooking.price}
            image={activeBooking.image}
            colors={{
              text: palette.text,
              cardBg: palette.cardBg,
              chipBg: palette.chipBg,
              priceText: palette.priceText,
              imageBorder: palette.imageBorder,
              detailsBorder: palette.detailsBorder,
            }}
          />
        ) : null}

        {tab === 'past' ? (
          <PastTripsList
            items={pastItems}
            colors={{
              background: palette.cardBg,
              text: palette.text,
            }}
            onPressItem={onPressPastBooking}
          />
        ) : null}
      </View>

      {tab === 'cancelled' ? (
        <View style={styles.emptyState}>
          <Image source={emptyImage} style={styles.centerImage} />
          <Typography
            variant="body"
            style={styles.emptyText}
            numberOfLines={2}
            ellipsizeMode="tail"
            adjustsFontSizeToFit
            minimumFontScale={0.85}
          >
            {t('bookings.emptyCancelled')}
          </Typography>
        </View>
      ) : null}

      {tab === 'cancelled' ? <KeysBackground /> : null}
    </View>
  );
};

type Palette = {
  background: string;
  header: string;
  text: string;
  border: string;
  accent: string;
  cardBg: string;
  chipBg: string;
  priceText: string;
  imageBorder: string;
  detailsBorder: string;
};

const getStyles = (palette: Palette) =>
  // LEGACY STYLES: contains hardcoded typography values
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: palette.background,
    },
    screen: {
      flex: 1,
      backgroundColor: palette.background,
    },
    header: {
      height: s(36),
      backgroundColor: palette.background,
    },
    backButton: {
      position: 'absolute',
      left: s(8),
      top: s(6),
      width: s(24),
      height: s(24),
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      color: palette.text,
      fontSize: s(16),
      fontWeight: '700',
    },
    emptyState: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
      pointerEvents: 'none',
    },
    centerImage: {
      width: s(198),
      height: s(198),
      resizeMode: 'contain',
    },
    emptyText: {
      color: palette.text,
      fontSize: s(14),
      fontWeight: '500',
      marginTop: s(10),
    },
  });

export default BookingsScreenView;
