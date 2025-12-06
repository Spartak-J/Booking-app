import React from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/hooks/useThemeColors';
import { spacing, radius } from '@/theme';

type Option = { id: string; label: string };

type Props = {
  options: Option[];
  selected: string[];
  onChange: (next: string[]) => void;
  multi?: boolean;
  horizontal?: boolean;
  disabledIds?: string[];
};

export const ChipSelect: React.FC<Props> = ({
  options,
  selected,
  onChange,
  multi = true,
  horizontal = true,
  disabledIds = [],
}) => {
  const { colors } = useThemeColors();
  const styles = getStyles();

  const toggle = (id: string) => {
    if (disabledIds.includes(id)) return;
    if (multi) {
      const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
      onChange(next);
    } else {
      onChange(selected.includes(id) ? [] : [id]);
    }
  };

  const content = (
    <View style={[styles.row, horizontal && styles.rowGap]}>
      {options.map((opt) => (
        <OptionChip
          key={opt.id}
          option={opt}
          active={selected.includes(opt.id)}
          disabled={disabledIds.includes(opt.id)}
          colors={colors}
          styles={styles}
          onPress={() => toggle(opt.id)}
        />
      ))}
    </View>
  );

  if (horizontal) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {content}
      </ScrollView>
    );
  }

  return content;
};

const getStyles = () =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    rowGap: {
      marginVertical: spacing.xs,
    },
    chip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.lg,
      borderWidth: 1,
    },
    chipText: {
      fontWeight: '600',
    },
    scroll: {
      marginVertical: spacing.xs,
    },
  });

const OptionChip = ({
  option,
  active,
  disabled,
  onPress,
  colors,
  styles,
}: {
  option: Option;
  active: boolean;
  disabled: boolean;
  onPress: () => void;
  colors: any;
  styles: ReturnType<typeof getStyles>;
}) => {
  const scale = React.useMemo(() => new Animated.Value(1), []);

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        disabled={disabled}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.chip,
          {
            backgroundColor: active ? colors.accent : colors.surface,
            borderColor: active ? colors.accent : colors.border,
            opacity: disabled ? 0.4 : 1,
          },
        ]}
      >
        <Text style={[styles.chipText, { color: active ? '#fff' : colors.text }]}>
          {option.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
};
