// Component: FiltersSheet. Used in: FiltersModal.tsx.
import React, { useCallback, useMemo, useState } from 'react';
import { PanResponder, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { OfferFilters } from '@/services/offerService';
import { useTheme } from '@/theme';
import { LineWithDots, Typography } from '@/ui';
import { radius, typography, withOpacity } from '@/theme';
import { s } from '@/utils/scale';
import { AMENITY_OPTIONS } from '@/utils/amenities';
import { useTranslation } from '@/i18n';
import { useCurrencyStore } from '@/store/currencyStore';

const MIN_PRICE = 1000;
const MAX_PRICE = 20000;
const PRICE_STEP = 100;
const THUMB_SIZE = s(16);
const THUMB_TOUCH_SIZE = s(28);
const TRACK_HEIGHT = s(25);
const THUMB_LINE_HEIGHT = TRACK_HEIGHT + s(6);

type Props = {
  filters: OfferFilters;
  onChange: (next: OfferFilters) => void;
  onApply: () => void;
  onClose: () => void;
  onReset: () => void;
};

type ChipOption = {
  id: string;
  label: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
};

const PROPERTY_TYPES: ChipOption[] = [
  { id: 'hotel', label: 'Готель' },
  { id: 'hostel', label: 'Хостел' },
  { id: 'studio', label: 'Студія' },
  { id: 'apartment', label: 'Апартаменти/квартира' },
  { id: 'house', label: 'Приватний будинок' },
  { id: 'room', label: 'Кімната' },
];

const AMENITIES: ChipOption[] = AMENITY_OPTIONS;

const RATINGS: ChipOption[] = [
  { id: '9', label: 'Чудово 9+' },
  { id: '8', label: 'Дуже добре 8+' },
  { id: '7', label: 'Добре 7+' },
  { id: '5', label: 'Досить добре 5+' },
];

const DISTANCE: ChipOption[] = [
  { id: '1', label: 'Менше 1 км' },
  { id: '3', label: 'Менше 3 км' },
  { id: '5', label: 'Менше 5 км' },
];

const DISTRICTS: ChipOption[] = [
  { id: 'center', label: 'Центр Львова' },
  { id: 'favorite', label: 'Улюблений район' },
  { id: 'rynok', label: 'Ринкова площа' },
  { id: 'svobody', label: 'Проспект Свободи' },
];

const RULES: ChipOption[] = [
  { id: 'freeCancel', label: 'Безкоштовне скасування' },
  { id: 'payNow', label: 'Оплата зараз' },
  { id: 'payBefore', label: 'Оплата помешканню перед приїздом' },
  { id: 'payOnArrival', label: 'Оплата на місці' },
];

const LODGING: ChipOption[] = [
  { id: 'balcony', label: 'Балкон', icon: 'balcony' },
  { id: 'terrace', label: 'Тераса', icon: 'balcony' },
  { id: 'kitchen', label: 'Кухня', icon: 'stove' },
  { id: 'single', label: 'Односпальне', icon: 'bed-single' },
  { id: 'double', label: 'Двоспальне', icon: 'bed-double' },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const roundToStep = (value: number) => Math.round(value / PRICE_STEP) * PRICE_STEP;

export const FiltersSheet: React.FC<Props> = ({ filters, onChange, onApply, onClose, onReset }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const selectedCurrency = useCurrencyStore((state) => state.currency);
  const convertFromUah = useCurrencyStore((state) => state.convertFromUah);
  const isDark = colors.background === colors.bgDark;
  const palette = useMemo(
    () => ({
      rootBg: isDark ? colors.bgDark : colors.surfaceLight,
      headerBg: isDark ? colors.bgDark : colors.surfaceLight,
      headerText: isDark ? colors.surfaceLight : colors.textPrimary,
      headerRule: isDark ? colors.surfaceLight : colors.textPrimary,
      sheetBg: isDark ? colors.bgCard : colors.surfaceWarm,
      sheetBorder: isDark ? colors.surfaceLight : colors.textPrimary,
      chipBg: isDark ? colors.bgCard : colors.surfaceWarm,
      chipBorder: isDark ? colors.surfaceLight : colors.textPrimary,
      chipText: isDark ? colors.surfaceLight : colors.textPrimary,
      chipActiveBg: isDark ? colors.surfaceLightDarker : colors.surfaceAccent,
      chipActiveText: isDark ? colors.textPrimary : colors.textPrimary,
      accent: colors.primary,
      applyText: isDark ? colors.textPrimary : colors.surfaceLight,
      barBg: isDark ? withOpacity(colors.surfaceLight, 0.2) : colors.surfaceAccent,
      barBorder: isDark ? colors.surfaceLight : colors.textPrimary,
      checkboxActive: isDark ? colors.surfaceLight : colors.textPrimary,
      thumbBg: isDark ? colors.surfaceLight : colors.textPrimary,
    }),
    [colors, isDark],
  );

  const priceFrom = clamp(filters.priceFrom ?? MIN_PRICE, MIN_PRICE, MAX_PRICE);
  const priceTo = clamp(filters.priceTo ?? MAX_PRICE, MIN_PRICE, MAX_PRICE);
  const displayPriceFrom = Math.round(convertFromUah(priceFrom));
  const displayPriceTo = Math.round(convertFromUah(priceTo));
  const [trackWidth, setTrackWidth] = useState<number>(s(369));
  const [dragging, setDragging] = useState(false);
  const [minStartValue, setMinStartValue] = useState(priceFrom);
  const [maxStartValue, setMaxStartValue] = useState(priceTo);

  const priceStartX = ((priceFrom - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * trackWidth;
  const priceEndX = ((priceTo - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * trackWidth;
  const priceFill = Math.max(0, priceEndX - priceStartX);

  const minThumbLeft = clamp(priceStartX - THUMB_TOUCH_SIZE / 2, 0, trackWidth - THUMB_TOUCH_SIZE);
  const maxThumbLeft = clamp(priceEndX - THUMB_TOUCH_SIZE / 2, 0, trackWidth - THUMB_TOUCH_SIZE);

  const updatePriceFrom = useCallback(
    (next: number) => {
      const rounded = roundToStep(clamp(next, MIN_PRICE, MAX_PRICE));
      const bounded = Math.min(rounded, priceTo);
      onChange({ ...filters, priceFrom: bounded, priceTo });
    },
    [filters, onChange, priceTo],
  );

  const updatePriceTo = useCallback(
    (next: number) => {
      const rounded = roundToStep(clamp(next, MIN_PRICE, MAX_PRICE));
      const bounded = Math.max(rounded, priceFrom);
      onChange({ ...filters, priceFrom, priceTo: bounded });
    },
    [filters, onChange, priceFrom],
  );

  const minResponder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        setMinStartValue(priceFrom);
        setDragging(true);
      },
      onPanResponderMove: (_, gesture) => {
        const deltaValue = (gesture.dx / trackWidth) * (MAX_PRICE - MIN_PRICE);
        updatePriceFrom(minStartValue + deltaValue);
      },
      onPanResponderRelease: () => setDragging(false),
      onPanResponderTerminate: () => setDragging(false),
    });
  }, [minStartValue, priceFrom, trackWidth, updatePriceFrom]);

  const maxResponder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        setMaxStartValue(priceTo);
        setDragging(true);
      },
      onPanResponderMove: (_, gesture) => {
        const deltaValue = (gesture.dx / trackWidth) * (MAX_PRICE - MIN_PRICE);
        updatePriceTo(maxStartValue + deltaValue);
      },
      onPanResponderRelease: () => setDragging(false),
      onPanResponderTerminate: () => setDragging(false),
    });
  }, [maxStartValue, priceTo, trackWidth, updatePriceTo]);

  const toggleAmenity = (id: string) => {
    const current = filters.amenities ?? [];
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    onChange({ ...filters, amenities: next });
  };

  const togglePropertyType = (id: string) => {
    const nextType = id === filters.propertyType ? undefined : (id as OfferFilters['propertyType']);
    if (id === 'hotel' || id === 'apartment' || id === 'house') {
      onChange({ ...filters, propertyType: nextType });
      return;
    }
    onChange({ ...filters, categoryId: id });
  };

  const styles = useMemo(() => getStyles(palette), [palette]);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={s(20)} color={palette.headerText} />
        </Pressable>
        <Typography variant="searchChip" style={styles.headerTitle}>
          Фільтри
        </Typography>
        <Pressable onPress={onReset}>
          <Typography variant="searchChip" style={styles.resetText}>
            Скинути
          </Typography>
        </Pressable>
      </View>
      <LineWithDots width={s(304)} color={palette.headerRule} style={styles.headerRule} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!dragging}
      >
        <View style={styles.section}>
          <Typography variant="searchChip" style={styles.sectionTitle}>
            Тип розміщення
          </Typography>
          <View style={styles.chipWrap}>
            {PROPERTY_TYPES.map((item) => {
              const isActive = filters.propertyType === item.id || filters.categoryId === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => togglePropertyType(item.id)}
                  style={[styles.chip, isActive && styles.chipActive]}
                >
                  <Typography
                    variant="caption"
                    style={[styles.chipLabel, isActive && styles.chipLabelActive]}
                  >
                    {item.label}
                  </Typography>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={[styles.section, styles.priceSection]}>
          <Typography variant="searchChip" style={styles.sectionTitle}>
            Ціни
          </Typography>
          <View style={styles.priceLabels}>
            <Typography variant="caption" style={styles.priceText}>
              від {displayPriceFrom} {selectedCurrency}
            </Typography>
            <Typography variant="caption" style={styles.priceText}>
              до {displayPriceTo} {selectedCurrency}
            </Typography>
          </View>
          <View
            style={styles.priceTrackWrap}
            onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
          >
            <View style={styles.priceTrack} pointerEvents="none">
              <View style={[styles.priceFill, { left: priceStartX, width: priceFill }]} />
            </View>
            <View
              style={[styles.thumbTouch, { left: minThumbLeft }]}
              {...minResponder.panHandlers}
              hitSlop={s(12)}
            >
              <View style={styles.thumbLine} />
              <View style={styles.thumbDot} />
            </View>
            <View
              style={[styles.thumbTouch, { left: maxThumbLeft }]}
              {...maxResponder.panHandlers}
              hitSlop={s(12)}
            >
              <View style={styles.thumbLine} />
              <View style={styles.thumbDot} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Typography variant="searchChip" style={styles.sectionTitle}>
            Зручності
          </Typography>
          <View style={styles.chipWrap}>
            {AMENITIES.map((item) => {
              const isActive = (filters.amenities ?? []).includes(item.id);
              const iconColor = isActive ? palette.accent : palette.chipText;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => toggleAmenity(item.id)}
                  style={[styles.chip, styles.chipIcon, isActive && styles.chipActive]}
                >
                  {item.icon ? (
                    <MaterialCommunityIcons name={item.icon} size={s(16)} color={iconColor} />
                  ) : null}
                  <Typography
                    variant="caption"
                    style={[styles.chipLabel, isActive && styles.chipLabelActive]}
                  >
                    {item.label}
                  </Typography>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Typography variant="searchChip" style={styles.sectionTitle}>
            Житло з
          </Typography>
          <View style={styles.chipWrap}>
            {LODGING.map((item) => {
              const isActive = filters.lodgingType === item.id;
              const iconColor = isActive ? palette.accent : palette.chipText;
              return (
                <Pressable
                  key={item.id}
                  onPress={() =>
                    onChange({ ...filters, lodgingType: isActive ? undefined : item.id })
                  }
                  style={[styles.chip, styles.chipIcon, isActive && styles.chipActive]}
                >
                  {item.icon ? (
                    <MaterialCommunityIcons name={item.icon} size={s(16)} color={iconColor} />
                  ) : null}
                  <Typography
                    variant="caption"
                    style={[styles.chipLabel, isActive && styles.chipLabelActive]}
                  >
                    {item.label}
                  </Typography>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Typography variant="searchChip" style={styles.sectionTitle}>
            Оцінка об’єкта
          </Typography>
          <View style={styles.chipWrap}>
            {RATINGS.map((item) => {
              const ratingValue = item.id === 'any' ? undefined : Number.parseInt(item.id, 10);
              const isActive = filters.ratingMin === ratingValue;
              return (
                <Pressable
                  key={item.id}
                  onPress={() =>
                    onChange({
                      ...filters,
                      ratingMin: isActive ? undefined : ratingValue,
                    })
                  }
                  style={[styles.chip, isActive && styles.chipActive]}
                >
                  <Typography
                    variant="caption"
                    style={[styles.chipLabel, isActive && styles.chipLabelActive]}
                  >
                    {item.label}
                  </Typography>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Typography variant="searchChip" style={styles.sectionTitle}>
            Львів : Відстань від центра
          </Typography>
          <View style={styles.chipWrap}>
            {DISTANCE.map((item) => {
              const distanceValue = Number.parseInt(item.id, 10);
              const isActive = filters.distanceKm === distanceValue;
              return (
                <Pressable
                  key={item.id}
                  onPress={() =>
                    onChange({
                      ...filters,
                      distanceKm: isActive ? undefined : distanceValue,
                    })
                  }
                  style={[styles.chip, isActive && styles.chipActive]}
                >
                  <Typography
                    variant="caption"
                    style={[styles.chipLabel, isActive && styles.chipLabelActive]}
                  >
                    {item.label}
                  </Typography>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Typography variant="searchChip" style={styles.sectionTitle}>
            Район
          </Typography>
          <View style={styles.chipWrap}>
            {DISTRICTS.map((item) => {
              const isActive = filters.district === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() =>
                    onChange({
                      ...filters,
                      district: isActive ? undefined : item.id,
                    })
                  }
                  style={[styles.chip, isActive && styles.chipActive]}
                >
                  <Typography
                    variant="caption"
                    style={[styles.chipLabel, isActive && styles.chipLabelActive]}
                  >
                    {item.label}
                  </Typography>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Typography variant="searchChip" style={styles.sectionTitle}>
            {t('filters.rules')}
          </Typography>
          <View style={styles.chipWrap}>
            {RULES.map((item) => {
              const isActive = filters.bookingRule === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() =>
                    onChange({
                      ...filters,
                      bookingRule: isActive ? undefined : item.id,
                    })
                  }
                  style={[styles.chip, isActive && styles.chipActive]}
                >
                  <Typography
                    variant="caption"
                    style={[styles.chipLabel, isActive && styles.chipLabelActive]}
                  >
                    {item.label}
                  </Typography>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.cancelRow}>
            <Typography variant="searchChip" style={styles.sectionTitle}>
              {t('filters.freeCancellation')}
            </Typography>
            <Pressable
              onPress={() => onChange({ ...filters, freeCancellation: !filters.freeCancellation })}
              style={[styles.checkbox, filters.freeCancellation && styles.checkboxActive]}
            />
          </View>
        </View>

        <View style={styles.applySection}>
          <Pressable onPress={onApply} style={styles.applyButton}>
            <Text style={styles.applyText}>{t('dateRange.apply')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = (palette: {
  rootBg: string;
  headerBg: string;
  headerText: string;
  headerRule: string;
  sheetBg: string;
  sheetBorder: string;
  chipBg: string;
  chipBorder: string;
  chipText: string;
  chipActiveBg: string;
  chipActiveText: string;
  accent: string;
  applyText: string;
  barBg: string;
  barBorder: string;
  checkboxActive: string;
  thumbBg: string;
}) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: palette.rootBg,
    },
    header: {
      paddingTop: 0,
      height: s(36),
      backgroundColor: palette.headerBg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: s(16),
    },
    backButton: {
      width: s(24),
      height: s(24),
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      color: palette.headerText,
      fontFamily: typography.searchChip.fontFamily,
      fontSize: s(15),
    },
    resetText: {
      color: palette.headerText,
      fontFamily: typography.searchChip.fontFamily,
      fontSize: s(15),
    },
    headerRule: {
      width: s(304),
      alignSelf: 'center',
      marginTop: s(6),
      marginBottom: s(6),
    },
    content: {
      backgroundColor: palette.sheetBg,
      borderTopLeftRadius: radius.lg,
      borderTopRightRadius: radius.lg,
      paddingHorizontal: s(16),
      paddingTop: s(18),
      paddingBottom: s(24),
      gap: s(18),
    },
    section: {
      gap: s(10),
    },
    priceSection: {
      height: s(94),
      justifyContent: 'flex-start',
      gap: s(6),
    },
    sectionTitle: {
      color: palette.chipText,
      fontFamily: typography.searchChip.fontFamily,
      fontSize: s(16),
    },
    priceTrackWrap: {
      width: s(369),
      height: THUMB_LINE_HEIGHT + THUMB_SIZE,
      alignSelf: 'center',
      justifyContent: 'flex-start',
    },
    priceTrack: {
      width: '100%',
      height: TRACK_HEIGHT,
      borderRadius: radius.round,
      borderWidth: 2,
      borderColor: palette.barBorder,
      backgroundColor: palette.barBg,
      overflow: 'hidden',
    },
    thumbTouch: {
      position: 'absolute',
      top: 0,
      width: THUMB_TOUCH_SIZE,
      height: THUMB_LINE_HEIGHT + THUMB_SIZE,
      alignItems: 'center',
      justifyContent: 'flex-start',
      zIndex: 2,
      elevation: 2,
    },
    thumbLine: {
      width: s(2),
      height: THUMB_LINE_HEIGHT,
      backgroundColor: palette.barBorder,
      borderRadius: radius.round,
    },
    thumbDot: {
      width: THUMB_SIZE,
      height: THUMB_SIZE,
      borderRadius: radius.round,
      backgroundColor: palette.thumbBg,
      marginTop: 0,
    },
    priceFill: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      height: '100%',
      backgroundColor: palette.accent,
      borderRadius: radius.round,
      pointerEvents: 'none',
    },
    priceLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: s(12),
    },
    priceText: {
      color: palette.chipText,
      fontFamily: typography.caption.fontFamily,
    },
    chipWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: s(8),
    },
    chip: {
      paddingHorizontal: s(10),
      paddingVertical: s(8),
      borderRadius: radius.round,
      borderWidth: 1,
      borderColor: palette.chipBorder,
      backgroundColor: palette.chipBg,
    },
    chipIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(8),
    },
    chipActive: {
      backgroundColor: palette.chipActiveBg,
      borderColor: palette.accent,
      borderWidth: 2,
    },
    chipLabel: {
      color: palette.chipText,
    },
    chipLabelActive: {
      color: palette.chipActiveText,
      fontFamily: 'MontserratAlternates-SemiBold',
    },
    cancelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    checkbox: {
      width: s(24),
      height: s(24),
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: palette.chipBorder,
      backgroundColor: palette.chipBg,
    },
    checkboxActive: {
      backgroundColor: palette.checkboxActive,
    },
    applySection: {
      width: '100%',
      alignItems: 'center',
      paddingTop: s(8),
      paddingBottom: s(8),
    },
    applyButton: {
      width: s(188),
      height: s(44),
      borderRadius: radius.md,
      backgroundColor: palette.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    applyText: {
      fontFamily: 'MontserratAlternates-Bold',
      fontSize: s(20),
      color: palette.applyText,
    },
  });

export default FiltersSheet;
