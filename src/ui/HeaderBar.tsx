//src/ui/HeaderBar: Для отображения хедера (верхней панели) с заголовком и кнопками "назад" и "меню".
import React, { useMemo } from 'react';
import { Pressable, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { radius } from '@/theme';
import { useTheme } from '@/theme';
import { s } from '@/utils/scale';
import Typography from './Typography';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

type HeaderBarProps = {
  title?: string;
  onBack?: () => void;
  onSearch?: () => void;
  onMenu?: () => void;
  avatarInitial?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showMenu?: boolean;
  showAvatar?: boolean;
  backIconName?: IconName;
  backIconSize?: number;
  searchIconSize?: number;
  menuIconSize?: number;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  backStyle?: StyleProp<ViewStyle>;
  searchStyle?: StyleProp<ViewStyle>;
  menuStyle?: StyleProp<ViewStyle>;
};

const DEFAULT_BACK_ICON: IconName = 'arrow-left';

const HeaderBar = ({
  title,
  onBack,
  onSearch,
  onMenu,
  avatarInitial,
  showBack,
  showSearch,
  showMenu,
  showAvatar,
  backIconName = DEFAULT_BACK_ICON,
  backIconSize,
  searchIconSize,
  menuIconSize,
  style,
  titleStyle,
  backStyle,
  searchStyle,
  menuStyle,
}: HeaderBarProps) => {
  const { tokens } = useTheme();
  const palette = useMemo(
    () => ({
      background: tokens.bgHeader,
      icon: tokens.iconPrimary,
      text: tokens.textPrimary,
      avatarBg: tokens.success,
      avatarText: tokens.textOnAccent,
    }),
    [tokens],
  );
  const styles = useMemo(() => getStyles(palette), [palette]);

  const renderBack = showBack ?? Boolean(onBack);
  const renderSearch = showSearch ?? Boolean(onSearch);
  const renderMenu = showMenu ?? Boolean(onMenu);
  const renderAvatar = showAvatar ?? Boolean(avatarInitial);

  return (
    <View style={[styles.container, style]}>
      {renderBack && (
        <Pressable
          onPress={onBack}
          style={[styles.backButton, backStyle]}
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name={backIconName}
            size={backIconSize ?? s(18)}
            color={palette.icon}
          />
        </Pressable>
      )}

      {title ? (
        <Typography
          variant="body"
          style={[styles.title, titleStyle]}
          numberOfLines={1}
          ellipsizeMode="tail"
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {title}
        </Typography>
      ) : null}

      {renderSearch && (
        <Pressable
          onPress={onSearch}
          style={[styles.searchButton, renderAvatar ? styles.searchButtonWithAvatar : null, searchStyle]}
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name="magnify"
            size={searchIconSize ?? s(18)}
            color={palette.icon}
          />
        </Pressable>
      )}

      {renderAvatar && avatarInitial ? (
        <View style={[styles.avatarBubble, !renderMenu ? styles.avatarBubbleNoMenu : null]}>
          <Typography variant="subtitle" style={styles.avatarText}>
            {avatarInitial}
          </Typography>
        </View>
      ) : null}

      {renderMenu && (
        <Pressable
          onPress={onMenu}
          style={[styles.menuButton, menuStyle]}
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="menu" size={menuIconSize ?? s(20)} color={palette.icon} />
        </Pressable>
      )}
    </View>
  );
};

type Palette = {
  background: string;
  icon: string;
  text: string;
  avatarBg: string;
  avatarText: string;
};

const getStyles = (palette: Palette) =>
  StyleSheet.create({
    container: {
      height: s(36),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.background,
      borderRadius: radius.md,
    },
    backButton: {
      position: 'absolute',
      left: s(19),
      top: s(3),
      width: s(24),
      height: s(24),
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchButton: {
      position: 'absolute',
      right: s(52),
      top: s(3),
      width: s(24),
      height: s(24),
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchButtonWithAvatar: {
      right: s(92),
    },
    avatarBubble: {
      position: 'absolute',
      right: s(52),
      top: s(2),
      width: s(32),
      height: s(32),
      borderRadius: radius.round,
      backgroundColor: palette.avatarBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarBubbleNoMenu: {
      right: s(11),
    },
    avatarText: {
      color: palette.avatarText,
    },
    menuButton: {
      position: 'absolute',
      right: s(11),
      top: s(2),
      width: s(32),
      height: s(32),
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      color: palette.text,
      fontSize: s(16),
      fontWeight: '700',
    },
  });

export default HeaderBar;
