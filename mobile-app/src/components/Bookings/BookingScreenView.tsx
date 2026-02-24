// Component: BookingScreenView. Used in: BookingScreen.
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Dimensions, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BookingDetailsSection } from '@/components/Booking/BookingDetailsSection';
import { BookingGuestInfo } from '@/components/Booking/BookingGuestInfo';
import { BookingPaymentMethod, PaymentMethod } from '@/components/Booking/BookingPaymentMethod';
import { BookingTripPurpose } from '@/components/Booking/BookingTripPurpose';
import { bookingService } from '@/services/bookingService';
import { paymentService } from '@/services/payment';
import { useTheme } from '@/theme';
import { formatPrice } from '@/utils/price';
import { PaymentType, Offer } from '@/types';
import { useTranslation } from '@/i18n';
import { useAuthStore } from '@/store/authStore';
import { Button, LineWithDots, Loader, Modal, Typography } from '@/ui';
import { radius } from '@/theme';
import { PaymentRepository } from '@/data/payment';
import type { PaymentCard } from '@/data/payment/types';

const DESIGN_WIDTH = 412;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / DESIGN_WIDTH;
const s = (value: number) => value * scale;
const DEFAULT_COUNTRY = 'Україна';

type BookingScreenViewProps = {
  offerId: string;
  initialDates?: { from: string; to: string };
  initialGuests?: number;
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

export const BookingScreenView: React.FC<BookingScreenViewProps> = ({
  offerId,
  initialDates,
  initialGuests,
  offer,
  isLoading,
  onBack,
  onBookingSuccess,
}) => {
  const { colors, mode } = useTheme();
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const userId = useAuthStore((state) => state.user?.id);
  const isDark = mode === 'dark' || colors.background === colors.bgDark;
  const headerTextColor = isDark ? colors.surfaceLight : colors.textPrimary;
  const styles = useMemo(
    () => getStyles(colors, isDark, headerTextColor),
    [colors, isDark, headerTextColor],
  );
  const queryClient = useQueryClient();

  const [dates, setDates] = useState<{ from: string; to: string }>(() => ({
    from: initialDates?.from ?? new Date().toISOString().slice(0, 10),
    to: initialDates?.to ?? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  }));
  const [guests, setGuests] = useState<number | undefined>(initialGuests ?? 2);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [tripPurpose, setTripPurpose] = useState<'leisure' | 'work'>('leisure');
  const [comment, setComment] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const normalizedUserCountry = (user?.country ?? '').trim();
  const [country, setCountry] = useState(normalizedUserCountry || DEFAULT_COUNTRY);
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    country?: string;
  }>({});
  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | undefined>(undefined);
  const [selectedCardSource, setSelectedCardSource] = useState<'saved' | 'liqpay'>('saved');
  const [cardSelectOpen, setCardSelectOpen] = useState(false);
  const resolvedFullName = fullName.trim().length > 0 ? fullName : user?.name ?? '';
  const resolvedEmail = email.trim().length > 0 ? email : user?.email ?? '';
  const resolvedPhone = phone.trim().length > 0 ? phone : user?.phone ?? '';
  const resolvedCountry =
    country.trim().length > 0 ? country.trim() : normalizedUserCountry || DEFAULT_COUNTRY;
  const paymentType: PaymentType =
    paymentMethod === 'cash'
      ? 'cash'
      : paymentMethod === 'card'
        ? selectedCardSource === 'liqpay'
          ? 'online'
          : 'card'
        : 'online';

  const nights = useMemo(() => {
    const start = new Date(dates.from).getTime();
    const end = new Date(dates.to).getTime();
    const diff = end - start;
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 1;
  }, [dates]);

  useEffect(() => {
    if (!country.trim()) {
      setCountry(normalizedUserCountry || DEFAULT_COUNTRY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedUserCountry]);

  useEffect(() => {
    const normalizedUserId = String(userId ?? '').trim() || 'guest';
    PaymentRepository.getCards(normalizedUserId)
      .then((list) => {
        setCards(list);
        if (list.length > 0 && !selectedCardId) {
          setSelectedCardId(list[0].id);
        }
        if (list.length === 0) {
          setSelectedCardSource('liqpay');
        } else if (selectedCardSource === 'liqpay' && !selectedCardId) {
          setSelectedCardId(list[0].id);
        }
      })
      .catch(() => setCards([]));
  }, [selectedCardId, selectedCardSource, userId]);

  const selectedCard = cards.find((card) => card.id === selectedCardId);
  const selectedPaymentLabel =
    selectedCardSource === 'liqpay'
      ? 'Оплата через LiqPay'
      : selectedCard?.numberMasked ?? selectedCard?.holderName ?? t('profile.payment.noCard');

  const validateGuestFields = () => {
    const nextErrors: {
      fullName?: string;
      email?: string;
      phone?: string;
      country?: string;
    } = {};

    if (!resolvedFullName.trim()) nextErrors.fullName = t('validation.required');
    if (!resolvedEmail.trim()) {
      nextErrors.email = t('auth.errors.requiredEmail');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resolvedEmail.trim())) {
      nextErrors.email = t('auth.errors.email');
    }
    if (!resolvedPhone.trim()) nextErrors.phone = t('validation.required');
    if (!resolvedCountry.trim()) nextErrors.country = t('validation.required');

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleBook = () => {
    if (!validateGuestFields()) return;
    mutation.mutate();
  };

  const mutation = useMutation({
    mutationFn: () =>
      bookingService.create({
        offerId,
        checkIn: dates.from,
        checkOut: dates.to,
        guests: guests ?? 1,
        fullName: resolvedFullName,
        email: resolvedEmail,
        phone: resolvedPhone,
        country: resolvedCountry,
        comment,
        isBusinessTrip: tripPurpose === 'work',
        paymentType,
        userId: userId ?? 'user-1',
      }),
    onSuccess: async (booking) => {
      if (paymentType === 'online') {
        try {
          const totalAmount = booking.totalPrice || (offer?.pricePerNight ?? 0) * nights;
          const payment = await paymentService.createPayment({
            bookingId: booking.id,
            amount: totalAmount,
            currency: 'UAH',
            method: 'pay',
            clientType: 'mobile',
          });

          if (payment.redirectUrl) {
            await Linking.openURL(payment.redirectUrl);
          } else {
            throw new Error('Не отримано посилання на оплату LiqPay.');
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          Alert.alert(t('booking.error'), message);
          return;
        }
      }

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
          fullName={resolvedFullName}
          email={resolvedEmail}
          phone={resolvedPhone}
          country={resolvedCountry}
          nameError={fieldErrors.fullName}
          emailError={fieldErrors.email}
          phoneError={fieldErrors.phone}
          countryError={fieldErrors.country}
          onChangeName={setFullName}
          onChangeEmail={setEmail}
          onChangePhone={setPhone}
          onChangeCountry={setCountry}
        />
        <BookingDetailsSection
          dates={dates}
          guests={guests}
          comment={comment}
          onChangeComment={setComment}
        />
        <BookingTripPurpose value={tripPurpose} onChange={setTripPurpose} />
        <BookingPaymentMethod value={paymentMethod} onChange={setPaymentMethod} />
        {paymentMethod === 'card' ? (
          <View style={styles.cardsBlock}>
            <Typography variant="body" tone="primary" style={styles.cardsTitle}>
              Спосіб оплати Mastercard/Visa
            </Typography>
            <Button
              title={selectedPaymentLabel}
              variant="secondary"
              onPress={() => setCardSelectOpen(true)}
              style={styles.cardSelectButton}
              textStyle={styles.cardSelectButtonText}
            />
            <Typography variant="caption" tone="secondary">
              {cards.length > 0
                ? 'Оберіть збережену карту або оплату через LiqPay'
                : 'Збережених карт немає, доступна оплата через LiqPay'}
            </Typography>
            <Modal visible={cardSelectOpen} onClose={() => setCardSelectOpen(false)} variant="sheet">
              <View style={styles.cardPickerModal}>
                <Typography variant="subtitle" tone="primary">
                  Оберіть спосіб оплати
                </Typography>
                {cards.map((card) => (
                  <Button
                    key={card.id}
                    title={card.numberMasked || card.holderName}
                    variant={selectedCardSource === 'saved' && selectedCardId === card.id ? 'primary' : 'secondary'}
                    onPress={() => {
                      setSelectedCardSource('saved');
                      setSelectedCardId(card.id);
                      setCardSelectOpen(false);
                    }}
                    style={styles.cardPickerOption}
                  />
                ))}
                <Button
                  title="Оплата через LiqPay"
                  variant={selectedCardSource === 'liqpay' ? 'primary' : 'secondary'}
                  onPress={() => {
                    setSelectedCardSource('liqpay');
                    setCardSelectOpen(false);
                  }}
                  style={styles.cardPickerOption}
                />
                <Button
                  title="Скасувати"
                  variant="ghost"
                  onPress={() => setCardSelectOpen(false)}
                  style={styles.cardPickerClose}
                />
              </View>
            </Modal>
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
          onPress={handleBook}
          isLoading={mutation.isPending}
        />
      </ScrollView>
    </View>
  );
};

const getStyles = (colors: any, isDark: boolean, headerTextColor: string) =>
  // LEGACY STYLES: contains hardcoded typography values
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.surfaceLight,
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
      backgroundColor: colors.surfaceLight,
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
    cardsTitle: {
      fontWeight: '600',
    },
    cardSelectButton: {
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      paddingHorizontal: s(12),
    },
    cardSelectButtonText: {
      textAlign: 'left',
      width: '100%',
    },
    cardPickerModal: {
      gap: s(10),
    },
    cardPickerOption: {
      width: '100%',
    },
    cardPickerClose: {
      width: '100%',
      marginTop: s(4),
    },
  });

export default BookingScreenView;
