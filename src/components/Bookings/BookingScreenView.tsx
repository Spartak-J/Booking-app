// Component: BookingScreenView. Used in: BookingScreen.
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  AppState,
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BookingDetailsSection } from '@/components/Booking/BookingDetailsSection';
import { BookingGuestInfo } from '@/components/Booking/BookingGuestInfo';
import { BookingPaymentMethod, PaymentMethod } from '@/components/Booking/BookingPaymentMethod';
import { BookingTripPurpose } from '@/components/Booking/BookingTripPurpose';
import { bookingService } from '@/services/bookingService';
import { useTheme } from '@/theme';
import { formatPrice } from '@/utils/price';
import { PaymentType, Offer } from '@/types';
import { useTranslation } from '@/i18n';
import { useAuthStore } from '@/store/authStore';
import { Button, LineWithDots, Loader, Modal, Typography } from '@/ui';
import { radius } from '@/theme';
import { PaymentRepository } from '@/data/payment';
import type { PaymentCard } from '@/data/payment/types';
import { paymentService } from '@/services/payment';
import type { PaymentMethod as ApiPaymentMethod, PaymentResult } from '@/services/payment';

const DESIGN_WIDTH = 412;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / DESIGN_WIDTH;
const s = (value: number) => value * scale;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const waitForAppReturn = (timeoutMs: number) =>
  new Promise<void>((resolve) => {
    if (AppState.currentState === 'active') {
      resolve();
      return;
    }

    let resolved = false;
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && !resolved) {
        resolved = true;
        sub.remove();
        resolve();
      }
    });

    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        sub.remove();
        resolve();
      }
    }, timeoutMs);
  });

const mapBookingPaymentToApiMethod = (method: PaymentMethod): ApiPaymentMethod => {
  if (method === 'googlePay') return 'gpay';
  if (method === 'applePay') return 'apay';
  if (method === 'paypal') return 'subscribe';
  return 'pay';
};

type BookingScreenViewProps = {
  offerId: string;
  offer?: Offer;
  isLoading: boolean;
  onBack: () => void;
  onBookingSuccess: (payload: {
    bookingId: string;
    offerId: string;
    offerTitle?: string;
    totalPrice?: number;
  }) => void;
};

type CardPaymentFlow = 'saved' | 'liqpay';

