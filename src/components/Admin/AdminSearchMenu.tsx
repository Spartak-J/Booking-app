import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { radius, useTheme } from '@/theme';
import { Input } from '@/ui';
import { s } from '@/utils/scale';

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  placeholder: string;
  onSearchPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const AdminSearchMenu: React.FC<Props> = ({
  query,
  onQueryChange,
  placeholder,
  onSearchPress,
  style,
}) => {
  const { tokens } = useTheme();
  const styles = useMemo(() => getStyles(tokens), [tokens]);

  return (
    <View style={style}>
      <Input
        value={query}
        onChangeText={onQueryChange}
        placeholder={placeholder}
        containerStyle={styles.input}
        inputStyle={styles.inputField}
        rightSlot={
          <View style={styles.searchIconBubble}>
            <MaterialCommunityIcons name="magnify" size={s(16)} color={tokens.textOnAccent} />
          </View>
        }
        onRightSlotPress={onSearchPress}
      />
    </View>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    input: {
      width: '100%',
    },
    inputField: {
      borderRadius: radius.xl,
    },
    searchIconBubble: {
      width: s(28),
      height: s(28),
      borderRadius: radius.round,
      backgroundColor: tokens.accent,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default AdminSearchMenu;
