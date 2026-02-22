import React, { useMemo } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { radius, spacing, typography, useTheme } from '@/theme';
import { Typography } from '@/ui';
import { s } from '@/utils/scale';

export type AdminSearchOptionsItem = {
  id: string;
  label: string;
  selected?: boolean;
  onPress: () => void;
};

type Props = {
  visible: boolean;
  options: AdminSearchOptionsItem[];
  onClose: () => void;
  style?: StyleProp<ViewStyle>;
};

const AdminSearchOptionsMenu: React.FC<Props> = ({ visible, options, onClose, style }) => {
  const { tokens } = useTheme();
  const styles = useMemo(() => getStyles(tokens), [tokens]);

  if (!visible) return null;

  return (
    <View style={[styles.overlayRoot, style]}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.panel}>
        {options.map((option, index) => (
          <Pressable key={option.id} onPress={option.onPress} style={styles.row}>
            <Typography variant="h2" tone="primary" style={styles.rowText}>
              {option.label}
            </Typography>
            {index < options.length - 1 ? <View style={styles.divider} /> : null}
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    overlayRoot: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 40,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: tokens.bgScreen,
      opacity: 0.72,
    },
    panel: {
      marginTop: s(6),
      borderRadius: radius.md,
      overflow: 'hidden',
      backgroundColor: tokens.bgSurface,
      borderWidth: 1,
      borderColor: tokens.borderSubtle,
    },
    row: {
      minHeight: s(50),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingRight: spacing.lg,
    },
    rowText: {
      ...(typography.h2 as object),
      textAlign: 'left',
    },
    divider: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottomWidth: 1,
      borderBottomColor: tokens.borderStrong,
    },
  });

export default AdminSearchOptionsMenu;
