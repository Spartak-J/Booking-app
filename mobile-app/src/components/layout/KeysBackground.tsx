// Component: KeysBackground. Used in: Profile/Messages/Bookings screens.
import React, { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';
import { s, SCREEN_WIDTH } from '@/utils/scale';
import keyYellowImage from '@/assets/images/key_yellow.png';
import keyBlackImage from '@/assets/images/key_black.png';

type KeysBackgroundProps = {
  bottomOffset?: number;
  variant?: 'auto' | 'yellow' | 'black';
};

const KEY_IMAGE_HEIGHT = s(220);

export const KeysBackground: React.FC<KeysBackgroundProps> = ({
  bottomOffset = 0,
  variant = 'auto',
}) => {
  const { colors, mode } = useTheme();
  const isDark = mode === 'dark' || colors.background === colors.bgDark;
  const keyImage = useMemo(() => {
    if (variant === 'yellow') return keyYellowImage;
    if (variant === 'black') return keyBlackImage;
    return isDark ? keyBlackImage : keyYellowImage;
  }, [isDark, variant]);

  return (
    <View pointerEvents="none" style={styles.wrapper}>
      <Image source={keyImage} style={[styles.image, { bottom: bottomOffset }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    elevation: 1,
  },
  image: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: SCREEN_WIDTH,
    height: KEY_IMAGE_HEIGHT,
    resizeMode: 'cover',
  },
});

export default KeysBackground;
