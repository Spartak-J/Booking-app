import React, { useEffect, useMemo, memo } from 'react';
import { Animated, StyleSheet, View, StyleProp, ViewStyle } from 'react-native';

import { useTheme } from '@/theme';
import { s } from '@/utils/scale';

type BottomLoaderProps = {
  width?: number;
  height?: number;
  knobSize?: number;
  showKnob?: boolean;
  duration?: number;
  borderColor?: string;
  fillColor?: string;
  knobColor?: string;
  minFillWidth?: number;
  onFinish?: () => void;
  style?: StyleProp<ViewStyle>;
  frameStyle?: StyleProp<ViewStyle>;
  knobStyle?: StyleProp<ViewStyle>;
  knobContent?: React.ReactNode;
};

const DEFAULT_WIDTH = s(340);
const DEFAULT_HEIGHT = s(40);
const DEFAULT_KNOB = s(75);
const DEFAULT_MIN_FILL = s(38);

const BottomLoaderComponent: React.FC<BottomLoaderProps> = ({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  knobSize = DEFAULT_KNOB,
  showKnob = true,
  duration = 5000,
  borderColor,
  fillColor,
  knobColor,
  minFillWidth = DEFAULT_MIN_FILL,
  onFinish,
  style,
  frameStyle,
  knobStyle,
  knobContent,
}) => {
  const { tokens } = useTheme();
  const progress = useMemo(() => new Animated.Value(0), []);
  const resolvedBorder = borderColor ?? tokens.textOnAccent;
  const resolvedFill = fillColor ?? tokens.accent;
  const resolvedKnob = knobColor ?? tokens.textOnAccent;

  const effectiveKnob = showKnob ? knobSize : 0;
  const containerHeight = Math.max(height, effectiveKnob);
  const frameOffset = (containerHeight - height) / 2;
  const knobOffset = (containerHeight - effectiveKnob) / 2;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    });

    animation.start(({ finished }) => {
      if (finished && onFinish) {
        onFinish();
      }
    });

    return () => animation.stop();
  }, [duration, onFinish, progress]);

  const fillUpper = Math.max(minFillWidth, Math.max(width - s(8), 0));
  const fillStart = Math.min(minFillWidth, fillUpper);
  const fillEnd = Math.max(minFillWidth, fillUpper);
  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [fillStart, fillEnd],
  });

  // Движение бегунка синхронизируем с фронтом заливки:
  // центр бегунка «приклеен» к фронту fill (сдвигаем на половину размера).
  const knobStart = Math.max(fillStart - effectiveKnob / 2, 0);
  const knobEnd = Math.max(fillEnd - effectiveKnob / 2, 0);
  const knobTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [knobStart, knobEnd],
  });

  return (
    <View style={[styles.container, style, { height: containerHeight }]}>
      <View
        style={[
          styles.frame,
          frameStyle,
          {
            width,
            height,
            borderColor: resolvedBorder,
            top: frameOffset,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              width: fillWidth,
              height,
              backgroundColor: resolvedFill,
            },
          ]}
        />
      </View>
      {showKnob && effectiveKnob > 0 ? (
        <Animated.View
          style={[
            styles.knob,
            knobStyle,
            {
              width: effectiveKnob,
              height: effectiveKnob,
              borderRadius: effectiveKnob / 2,
              backgroundColor: resolvedKnob,
              top: knobOffset,
              transform: [{ translateX: knobTranslateX }],
            },
          ]}
        >
          {knobContent}
        </Animated.View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    position: 'absolute',
    borderWidth: s(2),
    borderRadius: s(30),
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
  },
  knob: {
    position: 'absolute',
    left: 0,
    borderWidth: s(2),
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(BottomLoaderComponent);
