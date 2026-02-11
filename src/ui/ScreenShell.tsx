import React from 'react';
import { ImageBackground, StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme, spacing, radius } from '@/theme';
import IconButton from './IconButton';
import Typography from './Typography';
import KeysBackground from '@/components/layout/KeysBackground';

type Props = {
  title?: string;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  showKeys?: boolean;
  keysBottomOffset?: number;
  backgroundImage?: number;
  footerSlot?: React.ReactNode;
};

// Универсальная оболочка для "пустых" экранов: фон, хедер, опциональный декор.
export const ScreenShell: React.FC<Props> = ({
  title,
  onBack,
  rightSlot,
  children,
  style,
  contentStyle,
  showKeys = true,
  keysBottomOffset = 0,
  backgroundImage,
  footerSlot,
}) => {
  const { tokens } = useTheme();
  const styles = getStyles(tokens);

  return (
    <View style={[styles.root, style]}>
      {backgroundImage ? (
        <ImageBackground source={backgroundImage} style={styles.bgImage} resizeMode="cover" />
      ) : null}
      {showKeys && <KeysBackground bottomOffset={keysBottomOffset} />}

      <View style={styles.header}>
        {onBack ? (
          <IconButton
            onPress={onBack}
            variant="ghost"
            style={styles.headerButton}
            icon={
              <MaterialCommunityIcons name="arrow-left" size={spacing.xl} color={tokens.textPrimary} />
            }
          />
        ) : (
          <View style={styles.headerPlaceholder} />
        )}

        {title ? (
          <Typography variant="h2" style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Typography>
        ) : (
          <View style={styles.headerTitle} />
        )}

        <View style={styles.headerRight}>{rightSlot ?? <View style={styles.headerPlaceholder} />}</View>
      </View>

      <View style={[styles.content, contentStyle]}>{children}</View>
      {footerSlot ? <View style={styles.footer}>{footerSlot}</View> : null}
    </View>
  );
};

const getStyles = (tokens: any) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: tokens.bgScreen,
    },
    bgImage: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 0,
    },
    header: {
      height: spacing.xxl + spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xs,
      zIndex: 1,
    },
    headerButton: {
      width: spacing.xl + spacing.sm,
      height: spacing.xl + spacing.sm,
      borderRadius: radius.round,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    headerPlaceholder: {
      width: spacing.xl + spacing.sm,
      height: spacing.xl + spacing.sm,
      opacity: 0,
    },
    headerTitle: {
      flex: 1,
      color: tokens.textPrimary,
      textAlign: 'center',
    },
    headerRight: {
      width: spacing.xl + spacing.sm,
      height: spacing.xl + spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xl,
      zIndex: 1,
    },
    footer: {
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xl,
      paddingTop: spacing.md,
      zIndex: 1,
    },
  });

export default ScreenShell;
