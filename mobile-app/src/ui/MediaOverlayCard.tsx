import React, { useMemo, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { radius, spacing, withOpacity } from '@/theme';
import { useTheme } from '@/theme';
import { s } from '@/utils/scale';
import Typography from './Typography';

export type MediaOverlayCardProps = {
  title: string;
  imageSource: ImageSourcePropType;
  fallbackImageSource?: ImageSourcePropType;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  topRightAccessory?: React.ReactNode;
  bottomRightAccessory?: React.ReactNode;
};

const MediaOverlayCard: React.FC<MediaOverlayCardProps> = ({
  title,
  imageSource,
  fallbackImageSource,
  onPress,
  style,
  topRightAccessory,
  bottomRightAccessory,
}) => {
  const { colors, mode, tokens } = useTheme();
  const [imageFailed, setImageFailed] = useState(false);
  const styles = useMemo(() => getStyles(colors, tokens), [colors, tokens]);
  const gradientColors = useMemo(
    () =>
      mode === 'dark'
        ? ([
            withOpacity(colors.black, 0),
            withOpacity(colors.black, 0.22),
            withOpacity(colors.black, 0.74),
          ] as const)
        : ([
            withOpacity(colors.black, 0),
            withOpacity(colors.black, 0.14),
            withOpacity(colors.black, 0.5),
          ] as const),
    [colors.black, mode],
  );
  const labelColor = withOpacity(colors.surfaceLight, mode === 'dark' ? 0.14 : 0.22);

  return (
    <Pressable onPress={onPress} style={[styles.card, style]}>
      <Image
        source={imageFailed && fallbackImageSource ? fallbackImageSource : imageSource}
        style={styles.image}
        resizeMode="cover"
        onError={() => setImageFailed(true)}
      />
      <LinearGradient colors={gradientColors} style={styles.overlay} />
      {topRightAccessory ? <View style={styles.topRight}>{topRightAccessory}</View> : null}

      <View style={[styles.labelWrap, { backgroundColor: labelColor }]}>
        <Typography variant="subtitle" style={styles.label} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Typography>
      </View>

      {bottomRightAccessory ? <View style={styles.bottomRight}>{bottomRightAccessory}</View> : null}
    </Pressable>
  );
};

const getStyles = (colors: Record<string, string>, tokens: Record<string, string>) =>
  StyleSheet.create({
    card: {
      width: '100%',
      height: s(188),
      borderRadius: radius.lg,
      overflow: 'hidden',
      backgroundColor: tokens.bgCard,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
    },
    topRight: {
      position: 'absolute',
      top: s(8),
      right: s(8),
      zIndex: 2,
    },
    bottomRight: {
      position: 'absolute',
      right: s(8),
      bottom: s(8),
      zIndex: 2,
    },
    labelWrap: {
      position: 'absolute',
      left: s(7),
      bottom: s(6),
      borderRadius: radius.md,
      paddingVertical: s(10),
      paddingHorizontal: s(12),
      maxWidth: '75%',
    },
    label: {
      color: colors.surfaceLight,
    },
  });

export default MediaOverlayCard;
