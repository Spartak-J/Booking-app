import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { radius, spacing, useTheme, withOpacity } from '@/theme';
import Typography from './Typography';

type TopNotificationProps = {
  visible: boolean;
  message: string;
  variant?: 'success' | 'error';
  duration?: number;
  onHide?: () => void;
};

export const TopNotification: React.FC<TopNotificationProps> = ({
  visible,
  message,
  variant = 'success',
  duration = 2200,
  onHide,
}) => {
  const insets = useSafeAreaInsets();
  const { tokens, resolvedMode } = useTheme();
  const styles = useMemo(() => getStyles(), []);
  const translateY = useRef(new Animated.Value(-(spacing.xxl * 2 + spacing.sm))).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const toneColor = variant === 'error' ? tokens.error : tokens.success;
  const iconName = variant === 'error' ? 'alert-circle' : 'check-circle';
  const blurTint = resolvedMode === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    if (!visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -(spacing.xxl * 2 + spacing.sm),
          duration: 180,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();

    if (!onHide) return;
    const timeoutId = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -(spacing.xxl * 2 + spacing.sm),
          duration: 180,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) onHide();
      });
    }, duration);

    return () => clearTimeout(timeoutId);
  }, [duration, onHide, opacity, translateY, visible]);

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        { top: insets.top, transform: [{ translateY }], opacity },
      ]}
    >
      <View
        style={[
          styles.banner,
          {
            backgroundColor: withOpacity(toneColor, 0.22),
            borderColor: withOpacity(toneColor, 0.62),
          },
        ]}
      >
        <BlurView intensity={30} tint={blurTint} style={styles.blurLayer} />
        <View style={styles.contentRow}>
          <MaterialCommunityIcons
            name={iconName}
            size={spacing.lg + spacing.xs}
            color={toneColor}
          />
          <Typography variant="caption" tone="primary" style={styles.message}>
            {message}
          </Typography>
        </View>
      </View>
    </Animated.View>
  );
};

const getStyles = () =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: 1000,
      elevation: 1000,
      alignItems: 'stretch',
    },
    banner: {
      borderWidth: 1,
      borderRadius: 0,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      width: '100%',
      overflow: 'hidden',
    },
    blurLayer: {
      ...StyleSheet.absoluteFillObject,
    },
    contentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    message: {
      textAlign: 'center',
    },
  });

export default TopNotification;
