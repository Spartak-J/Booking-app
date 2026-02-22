import React from 'react';
import { Modal as RNModal, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { radius, spacing } from '@/theme';
import { useTheme } from '@/theme';

type Variant = 'sheet' | 'dialog';

export type ModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  variant?: Variant;
  contentStyle?: StyleProp<ViewStyle>;
  overlayOpacity?: number;
  overlayColor?: string;
  position?: 'top' | 'center' | 'bottom';
};

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  variant = 'sheet',
  contentStyle,
  overlayOpacity = 0.4,
  overlayColor,
  position,
}) => {
  const { colors } = useTheme();
  const styles = getStyles(colors, variant, overlayOpacity, overlayColor, position);

  return (
    <RNModal visible={visible} transparent animationType={variant === 'sheet' ? 'slide' : 'fade'}>
      <SafeAreaView style={styles.backdrop}>
        <Pressable style={styles.backdropPressable} onPress={onClose} accessibilityRole="button">
          <View style={styles.overlayLayer} />
        </Pressable>
        <View style={[styles.content, contentStyle]}>{children}</View>
      </SafeAreaView>
    </RNModal>
  );
};

const getStyles = (
  colors: Record<string, string>,
  variant: Variant,
  overlayOpacity: number,
  overlayColor?: string,
  position?: 'top' | 'center' | 'bottom',
) => {
  const justifyContent =
    position === 'top'
      ? 'flex-start'
      : position === 'center'
        ? 'center'
        : position === 'bottom'
          ? 'flex-end'
          : variant === 'sheet'
            ? 'flex-end'
            : 'center';
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent,
    },
    backdropPressable: {
      ...StyleSheet.absoluteFillObject,
    },
    overlayLayer: {
      flex: 1,
      backgroundColor: overlayColor ?? colors.overlay,
      opacity: overlayOpacity,
    },
    content: {
      backgroundColor: colors.surface,
      padding: spacing.lg,
      borderTopLeftRadius: variant === 'sheet' ? radius.lg : radius.md,
      borderTopRightRadius: variant === 'sheet' ? radius.lg : radius.md,
      borderRadius: variant === 'dialog' ? radius.lg : radius.md,
    },
  });
};

export default Modal;
