// Component: ActiveTripCard. Used in: BookingsScreen.tsx.
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Typography } from '@/ui';
import { s } from '@/utils/scale';

type ActiveTripCardProps = {
  city: string;
  hotelName: string;
  dates: string;
  price: string;
  image: number;
  colors: {
    text: string;
    cardBg: string;
    chipBg: string;
    priceText: string;
    imageBorder: string;
    detailsBorder: string;
  };
};

export const ActiveTripCard: React.FC<ActiveTripCardProps> = ({
  city,
  hotelName,
  dates,
  price,
  image,
  colors,
}) => {
  const styles = getStyles(colors);

  return (
    <View style={styles.section}>
      <Typography variant="h2" style={styles.city} numberOfLines={1} ellipsizeMode="tail">
        {city}
      </Typography>
      <View style={styles.card}>
        <Typography style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {hotelName}
        </Typography>
        <Typography style={styles.dates} numberOfLines={1} ellipsizeMode="tail">
          {dates}
        </Typography>
        <View style={styles.imageWrap}>
          <Image source={image} style={styles.image} />
        </View>
        <View style={styles.price}>
          <Typography style={styles.priceText} numberOfLines={1} ellipsizeMode="tail">
            {price}
          </Typography>
        </View>
        <View style={styles.details}>
          <Typography
            style={styles.detailsText}
            numberOfLines={1}
            ellipsizeMode="tail"
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            Управління бронюванням
          </Typography>
        </View>
      </View>
    </View>
  );
};

const getStyles = (colors: ActiveTripCardProps['colors']) =>
  StyleSheet.create({
    section: {
      paddingHorizontal: s(23),
      paddingTop: s(12),
    },
    city: {
      color: colors.text,
      fontSize: s(20),
      lineHeight: s(24),
      fontWeight: '700',
    },
    card: {
      marginTop: s(12),
      height: s(190),
      borderRadius: s(10),
      backgroundColor: colors.cardBg,
      padding: s(15),
      position: 'relative',
    },
    title: {
      color: colors.text,
      fontSize: s(20),
      lineHeight: s(24),
      fontWeight: '700',
      maxWidth: s(200),
    },
    dates: {
      marginTop: s(8),
      color: colors.text,
      fontSize: s(13),
      lineHeight: s(16),
    },
    imageWrap: {
      position: 'absolute',
      right: s(20),
      top: s(23),
      width: s(60),
      height: s(60),
      borderRadius: s(50),
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.imageBorder,
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    price: {
      position: 'absolute',
      left: s(27),
      bottom: s(32),
      paddingHorizontal: s(10),
      paddingVertical: s(5),
      borderRadius: s(20),
      backgroundColor: colors.chipBg,
    },
    priceText: {
      color: colors.priceText,
      fontSize: s(13),
      lineHeight: s(16),
      fontWeight: '700',
    },
    details: {
      position: 'absolute',
      right: s(20),
      bottom: s(20),
      height: s(35),
      paddingHorizontal: s(10),
      borderRadius: s(20),
      borderWidth: 1,
      borderColor: colors.detailsBorder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    detailsText: {
      color: colors.text,
      fontSize: s(12),
      lineHeight: s(15),
      fontWeight: '500',
      textAlign: 'center',
    },
  });

export default ActiveTripCard;
