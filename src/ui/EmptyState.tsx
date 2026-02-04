import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

import { spacing, typography } from '@/theme';
import { useTheme } from '@/theme';
import { Typography } from '@/ui/Typography';

export type EmptyStateProps = {
  title: string;
  image: ImageSourcePropType;
  helperText?: string;
};

export const EmptyState: React.FC<EmptyStateProps> = ({ title, image, helperText }) => {
  const { tokens } = useTheme();
  const styles = getStyles(tokens);

  return (
    <View style={styles.container} pointerEvents="none">
      <Image source={image} style={styles.image} />
      <Typography
        variant="body"
        tone="primary"
        style={styles.title}
        numberOfLines={2}
        ellipsizeMode="tail"
        adjustsFontSizeToFit
        minimumFontScale={0.85}
      >
        {title}
      </Typography>
      {helperText ? (
        <Typography
          variant="caption"
          tone="secondary"
          style={styles.helper}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {helperText}
        </Typography>
      ) : null}
    </View>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    image: {
      width: 198,
      height: 198,
      resizeMode: 'contain',
    },
    title: {
      color: tokens.textPrimary,
      textAlign: 'center',
      ...(typography.body as object),
    },
    helper: {
      color: tokens.textSecondary,
      textAlign: 'center',
      ...(typography.caption as object),
    },
  });

export default EmptyState;
