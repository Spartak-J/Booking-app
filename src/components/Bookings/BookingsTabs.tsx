// Component: BookingsTabs. Used in: BookingsScreen.tsx.
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Typography } from '@/ui';
import { s } from '@/utils/scale';

type TabKey = 'active' | 'past' | 'cancelled';

type BookingsTabsProps = {
  value: TabKey;
  onChange: (tab: TabKey) => void;
  colors: {
    text: string;
    border: string;
    accent: string;
  };
};

export const BookingsTabs: React.FC<BookingsTabsProps> = ({ value, onChange, colors }) => (
  <View style={styles.tabs}>
    <Button
      variant="ghost"
      style={[
        styles.tabButton,
        value === 'active' ? { borderColor: colors.accent } : { borderColor: colors.border },
      ]}
      onPress={() => onChange('active')}
    >
      <Typography
        style={[
          styles.tabText,
          value === 'active' ? { color: colors.accent } : { color: colors.text },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        Активні
      </Typography>
    </Button>
    <Button
      variant="ghost"
      style={[
        styles.tabButton,
        value === 'past' ? { borderColor: colors.accent } : { borderColor: colors.border },
      ]}
      onPress={() => onChange('past')}
    >
      <Typography
        style={[
          styles.tabText,
          value === 'past' ? { color: colors.accent } : { color: colors.text },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        Минулі
      </Typography>
    </Button>
    <Button
      variant="ghost"
      style={[
        styles.tabButton,
        value === 'cancelled' ? { borderColor: colors.accent } : { borderColor: colors.border },
      ]}
      onPress={() => onChange('cancelled')}
    >
      <Typography
        style={[
          styles.tabText,
          value === 'cancelled' ? { color: colors.accent } : { color: colors.text },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        Скасовані
      </Typography>
    </Button>
  </View>
);

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: s(8),
    paddingHorizontal: s(20),
    paddingTop: s(16),
    marginTop: s(2),
  },
  tabButton: {
    flex: 1,
    height: s(37),
    borderRadius: s(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  tabText: {
    fontSize: s(14),
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default BookingsTabs;
