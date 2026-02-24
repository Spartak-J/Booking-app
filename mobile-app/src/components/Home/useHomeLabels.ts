// Component: useHomeLabels. Used in: HomeScreen.tsx.
import { useMemo } from 'react';

import type { OfferFilters } from '@/services/offerService';
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';

type Params = {
  filters: OfferFilters;
  keyword: string;
  displayMonth: { month: number; year: number };
  monthLabels: string[];
};

export const useHomeLabels = ({ filters, keyword, displayMonth, monthLabels }: Params) => {
  const { colors, mode } = useTheme();
  const { t } = useTranslation();
  const isDark = mode === 'dark';

  return useMemo(() => {
    const heroDateLabel =
      filters.dates?.from && filters.dates?.to
        ? `${formatDateLabel(filters.dates.from)}-${formatDateLabel(filters.dates.to)}`
        : isDark
          ? t('home.hero.datesPlaceholder')
          : t('home.hero.datesPlaceholderLight');

    const heroGuestLabel = filters.guests
      ? `${filters.guests} ${t('bookings.guests')}`
      : isDark
        ? t('home.hero.guestsPlaceholder')
        : t('home.hero.guestsPlaceholderLight');

    const guestBorderColor = isDark
      ? (colors.surfaceLight ?? colors.surface)
      : (colors.textPrimary ?? colors.text);

    const heroCityLabel = keyword || (isDark ? t('home.placeholder') : t('home.hero.cityDefault'));
    const currentMonthLabel = `${monthLabels[displayMonth.month]} ${displayMonth.year}`;

    return {
      heroDateLabel: heroDateLabel.replace('—', '-'),
      heroGuestLabel,
      guestBorderColor,
      heroCityLabel,
      currentMonthLabel,
    };
  }, [colors, displayMonth, filters, isDark, keyword, monthLabels, t]);
};

const formatDateLabel = (date: string) => {
  const [, month, day] = date.split('-');
  if (!day || !month) return date;
  return `${day}.${month}`;
};
