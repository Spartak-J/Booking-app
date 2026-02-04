import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type LineWithDotsProps = {
  width: number;
  color: string;
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
  const size = dotSize ?? thickness * 4;
  return (
    <View style={[styles.container, { width }, style]}>
      <View
        style={[
          styles.dot,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        ]}
      />
      <View style={[styles.line, { height: thickness, backgroundColor: color }]} />
      <View
        style={[
          styles.dot,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
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
