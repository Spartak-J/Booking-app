import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, Animated, StyleSheet, ViewStyle } from 'react-native';

import { radius, spacing } from '@/theme';
import { useTheme } from '@/theme';

type Variant = 'spinner' | 'skeleton';

export type LoaderProps = {
  variant?: Variant;
  width?: number | `${number}%`;
  height?: number;
  style?: ViewStyle;
};

export const Loader: React.FC<LoaderProps> = ({
  variant = 'spinner',
  width = '100%',
  height = spacing.lg,
  style,
}) => {
  const { colors } = useTheme();
  const opacity = useMemo(() => new Animated.Value(0.4), []);

  useEffect(() => {
    if (variant !== 'skeleton') {
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity, variant]);

  if (variant === 'spinner') {
    return <ActivityIndicator color={colors.primary} />;
  }

  return (
    <Animated.View
      style={[
        styles.skeleton,
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
  skeleton: {
    borderRadius: radius.md,
    borderWidth: 1,
  },
});

export default Loader;
