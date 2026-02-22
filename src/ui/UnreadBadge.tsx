import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { useTheme } from '@/theme';
import Typography from './Typography';
import { s } from '@/utils/scale';

type Props = {
  count?: number;
  max?: number;
  style?: ViewStyle;
};

// Simple unread counter badge. Hides itself when count is falsy/0.
export const UnreadBadge: React.FC<Props> = ({ count = 0, max = 99, style }) => {
  const { tokens } = useTheme();
  if (!count) return null;
  const display = count > max ? `${max}+` : String(count);
  return (
    <View style={[styles.badge, { backgroundColor: tokens.accent }, style]}>
      <Typography variant="caption" tone="onAccent" style={styles.text}>
        {display}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    minWidth: s(18),
    height: s(18),
    paddingHorizontal: s(4),
    borderRadius: s(9),
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});

export default UnreadBadge;
