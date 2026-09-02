/**
 * Formatting helpers.
 *
 * Project-wide convention: **every number the user sees is rendered in Persian
 * digits (۰۱۲۳…)**, with Persian thousands separators. Values sent back to the
 * API are always converted to ASCII first (see `toEnglishDigits`).
 */

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

/** 1234 → "۱۲۳۴" */
export const toPersianDigits = (value) =>
  String(value ?? '').replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)]);

/** "۱۲۳۴" | "١٢٣٤" → "1234" — used before anything is sent to the API. */
export const toEnglishDigits = (value) =>
  String(value ?? '')
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));

/** 68900000 → "۶۸٬۹۰۰٬۰۰۰" */
export const formatNumber = (value) => {
  const number = Number(toEnglishDigits(value)) || 0;
  return toPersianDigits(number.toLocaleString('en-US')).replace(/,/g, '٬');
};

/** 68900000 → "۶۸٬۹۰۰٬۰۰۰ تومان" */
export const formatPrice = (value) => `${formatNumber(value)} تومان`;

/** Compact form for tight spots: 68900000 → "۶۸.۹ میلیون تومان" */
export const formatPriceShort = (value) => {
  const number = Number(toEnglishDigits(value)) || 0;
  if (number >= 1_000_000) {
    const millions = Math.round(number / 100_000) / 10;
    return `${toPersianDigits(millions)} میلیون تومان`;
  }
  if (number >= 1000) {
    return `${toPersianDigits(Math.round(number / 1000))} هزار تومان`;
  }
  return formatPrice(number);
};

const DATE_FORMATTER = new Intl.DateTimeFormat('fa-IR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const DATETIME_FORMATTER = new Intl.DateTimeFormat('fa-IR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

/** SQLite stores `datetime('now')` in UTC without a zone marker — add it back. */
const parseSqliteDate = (value) => {
  if (!value) return null;
  const normalised = String(value).includes('T') ? value : `${String(value).replace(' ', 'T')}Z`;
  const date = new Date(normalised);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** "2026-09-02 10:22:31" → "۱۱ شهریور ۱۴۰۵" (Persian / Jalali calendar) */
export const formatDate = (value) => {
  const date = parseSqliteDate(value);
  return date ? DATE_FORMATTER.format(date) : '—';
};

export const formatDateTime = (value) => {
  const date = parseSqliteDate(value);
  return date ? DATETIME_FORMATTER.format(date) : '—';
};

/** Persian plural-free counter: "۳ کالا" */
export const formatCount = (value, unit = 'کالا') => `${toPersianDigits(value)} ${unit}`;
