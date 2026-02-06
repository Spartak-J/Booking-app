import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

type LineWithDotsProps = {
  width: number;
  color?: string;
  thickness?: number;
  dotSize?: number;
  style?: StyleProp<ViewStyle>;
};

export const LineWithDots: React.FC<LineWithDotsProps> = ({
  width,
  color,
  thickness = 3,
  dotSize,
  style,
}) => {
  const { tokens } = useTheme();
  const resolvedColor = color ?? tokens.textPrimary;
  const size = dotSize ?? thickness * 4;
  return (
    <View style={[styles.container, { width }, style]}>
      <View
        style={[
          styles.dot,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: resolvedColor },
        ]}
      />
      <View style={[styles.line, { height: thickness, backgroundColor: resolvedColor }]} />
      <View
        style={[
          styles.dot,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: resolvedColor },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  line: {
    flex: 1,
  },
  dot: {},
});

export default LineWithDots;
