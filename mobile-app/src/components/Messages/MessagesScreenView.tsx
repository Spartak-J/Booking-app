import React, { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import nomessageBlack from '@/assets/images/nomessage_black.png';
import nomessageWhite from '@/assets/images/nomessage_white.png';
import roomImage from '@/assets/images/WelcomeScreen.png';
import { useTranslation } from '@/i18n';
import { useTheme, spacing, radius } from '@/theme';
import { messageService } from '@/services/messages';
import type { MessageItem } from '@/services/messages/message.types';
import { useAuthStore } from '@/store/authStore';
import { Typography, ScreenShell } from '@/ui';

type MessagesScreenViewProps = {
  onBack: () => void;
};

const ICON_SIZE = 198;

const MessagesScreenView: React.FC<MessagesScreenViewProps> = ({ onBack }) => {
  const { tokens, colors, mode } = useTheme();
  const { t } = useTranslation();
  const userId = useAuthStore((state) => state.user?.id);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const isDark = mode === 'dark' || colors.background === colors.bgDark;
  const palette = useMemo(
    () => ({
      background: tokens.bgScreen,
      text: tokens.textPrimary,
      icon: tokens.textPrimary,
      image: isDark ? nomessageWhite : nomessageBlack,
      cardBg: isDark ? tokens.bgCard : tokens.bgSurface,
      success: tokens.success,
      error: tokens.error,
      subtitle: tokens.textSecondary,
    }),
    [isDark, tokens],
  );
  const styles = useMemo(() => getStyles(palette), [palette]);

  useEffect(() => {
    let mounted = true;
    messageService.getMessages().then((data) => {
      if (mounted) {
        setMessages(
          userId ? data.filter((message) => !message.userId || message.userId === userId) : data,
        );
      }
    });
    return () => {
      mounted = false;
    };
  }, [userId]);

  return (
    <ScreenShell title={t('messages.title')} onBack={onBack} showKeys>
      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <Image source={palette.image} style={styles.emptyIcon} />
          <Typography variant="caption" style={styles.emptyText}>
            {t('messages.empty')}
          </Typography>
        </View>
      ) : (
        <View style={styles.list}>
          {messages.map((m) => (
            <View key={m.id} style={styles.card}>
              <View style={styles.cardRow}>
                <View style={styles.avatar}>
                  <Image source={roomImage} style={styles.avatarImage} />
                </View>
                <View style={styles.cardTextCol}>
                  <Typography
                    variant="body"
                    style={[
                      styles.cardTitle,
                      m.tone === 'error'
                        ? styles.cardTitleError
                        : m.tone === 'success'
                          ? styles.cardTitleSuccess
                          : null,
                    ]}
                  >
                    {m.title}
                  </Typography>
                  <Typography variant="caption" style={styles.cardBody}>
                    {m.body}
                  </Typography>
                  <Typography variant="caption" style={styles.cardDate}>
                    {new Date(m.createdAt).toLocaleDateString('uk-UA')}
                  </Typography>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScreenShell>
  );
};

const getStyles = (palette: {
  background: string;
  text: string;
  icon: string;
  cardBg: string;
  success: string;
  error: string;
  subtitle: string;
}) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: palette.background,
    },
    header: {
      height: spacing.xxl + spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.sm,
    },
    headerButton: {
      width: spacing.xl + spacing.sm,
      height: spacing.xl + spacing.sm,
      borderRadius: radius.round,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    headerTitle: {
      color: palette.text,
      textAlign: 'center',
      flex: 1,
    },
    headerPlaceholder: {
      width: spacing.xl,
      height: spacing.xl,
      opacity: 0,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md,
    },
    emptyIcon: {
      width: ICON_SIZE,
      height: ICON_SIZE,
      resizeMode: 'contain',
    },
    emptyText: {
      color: palette.text,
      textAlign: 'center',
    },
    list: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      gap: spacing.md,
    },
    card: {
      padding: spacing.md,
      borderRadius: radius.md,
      backgroundColor: palette.cardBg,
      gap: spacing.xs,
    },
    cardRow: {
      flexDirection: 'row',
      gap: spacing.md,
      alignItems: 'center',
    },
    avatar: {
      width: spacing.xxl,
      height: spacing.xxl,
      borderRadius: radius.round,
      backgroundColor: palette.background,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: palette.subtitle,
      overflow: 'hidden',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    cardTextCol: {
      flex: 1,
      gap: spacing.xs,
    },
    cardTitle: {
      color: palette.text,
    },
    cardTitleSuccess: {
      color: palette.success,
    },
    cardTitleError: {
      color: palette.error,
    },
    cardBody: {
      color: palette.subtitle,
    },
    cardDate: {
      color: palette.subtitle,
    },
  });

export default MessagesScreenView;
