import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { spacing, radius, typography } from '@/theme';
import { useTheme } from '@/theme';
import { Button } from '@/ui/Button';
import { Typography } from '@/ui/Typography';

export type ListItemProps = {
  title: string;
  onPress?: () => void;
  left?: React.ReactNode;
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const ListItem: React.FC<ListItemProps> = ({ title, onPress, left, right, style }) => {
  const { tokens } = useTheme();
  const styles = getStyles(tokens);

  return (
    <Button
      onPress={onPress ?? (() => undefined)}
      variant="secondary"
      style={[styles.button, style]}
    >
      <View style={styles.content}>
        {left ? <View style={styles.left}>{left}</View> : null}
        <Typography
          variant="menu"
          tone="primary"
          style={styles.title}
          numberOfLines={1}
          ellipsizeMode="tail"
          adjustsFontSizeToFit
          minimumFontScale={0.85}
        >
          {title}
        </Typography>
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
    </Button>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    button: {
      borderRadius: radius.xl,
      backgroundColor: tokens.bgCard,
      borderWidth: 0,
      alignItems: 'stretch',
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      justifyContent: 'flex-start',
    },
    left: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    right: {
      marginLeft: 'auto',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      ...(typography.menu as object),
      color: tokens.textPrimary,
      textAlign: 'left',
      flexShrink: 1,
    },
  });

export default ListItem;
