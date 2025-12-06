import React, { useEffect, useMemo } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

import { useThemeColors } from '@/hooks/useThemeColors';

type Props = {
  width?: number | `${number}%`;
  height?: number;
  style?: ViewStyle;
};

export const Skeleton: React.FC<Props> = ({ width = '100%', height = 16, style }) => {
  const { colors } = useThemeColors();
  const opacity = useMemo(() => new Animated.Value(0.4), []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.base,
        {
          width,
          height,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 10,
    borderWidth: 1,
  },
});
