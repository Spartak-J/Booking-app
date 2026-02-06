import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  FlatList,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';

import { motion, spacing } from '@/theme';

type RenderItemParams<T> = {
  item: T;
  index: number;
  animatedStyle: Animated.WithAnimatedObject<ViewStyle>;
  focus: Animated.AnimatedInterpolation<number>;
};

type AnimatedStyleParams = {
  index: number;
  inputRange: number[];
  scrollX: Animated.Value;
};

export type CarouselPickerProps<T> = {
  data: T[];
  itemWidth: number;
  itemSpacing?: number;
  initialIndex?: number;
  onSelect?: (item: T, index: number) => void;
  renderItem: (params: RenderItemParams<T>) => React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scaleRange?: { min: number; max: number };
  opacityRange?: { min: number; max: number };
  getAnimatedStyle?: (params: AnimatedStyleParams) => Animated.WithAnimatedObject<ViewStyle>;
};

export const CarouselPicker = <T,>({
  data,
  itemWidth,
  itemSpacing = spacing.md,
  initialIndex = 0,
  onSelect,
  renderItem,
  contentContainerStyle,
  scaleRange = motion.carousel.scale,
  opacityRange = motion.carousel.opacity,
  getAnimatedStyle,
}: CarouselPickerProps<T>) => {
  const { width: screenWidth } = useWindowDimensions();
  const listRef = useRef<FlatList<T>>(null);
  const scrollXValue = useMemo(() => new Animated.Value(0), []);

  const stepWidth = itemWidth;
  const snapInterval = stepWidth + itemSpacing;
  const loopedData = useMemo(() => {
    if (data.length === 0) return [] as T[];
    return [...data, ...data, ...data];
  }, [data]);

  const sidePadding = Math.max(0, (screenWidth - stepWidth) / 2);

  useEffect(() => {
    if (!data.length) return;
    const clampedIndex = Math.max(0, Math.min(initialIndex, data.length - 1));
    const offset = (data.length + clampedIndex) * snapInterval;
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset, animated: false });
    });
    onSelect?.(data[clampedIndex], clampedIndex);
  }, [data, data.length, initialIndex, onSelect, snapInterval]);

  const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!data.length) return;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / snapInterval);
    const dataLength = data.length;
    const baseIndex = ((index % dataLength) + dataLength) % dataLength;

    if (index < dataLength) {
      const newOffset = offset + dataLength * snapInterval;
      listRef.current?.scrollToOffset({ offset: newOffset, animated: false });
    } else if (index >= dataLength * 2) {
      const newOffset = offset - dataLength * snapInterval;
      listRef.current?.scrollToOffset({ offset: newOffset, animated: false });
    }

    onSelect?.(data[baseIndex], baseIndex);
  };

  const renderLoopItem = ({ item, index }: ListRenderItemInfo<T>) => {
    const center = index * snapInterval;
    const inputRange = [(index - 1) * snapInterval, center, (index + 1) * snapInterval];

    const focusDistance = snapInterval * 0.6;
    const focus = scrollXValue.interpolate({
      inputRange: [center - focusDistance, center, center + focusDistance],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });

    const animatedStyle = getAnimatedStyle
      ? getAnimatedStyle({ index, inputRange, scrollX: scrollXValue })
      : (() => {
          const scale = scrollXValue.interpolate({
            inputRange,
            outputRange: [scaleRange.min, scaleRange.max, scaleRange.min],
            extrapolate: 'clamp',
          });

          const opacity = scrollXValue.interpolate({
            inputRange,
            outputRange: [opacityRange.min, opacityRange.max, opacityRange.min],
            extrapolate: 'clamp',
          });

          return { transform: [{ scale }], opacity };
        })();
    const baseIndex = data.length ? index % data.length : index;

    return (
      <View style={[styles.itemContainer, { width: snapInterval }]}>
        {renderItem({ item, index: baseIndex, animatedStyle, focus })}
      </View>
    );
  };

  return (
    <Animated.FlatList
      ref={listRef as unknown as React.RefObject<FlatList<any>>}
      data={loopedData as any}
      keyExtractor={(_, index) => `carousel-${index}`}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={snapInterval}
      snapToAlignment="center"
      decelerationRate="fast"
      bounces={false}
      onMomentumScrollEnd={handleMomentumEnd}
      getItemLayout={(_, index) => ({
        length: snapInterval,
        offset: snapInterval * index,
        index,
      })}
      contentContainerStyle={[
        styles.content,
        { paddingHorizontal: sidePadding },
        contentContainerStyle,
      ]}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollXValue } } }], {
        useNativeDriver: true,
      })}
      scrollEventThrottle={16}
      renderItem={renderLoopItem}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CarouselPicker;
