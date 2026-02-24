import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { radius, sizes } from '@/theme';
import { useTheme } from '@/theme';

import { s } from '@/utils/scale';

type Size = keyof typeof sizes.decorativeBubble;
type Variant = 'primary' | 'secondary' | 'surface' | 'overlay';

export type DecorativeBubbleProps = {
  size?: Size;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
  opacity?: number;
  children?: React.ReactNode;
};

export const DecorativeBubble: React.FC<DecorativeBubbleProps> = ({
  size = 'md',
  variant = 'surface',
  style,
  opacity = 1,
  children,
}) => {
  const { colors } = useTheme();
  const dimension = s(sizes.decorativeBubble[size]);
  const backgroundColor =
    variant === 'primary'
      ? colors.primary
      : variant === 'secondary'
        ? colors.secondary
        : variant === 'overlay'
          ? colors.overlay
          : colors.surface;

  return (
    <View style={[styles.shadowContainer, style, { width: dimension, height: dimension, opacity }]}>
      <View style={[styles.innerCircle, { backgroundColor, borderRadius: radius.round }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: '100%',
    height: '100%',
  },
});

export default DecorativeBubble;