export const BookingScreenView: React.FC<BookingScreenViewProps> = ({
  offerId,
  offer,
  isLoading,
  onBack,
  onBookingSuccess,
}) => {
  const { colors, mode } = useTheme();
  const { t } = useTranslation();
  const userId = useAuthStore((state) => state.user?.id);
  const isDark = mode === 'dark' || colors.background === colors.bgDark;
  const headerTextColor = isDark ? colors.surfaceLight : colors.textPrimary;
  const styles = useMemo(
    () => getStyles(colors, isDark, headerTextColor),
    [colors, isDark, headerTextColor],
  );
  const queryClient = useQueryClient();

  const [dates, setDates] = useState<{ from: string; to: string }>(() => ({
    from: new Date().toISOString().slice(0, 10),
    to: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  }));
  const [guests, setGuests] = useState<number | undefined>(2);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [tripPurpose, setTripPurpose] = useState<'leisure' | 'work'>('leisure');
  const [comment, setComment] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | undefined>(undefined);
  const [isCardPickerOpen, setIsCardPickerOpen] = useState(false);
  const [cardPaymentFlow, setCardPaymentFlow] = useState<CardPaymentFlow>('liqpay');
  const paymentType: PaymentType =
    paymentMethod === 'cash' ? 'cash' : paymentMethod === 'card' ? 'card' : 'online';
  const selectedCard = useMemo(
    () => cards.find((card) => card.id === selectedCardId),
    [cards, selectedCardId],
  );

  const nights = useMemo(() => {
    const start = new Date(dates.from).getTime();
    const end = new Date(dates.to).getTime();
    const diff = end - start;
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 1;
  }, [dates]);

  const handleDatesChange = (next: { from: string; to: string } | undefined) => {
    if (next) {
      setDates(next);
    } else {
      setDates({ from: '', to: '' });
    }
  };

  useEffect(() => {
    PaymentRepository.getCards(userId ?? 'guest')
      .then((list) => {
        setCards(list);
        if (list.length > 0 && !selectedCardId) {
          setSelectedCardId(list[0].id);
          setCardPaymentFlow('saved');
        }
      })
      .catch(() => setCards([]));
  }, [userId]);

  const mutation = useMutation({
    mutationFn: async () => {
      const totalAmount = Math.max(1, Math.round((offer?.pricePerNight ?? 0) * nights));
      const useLiqPayFlow =
        paymentMethod !== 'cash' && !(paymentMethod === 'card' && cardPaymentFlow === 'saved');

      if (paymentMethod === 'card' && cardPaymentFlow === 'saved' && cards.length === 0) {
        throw new Error(t('profile.payment.noCard'));
      }

      if (paymentMethod === 'card' && cardPaymentFlow === 'saved') {
        if (!selectedCardId) {
          throw new Error(t('profile.payment.noCard'));
        }

        let savedResult: PaymentResult = await PaymentRepository.chargeSavedCard({
          userId: userId ?? 'guest',
          cardId: selectedCardId,
          bookingId: `draft-${offerId}-${Date.now()}`,
          amount: totalAmount,
          currency: 'UAH',
        });

        if (savedResult.status === 'hold') {
          savedResult = await paymentService.confirmHold(savedResult.paymentId);
        }

        if (savedResult.status !== 'paid') {
          for (let attempt = 0; attempt < 15; attempt += 1) {
            await wait(2000);
            savedResult = await paymentService.getStatus(savedResult.paymentId);
            if (savedResult.status === 'hold') {
              savedResult = await paymentService.confirmHold(savedResult.paymentId);
            }
            if (
              savedResult.status === 'paid' ||
              savedResult.status === 'failed' ||
              savedResult.status === 'cancelled'
            ) {
              break;
            }
          }
        }

        if (savedResult.status !== 'paid') {
          throw new Error('Оплату не вдалося провести.');
        }
      }

      if (useLiqPayFlow) {
        const paymentResult = await paymentService.createPayment({
          bookingId: `draft-${offerId}-${Date.now()}`,
          amount: totalAmount,
          currency: 'UAH',
          method: mapBookingPaymentToApiMethod(paymentMethod),
        });

        if (paymentResult.redirectUrl) {
          await Linking.openURL(paymentResult.redirectUrl);
          await waitForAppReturn(180000);
        }

        let latest = paymentResult;

        if (latest.status === 'hold') {
          latest = await paymentService.confirmHold(latest.paymentId);
        }

        if (latest.status !== 'paid') {
          for (let attempt = 0; attempt < 15; attempt += 1) {
            await wait(2000);
            latest = await paymentService.getStatus(latest.paymentId);
            if (latest.status === 'hold') {
              latest = await paymentService.confirmHold(latest.paymentId);
            }
            if (
              latest.status === 'paid' ||
              latest.status === 'failed' ||
              latest.status === 'cancelled'
            ) {
              break;
            }
          }
        }

        if (latest.status !== 'paid') {
          if (latest.status === 'failed' || latest.status === 'cancelled') {
            throw new Error('Оплату не вдалося провести.');
          }
          throw new Error(
            'Платіж ще обробляється. Перевірте статус платежу і повторіть бронювання.',
          );
        }
      }

      return bookingService.create({
        offerId,
        checkIn: dates.from,
        checkOut: dates.to,
        guests: guests ?? 1,
        paymentType,
        userId: userId ?? 'user-1',
      });
    },
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', userId ?? ''] });
      queryClient.invalidateQueries({ queryKey: ['owner-bookings'] });
      onBookingSuccess({
        bookingId: booking.id,
        offerId,
        offerTitle: offer?.title,
        totalPrice: booking.totalPrice,
      });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? t(err.message) : String(err);
      Alert.alert(t('booking.error'), message);
    },
  });

  if (isLoading || !offer) {
    return (
      <View style={styles.screen}>
        <View style={styles.loading}>
          <Loader variant="skeleton" height={200} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={s(20)} color={headerTextColor} />
          </Pressable>
          <Typography variant="body" style={styles.headerTitle}>
            {t('nav.booking')}
          </Typography>
        </View>
        <LineWithDots width={s(304)} color={headerTextColor} style={styles.headerUnderline} />

        <View style={styles.warningRow}>
          <View style={styles.warningIcon}>
            <AlertCircle size={s(14)} color={colors.warning} />
          </View>
          <Typography variant="caption" tone="primary" style={styles.warningText}>
            {t('booking.warning')}
          </Typography>
        </View>

        <Typography variant="body" tone="warning" style={styles.requiredNote}>
          {t('booking.requiredNote')}
        </Typography>

        <BookingGuestInfo
          fullName={fullName}
          email={email}
          phone={phone}
          country={country}
          onChangeName={setFullName}
          onChangeEmail={setEmail}
          onChangePhone={setPhone}
          onChangeCountry={setCountry}
        />
        <BookingDetailsSection
          dates={dates}
          onChangeDates={handleDatesChange}
          guests={guests}
          onChangeGuests={setGuests}
          comment={comment}
          onChangeComment={setComment}
        />
        <BookingTripPurpose value={tripPurpose} onChange={setTripPurpose} />
        <BookingPaymentMethod value={paymentMethod} onChange={setPaymentMethod} />
        {paymentMethod === 'card' ? (
          <View style={styles.cardsBlock}>
            <View style={styles.cardFlowRow}>
              <Button
                variant="ghost"
                onPress={() => setCardPaymentFlow('saved')}
                style={[
                  styles.cardFlowButton,
                  cardPaymentFlow === 'saved' && styles.cardFlowButtonActive,
                ]}
              >
                <Typography variant="caption" tone="primary" style={styles.cardChipText}>
                  {t('profile.payment.yourCard')}
                </Typography>
              </Button>
              <Button
                variant="ghost"
                onPress={() => setCardPaymentFlow('liqpay')}
                style={[
                  styles.cardFlowButton,
                  cardPaymentFlow === 'liqpay' && styles.cardFlowButtonActive,
                ]}
              >
                <Typography variant="caption" tone="primary" style={styles.cardChipText}>
                  LiqPay
                </Typography>
              </Button>
            </View>

            {cardPaymentFlow === 'saved' ? (
              <>
                <Typography variant="body" tone="primary" style={styles.cardsTitle}>
                  {t('profile.payment.yourCard')}
                </Typography>
                {cards.length === 0 ? (
                  <Typography variant="caption" tone="secondary">
                    {t('profile.payment.noCard')}
                  </Typography>
                ) : (
                  <Button
                    variant="ghost"
                    onPress={() => setIsCardPickerOpen(true)}
                    style={styles.cardDropdown}
                  >
                    <View style={styles.cardDropdownContent}>
                      <Typography variant="caption" tone="primary" style={styles.cardChipText}>
                        {selectedCard?.numberMasked ?? selectedCard?.holderName ?? '—'}
                      </Typography>
                      <MaterialCommunityIcons
                        name="chevron-down"
                        size={s(18)}
                        color={headerTextColor}
                      />
                    </View>
                  </Button>
                )}
              </>
            ) : (
              <Typography variant="caption" tone="secondary">
                LiqPay flow відкриється після натискання «{t('booking.book')}».
              </Typography>
            )}
          </View>
        ) : null}

        <View style={styles.summary}>
          <Typography variant="caption" tone="primary">
            {nights} {t('booking.nights')} × {formatPrice(offer.pricePerNight)}
          </Typography>
          <Typography variant="h2" tone="primary">
            {formatPrice(offer.pricePerNight * nights)}
          </Typography>
        </View>

        <Button
          title={mutation.isPending ? t('booking.bookProgress') : t('booking.book')}
          onPress={() => mutation.mutate()}
          isLoading={mutation.isPending}
        />
      </ScrollView>

      <Modal
        visible={isCardPickerOpen}
        onClose={() => setIsCardPickerOpen(false)}
        variant="sheet"
        contentStyle={styles.cardPickerSheet}
      >
        <Typography variant="subtitle" tone="primary" style={styles.cardPickerTitle}>
          {t('profile.payment.yourCard')}
        </Typography>
        <View style={styles.cardPickerList}>
          {cards.map((card) => {
            const selected = selectedCardId === card.id;
            return (
              <Button
                key={card.id}
                variant="ghost"
                onPress={() => {
                  setSelectedCardId(card.id);
                  setIsCardPickerOpen(false);
                }}
                style={[styles.cardPickerItem, selected && styles.cardPickerItemActive]}
              >
                <Typography variant="caption" tone="primary" style={styles.cardChipText}>
                  {card.numberMasked ?? card.holderName}
                </Typography>
              </Button>
            );
          })}
        </View>
      </Modal>
    </View>
  );
};

