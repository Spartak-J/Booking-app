// Component: PopularCitiesCarousel. Used in: PopularCities.tsx.
import React, { useMemo, useRef, useCallback } from 'react';
import { Animated, Image, StyleSheet, View, ViewStyle } from 'react-native';

import { useTheme, withOpacity } from '@/theme';
import { Button, Typography } from '@/ui';
import { s, SCREEN_WIDTH } from '@/utils/scale';
import type { CityCard } from './types';

type PopularCitiesCarouselProps = {
  data: CityCard[];
  onOpenCity: (cityName: string) => void;
  style?: ViewStyle;
};

const CARD_WIDTH = s(120);
const CARD_HEIGHT = s(180);
const SPACING = s(0);
const SNAP_INTERVAL = CARD_WIDTH + SPACING;
const SIDE_SCALE_X = 0.8;
const SIDE_SCALE_Y = 0.8;

export const PopularCitiesCarousel: React.FC<PopularCitiesCarouselProps> = ({
  data,
  onOpenCity,
  style,
}) => {
  const { colors } = useTheme();
  const scrollXValue = useMemo(() => new Animated.Value(0), []);
  const listRef = useRef<Animated.FlatList<CityCard>>(null);
  const styles = useMemo(() => getStyles(colors), [colors]);

  const loopedData = useMemo(() => {
    if (data.length === 0) {
      return [];
    }
    return [...data, ...data, ...data];
  }, [data]);

  const baseIndex = data.length;

  const contentInset = useMemo(
    () => ({
      paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2 + s(7),
    }),
    [],
  );

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { x: scrollXValue } } }], {
    useNativeDriver: true,
  });

  const renderItem = ({ item, index }: { item: CityCard; index: number }) => {
    const inputRange = [
      (index - 1) * SNAP_INTERVAL,
      index * SNAP_INTERVAL,
      (index + 1) * SNAP_INTERVAL,
    ];

    const scaleX = scrollXValue.interpolate({
      inputRange,
      outputRange: [SIDE_SCALE_X, 1, SIDE_SCALE_X],
      extrapolate: 'clamp',
    });

    const scaleY = scrollXValue.interpolate({
      inputRange,
      outputRange: [SIDE_SCALE_Y, 1, SIDE_SCALE_Y],
      extrapolate: 'clamp',
    });

    const translateY = scrollXValue.interpolate({
      inputRange,
      outputRange: [s(16), 0, s(16)],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.cardWrapper, { transform: [{ scaleX }, { scaleY }, { translateY }] }]}>
        <Button variant="ghost" onPress={() => onOpenCity(item.name)} style={styles.cardButton}>
          <Image source={item.image} style={styles.cardImage} />
          <View style={styles.cardLabel}>
            <Typography variant="subtitle" style={styles.cardLabelText}>
              {item.name}
            </Typography>
          </View>
        </Button>
      </Animated.View>
    );
  };

  const keyExtractor = (item: CityCard, index: number) => `${item.id}-${index}`;

  const handleMomentumEnd = useCallback(
    (event: { nativeEvent: { contentOffset: { x: number } } }) => {
      if (!data.length) {
        return;
      }
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / SNAP_INTERVAL);

      if (index <= data.length - 1) {
        const nextIndex = index + data.length;
        listRef.current?.scrollToIndex({ index: nextIndex, animated: false });
      } else if (index >= data.length * 2) {
        const nextIndex = index - data.length;
        listRef.current?.scrollToIndex({ index: nextIndex, animated: false });
      }
    },
    [data.length],
  );

  return (
    <View style={[styles.container, style]}>
      <Animated.FlatList
        ref={listRef}
        data={loopedData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={contentInset}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumEnd}
        scrollEventThrottle={16}
        initialScrollIndex={data.length ? baseIndex : 0}
        getItemLayout={(_, index) => ({
          length: SNAP_INTERVAL,
          offset: SNAP_INTERVAL * index,
          index,
        })}
      />
    </View>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      height: CARD_HEIGHT + s(10),
    },
    cardWrapper: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      marginRight: SPACING,
      borderRadius: s(20),
      overflow: 'hidden',
      backgroundColor: colors.black,
    },
    cardButton: {
      width: '100%',
      height: '100%',
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderWidth: 0,
      borderRadius: s(20),
      overflow: 'hidden',
      backgroundColor: 'transparent',
    },
    cardImage: {
      width: '100%',
      height: '100%',
      borderRadius: s(20),
    },
    cardLabel: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingVertical: s(8),
      backgroundColor: withOpacity(colors.black, 0.45),
    },
    cardLabelText: {
      textAlign: 'center',
      fontSize: s(20),
      lineHeight: s(24),
      fontWeight: '500',
      color: colors.white,
    },
  });

export default PopularCitiesCarousel;
