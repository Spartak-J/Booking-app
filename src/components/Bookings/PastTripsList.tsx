// Component: PastTripsList. Used in: BookingsScreen.tsx.
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Typography } from '@/ui';
import { s, SCREEN_WIDTH } from '@/utils/scale';

type PastTripItem = {
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

type PastTripsListProps = {
  items: PastTripItem[];
  colors: {
    background: string;
    text: string;
  };
  onPressItem?: (item: PastTripItem) => void;
};

const GRID_GAP = s(12);
const GRID_PADDING = s(12);
const OUTER_MARGIN = s(20);
const CARD_WIDTH = (SCREEN_WIDTH - OUTER_MARGIN * 2 - GRID_PADDING * 2 - GRID_GAP) / 2;
const CARD_HEIGHT = s(150);

export const PastTripsList: React.FC<PastTripsListProps> = ({ items, colors, onPressItem }) => {
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => onPressItem?.(item)}
          >
            <Image source={item.image} style={styles.cardImage} />
            <View style={styles.label}>
              <Typography
                style={styles.labelText}
                numberOfLines={2}
                ellipsizeMode="tail"
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                {item.title}
              </Typography>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const getStyles = (colors: PastTripsListProps['colors']) =>
  StyleSheet.create({
    container: {
      marginTop: s(16),
      marginHorizontal: OUTER_MARGIN,
      padding: GRID_PADDING,
      borderRadius: s(10),
      backgroundColor: colors.background,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: GRID_GAP,
    },
    card: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      borderRadius: s(10),
      overflow: 'hidden',
      backgroundColor: colors.background,
    },
    cardImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    label: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingVertical: s(6),
      paddingHorizontal: s(6),
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
    },
    labelText: {
      color: colors.text,
      fontSize: s(12),
      lineHeight: s(15),
      fontWeight: '600',
      textAlign: 'center',
    },
  });

export default PastTripsList;
