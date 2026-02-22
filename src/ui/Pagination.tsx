import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { radius, spacing, typography, useTheme } from '@/theme';
import { s } from '@/utils/scale';
import Button from './Button';
import IconButton from './IconButton';

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
  style?: StyleProp<ViewStyle>;
};

const buildPages = (currentPage: number, totalPages: number, maxVisible: number) => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);
  const normalizedStart = Math.max(1, end - maxVisible + 1);
  return Array.from({ length: end - normalizedStart + 1 }, (_, index) => normalizedStart + index);
};

export const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
  style,
}) => {
  const { tokens } = useTheme();
  const styles = useMemo(() => getStyles(tokens), [tokens]);
  const pages = useMemo(
    () => buildPages(currentPage, Math.max(1, totalPages), Math.max(1, maxVisible)),
    [currentPage, totalPages, maxVisible],
  );
  const resolvedTotalPages = Math.max(1, totalPages);

  return (
    <View style={[styles.container, style]}>
      <IconButton
        onPress={() => onPageChange(Math.max(1, currentPage - 1))}
        variant="ghost"
        disabled={currentPage <= 1}
        icon={
          <MaterialCommunityIcons name="chevron-left" size={s(18)} color={tokens.textPrimary} />
        }
      />
      <View style={styles.numbers}>
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <Button
              key={page}
              title={String(page)}
              onPress={() => onPageChange(page)}
              variant="ghost"
              size="small"
              style={[styles.pageButton, isActive && styles.pageButtonActive]}
              textStyle={[styles.pageText, isActive && styles.pageTextActive]}
            />
          );
        })}
      </View>
      <IconButton
        onPress={() => onPageChange(Math.min(resolvedTotalPages, currentPage + 1))}
        variant="ghost"
        disabled={currentPage >= resolvedTotalPages}
        icon={
          <MaterialCommunityIcons name="chevron-right" size={s(18)} color={tokens.textPrimary} />
        }
      />
    </View>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
    },
    numbers: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    pageButton: {
      minWidth: s(32),
      borderWidth: 0,
      borderRadius: radius.lg,
      backgroundColor: 'transparent',
      paddingHorizontal: spacing.xs,
    },
    pageButtonActive: {
      backgroundColor: tokens.textPrimary,
    },
    pageText: {
      ...(typography.caption as object),
      color: tokens.textPrimary,
    },
    pageTextActive: {
      color: tokens.bgScreen,
    },
  });

export default Pagination;
