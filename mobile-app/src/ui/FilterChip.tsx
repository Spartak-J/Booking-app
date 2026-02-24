import React from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { radius, spacing } from '@/theme';
import { useTheme } from '@/theme';
import { s } from '@/utils/scale';
import Typography from './Typography';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

export type FilterChipProps = {
  label: string;
  iconName?: IconName;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const FilterChip: React.FC<FilterChipProps> = ({
  label,
  iconName = 'chevron-down',
  onPress,
  style,
}) => {
  const { tokens } = useTheme();
  const styles = getStyles(tokens);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, style]}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
    >
      <Typography variant="menu" style={styles.label}>
        {label}
      </Typography>
      <MaterialCommunityIcons name={iconName} size={s(16)} color={tokens.textPrimary} />
    </Pressable>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    chip: {
      height: s(28),
      borderRadius: radius.md,
      paddingHorizontal: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: tokens.bgPanel,
      borderWidth: 1,
      borderColor: tokens.borderSubtle,
    },
    label: {
      color: tokens.textPrimary,
      textTransform: 'none',
    },
  });

export default FilterChip;