const getStyles = (colors: any, isDark: boolean, headerTextColor: string) =>
  // LEGACY STYLES: contains hardcoded typography values
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loading: {
      padding: s(14),
    },
    content: {
      paddingHorizontal: s(14),
      gap: s(12),
    },
    header: {
      height: s(36),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? colors.bgDark : colors.surfaceLight,
      marginTop: s(4),
    },
    backButton: {
      position: 'absolute',
      left: s(12),
      top: s(6),
      width: s(24),
      height: s(24),
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      color: headerTextColor,
      fontSize: s(16),
      fontWeight: '700',
    },
    headerUnderline: {
      marginTop: s(8),
      marginBottom: s(4),
    },
    warningRow: {
      flexDirection: 'row',
      gap: s(10),
      alignItems: 'flex-start',
      marginTop: 0,
      marginBottom: s(8),
    },
    warningIcon: {
      width: s(20),
      height: s(20),
      borderRadius: radius.round,
      borderWidth: 1,
      borderColor: colors.warning,
      alignItems: 'center',
      justifyContent: 'center',
    },
    warningText: {
      flex: 1,
    },
    requiredNote: {
      marginBottom: s(16),
    },
    summary: {
      marginTop: s(20),
      paddingVertical: s(10),
      borderTopWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardsBlock: {
      gap: s(8),
    },
    cardFlowRow: {
      flexDirection: 'row',
      gap: s(8),
    },
    cardFlowButton: {
      flex: 1,
      minHeight: s(40),
      justifyContent: 'center',
    },
    cardFlowButtonActive: {
      borderColor: colors.primary,
      backgroundColor: isDark ? colors.bgDarkAlt : colors.surfaceLight,
    },
    cardsTitle: {
      fontWeight: '600',
    },
    cardDropdown: {
      minHeight: s(44),
      justifyContent: 'center',
    },
    cardDropdownContent: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardChipText: {
      fontWeight: '600',
    },
    cardPickerSheet: {
      gap: s(12),
    },
    cardPickerTitle: {
      marginBottom: s(4),
    },
    cardPickerList: {
      gap: s(8),
    },
    cardPickerItem: {
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: s(44),
      paddingHorizontal: s(12),
    },
    cardPickerItemActive: {
      borderColor: colors.primary,
      backgroundColor: isDark ? colors.bgDarkAlt : colors.surfaceLight,
    },
  });

export default BookingScreenView;
