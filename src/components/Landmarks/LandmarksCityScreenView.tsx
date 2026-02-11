import React, { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeDatePickerModal from '@/components/Home/HomeDatePickerModal';
import HomeHeader from '@/components/Home/HomeHeader';
import { LandmarkCityGuide } from '@/services/landmarkService';
import { spacing, radius, useTheme } from '@/theme';
import { Button, Input, Modal, ScreenContainer, Typography } from '@/ui';
import { useTranslation } from '@/i18n';
import { s, SCREEN_WIDTH } from '@/utils/scale';

type Props = {
  cityName?: string;
  guide: LandmarkCityGuide;
  onBack: () => void;
  onOpenMenu: () => void;
  onFindStay: () => void;
  menuSheet?: React.ReactNode;
  searchMenuVisible: boolean;
  cityQuery: string;
  dateFrom: string;
  dateTo: string;
  guests: string;
  onGuestsChange: (value: string) => void;
  datePickerVisible: boolean;
  monthLabel: string;
  weekLabels: string[];
  calendarDays: Array<number | null>;
  calendarStart: number | null;
  calendarEnd: number | null;
  isCalendarDayDisabled: (day: number) => boolean;
  onOpenDatePicker: () => void;
  onCloseDatePicker: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (day: number) => void;
  onApplyDate: () => void;
  onCloseSearchMenu: () => void;
  onSearchSubmit: () => void;
};

const LandmarksCityScreenView: React.FC<Props> = ({
  cityName,
  guide,
  onBack,
  onOpenMenu,
  onFindStay,
  menuSheet,
  searchMenuVisible,
  cityQuery,
  dateFrom,
  dateTo,
  guests,
  onGuestsChange,
  datePickerVisible,
  monthLabel,
  weekLabels,
  calendarDays,
  calendarStart,
  calendarEnd,
  isCalendarDayDisabled,
  onOpenDatePicker,
  onCloseDatePicker,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
  onApplyDate,
  onCloseSearchMenu,
  onSearchSubmit,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const formatIsoToDisplay = (value: string) => {
    const parts = value.split('-');
    if (parts.length !== 3) {
      return value;
    }
    const [, month, day] = parts;
    return `${day}.${month}`;
  };
  const dateRangeValue =
    dateFrom && dateTo ? `${formatIsoToDisplay(dateFrom)} - ${formatIsoToDisplay(dateTo)}` : '';

  return (
    <ScreenContainer scroll style={styles.container} edges={[]}>
      <HomeHeader
        mode="titleOnly"
        title={cityName ?? t('landmarks.cityGuideTitle')}
        onBack={onBack}
        onOpenMenu={onOpenMenu}
        showMenu
        heroImageSource={guide.heroImage}
        heroHeight={240}
      />

      <View style={styles.content}>
        <Typography variant="h2" style={styles.sectionTitle}>
          {guide.historyTitle}
        </Typography>
        <Typography variant="body" style={styles.sectionText}>
          {guide.historyText}
        </Typography>

        <Typography variant="h2" style={styles.sectionTitle}>
          {guide.cultureTitle}
        </Typography>
        <Typography variant="body" style={styles.sectionText}>
          {guide.cultureText}
        </Typography>

        <Button variant="primary" size="large" style={styles.ctaButton} onPress={onFindStay}>
          <Typography variant="menu" style={styles.ctaText}>
            {t('landmarks.findStay')}
          </Typography>
        </Button>
      </View>

      <View style={styles.bottomImageWrap}>
        <Image source={guide.bottomImage} style={styles.bottomImage} resizeMode="cover" />
      </View>

      <Modal
        visible={searchMenuVisible}
        onClose={onCloseSearchMenu}
        variant="dialog"
        position="top"
        overlayOpacity={0.45}
        contentStyle={styles.searchModalContent}
      >
        <View style={styles.searchMenu}>
          <View style={styles.searchInputWrap}>
            <MaterialCommunityIcons
              name="city-variant-outline"
              size={s(16)}
              color={colors.textPrimary}
              style={styles.searchInputIcon}
            />
            <Input
              value={cityQuery}
              editable={false}
              placeholder={t('common.city')}
              containerStyle={styles.searchInputContainer}
              inputStyle={styles.searchInput}
            />
          </View>
          <View style={styles.searchInputWrap}>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={s(16)}
              color={colors.textPrimary}
              style={styles.searchInputIcon}
            />
            <Button variant="ghost" style={styles.dateFieldButton} onPress={onOpenDatePicker}>
              <Typography variant="body" style={styles.dateFieldText}>
                {dateRangeValue || t('common.date')}
              </Typography>
            </Button>
          </View>
          <View style={styles.searchInputWrap}>
            <MaterialCommunityIcons
              name="account-group-outline"
              size={s(16)}
              color={colors.textPrimary}
              style={styles.searchInputIcon}
            />
            <Input
              value={guests}
              onChangeText={onGuestsChange}
              placeholder={t('common.guestsLabel')}
              keyboardType="number-pad"
              containerStyle={styles.searchInputContainer}
              inputStyle={styles.searchInput}
            />
          </View>
          <Button variant="primary" size="large" style={styles.searchAction} onPress={onSearchSubmit}>
            <Typography variant="guestsApply" style={styles.searchActionText}>
              {t('landmarks.searchAction')}
            </Typography>
          </Button>
        </View>
      </Modal>

      <HomeDatePickerModal
        visible={datePickerVisible}
        onClose={onCloseDatePicker}
        overlayOpacity={0.45}
        sheetAnimatedStyle={styles.datePickerStaticAnimated}
        monthLabel={monthLabel}
        weekLabels={weekLabels}
        calendarDays={calendarDays}
        calendarStart={calendarStart}
        calendarEnd={calendarEnd}
        isDayDisabled={isCalendarDayDisabled}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
        onSelectDay={onSelectDay}
        onApply={onApplyDate}
      />
      {menuSheet}
    </ScreenContainer>
  );
};

const getStyles = (colors: Record<string, string>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    content: {
      paddingHorizontal: spacing.lg,
      gap: spacing.md,
      marginTop: -spacing.md,
    },
    sectionTitle: {
      color: colors.textPrimary,
    },
    sectionText: {
      color: colors.textSecondary,
    },
    ctaButton: {
      marginTop: spacing.md,
      borderRadius: radius.lg,
    },
    ctaText: {
      color: colors.textOnAccent,
    },
    bottomImageWrap: {
      marginTop: spacing.lg,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.xl,
      borderRadius: radius.lg,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 220,
      backgroundColor: colors.bgCard,
    },
    bottomImage: {
      width: '100%',
      height: 220,
    },
    searchModalContent: {
      backgroundColor: colors.transparent,
      padding: 0,
      borderRadius: 0,
      width: SCREEN_WIDTH,
    },
    searchMenu: {
      width: SCREEN_WIDTH,
      marginTop: 0,
      backgroundColor: colors.surface,
      borderBottomLeftRadius: radius.xl,
      borderBottomRightRadius: radius.xl,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl,
      gap: spacing.md,
      shadowColor: colors.bgDark,
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 12,
    },
    searchInputWrap: {
      width: '100%',
      position: 'relative',
    },
    searchInputIcon: {
      position: 'absolute',
      left: spacing.md,
      top: s(17),
      zIndex: 2,
    },
    searchInputContainer: {
      width: '100%',
    },
    dateFieldButton: {
      width: '100%',
      height: s(50),
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.bgField,
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingLeft: s(42),
      paddingRight: spacing.md,
    },
    dateFieldText: {
      color: colors.textPrimary,
    },
    searchInput: {
      borderRadius: radius.xl,
      height: s(50),
      paddingLeft: s(42),
      paddingRight: spacing.md,
      color: colors.textPrimary,
    },
    searchAction: {
      marginTop: spacing.xs,
      borderRadius: radius.lg,
      width: '100%',
      height: s(50),
      alignSelf: 'center',
    },
    searchActionText: {
      color: colors.textOnAccent,
    },
    datePickerStaticAnimated: {
      opacity: 1,
      transform: [{ translateY: 0 }],
    },
  });

export default LandmarksCityScreenView;
