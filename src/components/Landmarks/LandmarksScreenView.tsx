import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Button, HeaderBar, Input, ScreenContainer } from '@/ui';
import { radius, spacing, useTheme, withOpacity } from '@/theme';
import { s, SCREEN_WIDTH } from '@/utils/scale';
import { useTranslation } from '@/i18n';

type Props = {
  cityQuery: string;
  onCityQueryChange: (value: string) => void;
  onBack: () => void;
  onMenu: () => void;
  onSearch: () => void;
  menuSheet?: React.ReactNode;
};

export const LandmarksScreenView: React.FC<Props> = ({
  cityQuery,
  onCityQueryChange,
  onBack,
  onMenu,
  onSearch,
  menuSheet,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <ScreenContainer
      style={styles.container}
      edges={['top', 'left', 'right']}
      contentContainerStyle={styles.content}
      withBackground={false}
    >
      <View style={styles.topSection}>
        <HeaderBar
          title={t('landmarks.title')}
          onBack={onBack}
          onMenu={onMenu}
          iconColor={colors.black}
          showBack
          showSearch={false}
          showMenu
          style={styles.header}
          titleStyle={styles.headerTitle}
          backStyle={styles.backButton}
          menuStyle={styles.menuButton}
        />

        <View style={styles.inlineSearch}>
          <View style={styles.inlineSearchCityIconWrap}>
            <MaterialCommunityIcons
              name="city-variant-outline"
              size={s(16)}
              color={colors.surfaceLight}
            />
          </View>
          <Input
            value={cityQuery}
            onChangeText={onCityQueryChange}
            placeholder={t('landmarks.cityPlaceholder')}
            containerStyle={styles.inlineSearchInputContainer}
            inputStyle={styles.inlineSearchInput}
          />
          <Button
            size="small"
            variant="primary"
            onPress={onSearch}
            style={styles.inlineSearchButton}
          >
            <MaterialCommunityIcons name="magnify" size={s(18)} color={colors.surfaceLight} />
          </Button>
        </View>
      </View>

      {menuSheet}
    </ScreenContainer>
  );
};

const getStyles = (colors: Record<string, string>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    content: {
      flex: 1,
    },
    topSection: {
      width: SCREEN_WIDTH,
      paddingTop: spacing.xs,
      zIndex: 2,
    },
    header: {
      width: s(412),
      height: s(36),
      borderRadius: 0,
      backgroundColor: 'transparent',
    },
    headerTitle: {
      color: colors.black,
    },
    backButton: {
      width: s(24),
      height: s(24),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.round,
      backgroundColor: 'transparent',
    },
    menuButton: {
      width: s(32),
      height: s(32),
      borderRadius: s(16),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    inlineSearch: {
      width: s(374),
      height: s(50),
      alignSelf: 'center',
      marginTop: spacing.md,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.surfaceLight,
      backgroundColor: withOpacity(colors.bgCard, 0.4),
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: spacing.sm,
      zIndex: 1,
    },
    inlineSearchCityIconWrap: {
      width: s(24),
      height: s(24),
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: spacing.xs,
    },
    inlineSearchInputContainer: {
      flex: 1,
      marginHorizontal: spacing.xs,
      gap: 0,
    },
    inlineSearchInput: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      color: colors.surfaceLight,
      fontSize: s(14),
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    inlineSearchButton: {
      height: s(36),
      width: s(36),
      borderRadius: radius.round,
      minWidth: s(36),
      paddingHorizontal: 0,
    },
  });

export default LandmarksScreenView;
