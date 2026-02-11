// Component: ProfileScreenView. Used in: ProfileScreen.
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ListItem, ScreenShell, Typography } from '@/ui';
import { useTheme } from '@/theme';
import { spacing, radius, typography } from '@/theme';
import { useTranslation } from '@/i18n';
import { s } from '@/utils/scale';

type ProfileScreenViewProps = {
  userName?: string;
  userInitial: string;
  onBack: () => void;
  menuItems: Array<{
    id: string;
    title: string;
    icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
    onPress?: () => void;
  }>;
};

export const ProfileScreenView: React.FC<ProfileScreenViewProps> = ({
  userName,
  userInitial,
  onBack,
  menuItems,
}) => {
  const { tokens } = useTheme();
  const styles = useMemo(() => getStyles(tokens), [tokens]);
  const { t } = useTranslation();
  const contentStyle = useMemo(() => [styles.content], [styles.content]);

  const greetingText = userName ? `${t('profile.greeting')} ${userName}` : t('profile.greeting');
  const initial = userInitial || (userName ? userName.charAt(0).toUpperCase() : '');

  return (
    <ScreenShell title={t('profile.title')} onBack={onBack} showKeys contentStyle={styles.content}>
      <ScrollView contentContainerStyle={contentStyle} showsVerticalScrollIndicator={false}>
        <View style={styles.greetingRow}>
          <View style={styles.avatar}>
            <Typography variant="h2" tone="primary" style={styles.avatarText}>
              {initial}
            </Typography>
          </View>
          <Typography
            variant="subtitle"
            tone="primary"
            style={styles.greetingText}
            numberOfLines={2}
            ellipsizeMode="tail"
            adjustsFontSizeToFit
            minimumFontScale={0.85}
          >
            {greetingText}
          </Typography>
        </View>

        <View style={styles.section}>
          {menuItems.map((item) => (
            <ListItem
              key={item.id}
              title={item.title}
              onPress={item.onPress}
              left={<MaterialCommunityIcons name={item.icon} size={s(18)} color={tokens.textPrimary} />}
            />
          ))}
        </View>
      </ScrollView>
    </ScreenShell>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  // LEGACY STYLES: contains hardcoded typography values
  StyleSheet.create({
    content: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      gap: spacing.lg,
    },
    greetingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    avatar: {
      width: s(56),
      height: s(56),
      borderRadius: radius.round,
      backgroundColor: tokens.bgPanel,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      ...(typography.h2 as object),
      color: tokens.textPrimary,
    },
    greetingText: {
      flex: 1,
      color: tokens.textPrimary,
    },
    section: {
      gap: spacing.md,
    },
    logoutButton: {
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.lg,
    },
  });

export default ProfileScreenView;
