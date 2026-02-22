// Screen: OwnerReviewsScreen. Owner reviews list styled to match the design.
import React, { useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import nomessageBlack from '@/assets/images/nomessage_black.png';
import nomessageWhite from '@/assets/images/nomessage_white.png';
import { BookingRepository } from '@/data/bookings';
import { AppLayout } from '@/layout/AppLayout';
import { ScreenShell, Card, Typography, Input, IconButton } from '@/ui';
import { useTranslation } from '@/i18n';
import { Routes } from '@/navigation/routes';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { spacing, radius } from '@/theme';
import { useTheme } from '@/theme';
import { mockOffers, mockReviews } from '@/utils/mockData';
import { useAuthStore } from '@/store/authStore';
import HomeFooter from '@/components/Home/HomeFooter';
import { BOTTOM_NAV_ITEMS } from '@/components/Home/homeNavigationData';
import { s } from '@/utils/scale';
import { messageService } from '@/services/messages';

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type OwnerReviewsRoute = RouteProp<RootStackParamList, Routes.OwnerReviews>;

type ReviewView = {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  avatarColor: string;
  offerId: string;
  bookingId?: string;
  reply?: string;
};

export const OwnerReviewsScreen = () => {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<OwnerReviewsRoute>();
  const { t } = useTranslation();
  const { tokens, mode } = useTheme();
  const owner = useAuthStore((s) => s.user);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const avatarPalette = useMemo(
    () => [tokens.success, tokens.accent, tokens.warning, tokens.error],
    [tokens.success, tokens.accent, tokens.warning, tokens.error],
  );
  const selectedOfferId = route.params?.offerId;

  const ownerOffers = useMemo(
    () => mockOffers.filter((o) => o.ownerId === (owner?.id ?? 'owner-1')),
    [owner?.id],
  );
  const selectedOffer = useMemo(
    () => ownerOffers.find((offer) => offer.id === selectedOfferId),
    [ownerOffers, selectedOfferId],
  );

  const sourceReviews = useMemo(() => {
    if (selectedOfferId) {
      return selectedOffer?.reviews ?? [];
    }

    return ownerOffers.flatMap((offer) => offer.reviews ?? []);
  }, [ownerOffers, selectedOffer?.reviews, selectedOfferId]);

  const reviews: ReviewView[] = sourceReviews.map((r, index) => ({
    id: r.id,
    userName: r.userName ?? t('owner.reviews.title'),
    rating: Math.max(1, Math.min(5, Math.round(r.rating ?? 0))),
    comment: r.comment ?? '',
    avatarColor: avatarPalette[index % avatarPalette.length],
    offerId: r.offerId,
    bookingId: r.bookingId,
    reply: r.reply,
  }));

  const styles = useMemo(() => getStyles(tokens), [tokens]);
  const emptyImage = mode === 'dark' ? nomessageWhite : nomessageBlack;

  const handleSendReply = async (review: ReviewView) => {
    const replyText = replyDrafts[review.id]?.trim();
    if (!replyText) return;

    const reviewRecord = mockReviews.find((item) => item.id === review.id);
    if (reviewRecord) {
      reviewRecord.reply = replyText;
    }

    const reviewOffer = mockOffers.find((offer) => offer.id === review.offerId);
    const offerReviewIndex = reviewOffer?.reviews?.findIndex((item) => item.id === review.id) ?? -1;
    if (reviewOffer && reviewOffer.reviews && offerReviewIndex >= 0) {
      reviewOffer.reviews[offerReviewIndex] = {
        ...reviewOffer.reviews[offerReviewIndex],
        reply: replyText,
      };
    }

    const booking = review.bookingId
      ? await BookingRepository.getById(review.bookingId)
      : undefined;
    const receiverId = booking?.userId ?? 'user-1';
    const offerTitle = reviewOffer?.title ?? t('owner.reviews.title');

    await messageService.addMessage({
      userId: receiverId,
      title: t('owner.reviews.title'),
      body: `${offerTitle}: ${t('owner.reviews.replyNotification')}`,
    });

    setReplyDrafts((prev) => ({ ...prev, [review.id]: '' }));
  };

  const footerItems = BOTTOM_NAV_ITEMS.map((item) => ({
    ...item,
    label: item.id === 'bookings' ? t('owner.tabs.bookings') : item.label,
    onPress: () => {
      if (item.id === 'home') {
        navigation.navigate(Routes.Main, { screen: Routes.Home });
        return;
      }
      if (item.id === 'messages') {
        navigation.navigate(Routes.Main, { screen: Routes.Notifications });
        return;
      }
      if (item.id === 'bookings') {
        navigation.navigate(Routes.Main, { screen: Routes.Bookings });
        return;
      }
      navigation.navigate(Routes.Main, { screen: Routes.Profile });
    },
  }));

  return (
    <AppLayout
      variant="stack"
      header={false}
      footer={<HomeFooter items={footerItems} activeId="profile" />}
    >
      <ScreenShell
        title={t('owner.reviews.title')}
        onBack={() => navigation.goBack()}
        contentStyle={styles.content}
        showKeys={false}
        rightSlot={
          <IconButton
            onPress={() => {}}
            variant="ghost"
            size="sm"
            icon={<MaterialCommunityIcons name="magnify" size={s(22)} color={tokens.textPrimary} />}
          />
        }
      >
        <View style={styles.panel}>
          {reviews.length === 0 ? (
            <View style={styles.emptyStateFull}>
              <View style={styles.emptyState}>
                <Image source={emptyImage} style={styles.emptyIcon} />
                <Typography variant="body" tone="secondary" style={styles.empty}>
                  {selectedOfferId ? t('owner.reviews.emptyForObject') : t('owner.reviews.empty')}
                </Typography>
              </View>
            </View>
          ) : (
            <FlatList
              data={reviews}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.itemBlock}>
                  <Card padding="md" style={styles.card}>
                    <View style={styles.header}>
                      <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
                        <Typography variant="subtitle" tone="onAccent">
                          {item.userName.slice(0, 1).toUpperCase()}
                        </Typography>
                      </View>
                      <View style={styles.headerText}>
                        <Typography variant="subtitle" tone="primary">
                          {item.userName}
                        </Typography>
                        <View style={styles.starsRow}>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <MaterialCommunityIcons
                              key={`${item.id}-star-${index}`}
                              name="star"
                              size={s(16)}
                              color={index < item.rating ? tokens.accent : tokens.borderSubtle}
                            />
                          ))}
                        </View>
                      </View>
                    </View>
                    <Typography variant="body" tone="primary" style={styles.comment}>
                      {item.comment}
                    </Typography>
                    {item.reply ? (
                      <View style={styles.replyBlock}>
                        <Typography variant="caption" tone="secondary">
                          {t('offer.ownerReply')}
                        </Typography>
                        <Typography variant="body" tone="primary">
                          {item.reply}
                        </Typography>
                      </View>
                    ) : null}
                  </Card>

                  <Input
                    value={replyDrafts[item.id] ?? ''}
                    onChangeText={(value) =>
                      setReplyDrafts((prev) => ({ ...prev, [item.id]: value }))
                    }
                    placeholder={t('owner.reviews.leaveComment')}
                    editable={!item.reply}
                    rightSlot={
                      <MaterialCommunityIcons
                        name="send-outline"
                        size={s(18)}
                        color={tokens.textPrimary}
                      />
                    }
                    onRightSlotPress={
                      item.reply
                        ? undefined
                        : () => {
                            void handleSendReply(item);
                          }
                    }
                    containerStyle={styles.replyInputContainer}
                    inputStyle={styles.replyInput}
                  />
                </View>
              )}
            />
          )}
        </View>
      </ScreenShell>
    </AppLayout>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: 0,
      paddingVertical: 0,
      flex: 1,
    },
    panel: {
      flex: 1,
      backgroundColor: tokens.bgPanel,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.md,
    },
    list: {
      gap: spacing.md,
      paddingBottom: spacing.xl,
    },
    itemBlock: {
      gap: spacing.sm,
    },
    card: {
      gap: spacing.sm,
      borderRadius: radius.lg,
      backgroundColor: tokens.bgField,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    avatar: {
      width: s(30),
      height: s(30),
      borderRadius: radius.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerText: {
      flex: 1,
      gap: spacing.xs,
    },
    starsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs / 2,
    },
    comment: {
      lineHeight: s(18),
    },
    replyBlock: {
      marginTop: spacing.xs,
      paddingTop: spacing.xs,
      gap: spacing.xs,
      borderTopWidth: 1,
      borderTopColor: tokens.borderSubtle,
    },
    replyInputContainer: {
      width: '100%',
    },
    replyInput: {
      borderRadius: radius.round,
      borderWidth: 1,
      borderColor: tokens.border,
      backgroundColor: tokens.bgPanel,
      minHeight: s(36),
      paddingVertical: spacing.xs,
    },
    empty: {
      textAlign: 'center',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md,
    },
    emptyStateFull: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyIcon: {
      width: s(156),
      height: s(156),
      resizeMode: 'contain',
    },
  });

export default OwnerReviewsScreen;
