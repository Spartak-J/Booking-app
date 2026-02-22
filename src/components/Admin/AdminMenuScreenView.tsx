import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import KeysBackground from '@/components/layout/KeysBackground';
import { spacing, useTheme } from '@/theme';
import { HeaderBar, ListItem, ScreenContainer } from '@/ui';
import { s } from '@/utils/scale';

export type AdminMenuItem = {
  id: string;
  title: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  onPress: () => void;
  highlighted?: boolean;
};

type Props = {
  title: string;
  avatarInitial: string;
  items: AdminMenuItem[];
  onBack: () => void;
};

export const AdminMenuScreenView: React.FC<Props> = ({ title, avatarInitial, items, onBack }) => {
  const { tokens } = useTheme();
  const styles = useMemo(() => getStyles(tokens), [tokens]);

  return (
    <ScreenContainer edges={['top', 'left', 'right']} contentContainerStyle={styles.root}>
      <KeysBackground />

      <View style={styles.content}>
        <HeaderBar
          title={title}
          onBack={onBack}
          showBack
          showMenu={false}
          showSearch={false}
          showAvatar
          avatarInitial={avatarInitial}
        />

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.list}>
            {items.map((item) => (
              <ListItem
                key={item.id}
                title={item.title}
                onPress={item.onPress}
                style={item.highlighted ? styles.highlightedItem : undefined}
                left={
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={s(18)}
                    color={tokens.textPrimary}
                  />
                }
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
    content: {
      flex: 1,
      zIndex: 2,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      paddingBottom: spacing.xl,
    },
    list: {
      gap: spacing.md,
    },
    scroll: {
      paddingTop: spacing.xl,
      paddingBottom: s(220),
      gap: spacing.xl,
    },
    highlightedItem: {
      backgroundColor: tokens.bgPanel,
    },
  });

export default AdminMenuScreenView;
