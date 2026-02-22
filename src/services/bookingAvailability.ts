import { Booking } from '@/types';

const DAY_MS = 24 * 60 * 60 * 1000;

const toTime = (value: string): number | null => {
  if (!value) return null;

  const direct = new Date(value).getTime();
  if (Number.isFinite(direct)) return direct;

  const dotDate = /^(\d{2})\.(\d{2})(?:\.(\d{4}))?$/u.exec(value.trim());
  if (dotDate) {
    const day = Number(dotDate[1]);
    const month = Number(dotDate[2]);
    const year = Number(dotDate[3] ?? new Date().getFullYear());
    const parsed = new Date(year, month - 1, day).getTime();
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const normalizeRange = (from: string, to: string): { start: number; end: number } | null => {
  const start = toTime(from);
  const end = toTime(to);

  if (start === null || end === null) return null;
  if (end <= start) return { start, end: start + DAY_MS };
  return { start, end };
};

const isBlockingStatus = (status: Booking['status']) => status === 'active' || status === 'pending';

const rangesOverlap = (aStart: number, aEnd: number, bStart: number, bEnd: number) =>
  aStart < bEnd && bStart < aEnd;

export const isOfferAvailableForDates = (
  offerId: string,
  checkIn: string,
  checkOut: string,
  bookings: Booking[],
  stock = 1,
) => {
  const targetRange = normalizeRange(checkIn, checkOut);
  if (!targetRange) return true;
  const overlapCount = bookings.reduce((count, booking) => {
    if (booking.offerId !== offerId || !isBlockingStatus(booking.status)) return count;
    const bookingRange = normalizeRange(booking.checkIn, booking.checkOut);
    if (!bookingRange) return count;
    return rangesOverlap(targetRange.start, targetRange.end, bookingRange.start, bookingRange.end)
      ? count + 1
      : count;
  }, 0);

  return overlapCount < Math.max(1, stock);
};
