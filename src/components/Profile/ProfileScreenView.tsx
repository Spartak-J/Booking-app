// Component: ProfileScreenView. Used in: ProfileScreen.
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { HeaderBar, Button, ListItem, Typography } from '@/ui';
import { useTheme } from '@/theme';
import { spacing, radius, typography } from '@/theme';
import { useTranslation } from '@/i18n';
import KeysBackground from '@/components/layout/KeysBackground';
import { s } from '@/utils/scale';

type ProfileScreenViewProps = {
  userName?: string;
  userInitial: string;
  onBack: () => void;
  onOpenAccount: () => void;
  onOpenPayment: () => void;
  onOpenTrips: () => void;
  onLogout: () => void;
};

export const ProfileScreenView: React.FC<ProfileScreenViewProps> = ({
  userName,
  userInitial,
  onBack,
  onOpenAccount,
  onOpenPayment,
  onOpenTrips,
  onLogout,
}) => {
  const { tokens } = useTheme();
  const styles = useMemo(() => getStyles(tokens), [tokens]);
  const { t } = useTranslation();
  const contentStyle = useMemo(() => [styles.content], [styles.content]);

  const greetingText = userName ? `${t('profile.greeting')} ${userName}` : t('profile.greeting');
  const initial = userInitial || (userName ? userName.charAt(0).toUpperCase() : '');

  return (
    <View style={styles.root}>
      <HeaderBar title={t('profile.title')} onBack={onBack} />

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
          <ListItem title={t('profile.menu.account')} onPress={onOpenAccount} />
          <ListItem title={t('profile.menu.payment')} onPress={onOpenPayment} />
          <ListItem title={t('profile.menu.trips')} onPress={onOpenTrips} />
          <ListItem title={t('profile.menu.help')} />
          <ListItem title={t('profile.menu.privacy')} />
        </View>

        <Button
          title={t('profile.logout')}
          onPress={onLogout}
          variant="ghost"
          style={styles.logoutButton}
        />
      </ScrollView>

      <KeysBackground />
    </View>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  // LEGACY STYLES: contains hardcoded typography values
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: tokens.bgScreen,
    },
    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
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
