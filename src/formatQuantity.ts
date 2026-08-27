import { numericQuantity } from 'numeric-quantity';
import { defaultOptions, fractionDecimalMatches, vulgarToAsciiMap } from './constants';
import type {
  FormatQuantity,
  ResolvedFormatQuantityOptions,
  SimpleFraction,
  Sixteenth,
  VulgarFraction,
} from './types';

const superscriptDigits = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const subscriptDigits = '₀₁₂₃₄₅₆₇₈₉';

// oxlint-disable-next-line typescript/no-misused-spread
const toSuperscript = (s: string) => [...s].map(c => superscriptDigits[+c]).join('');
// oxlint-disable-next-line typescript/no-misused-spread
const toSubscript = (s: string) => [...s].map(c => subscriptDigits[+c]).join('');

/**
 * Applies the `vulgarFractions` or `fractionSlash` options as necessary.
 */
const getFraction = (
  vulgarFractionOrSixteenth: VulgarFraction | Sixteenth,
  { fractionSlash, vulgarFractions }: ResolvedFormatQuantityOptions
) => {
  if (vulgarFractions) {
    return vulgarFractionOrSixteenth;
  }

  const plainFraction: SimpleFraction =
    vulgarToAsciiMap[vulgarFractionOrSixteenth as VulgarFraction] ?? vulgarFractionOrSixteenth;

  if (fractionSlash) {
    const [num, den] = plainFraction.split('/');
    return `${toSuperscript(num)}⁄${toSubscript(den)}`;
  }

  return plainFraction;
};

/**
 * Only `false` (matching disabled) or a non-negative number is a valid
 * `tolerance`. Everything else—negative numbers, `NaN`, non-numbers,
 * `null`, `undefined`—resolves to {@link defaultTolerance}.
 */
const isValidTolerance = (tolerance: unknown): tolerance is number | false =>
  tolerance === false || (typeof tolerance === 'number' && tolerance >= 0);

/**
 * Merges options object with default options, converting boolean to object if necessary.
 */
const normalizeOptions = (
  options: Parameters<FormatQuantity>[1]
): ResolvedFormatQuantityOptions => {
  const opts: ResolvedFormatQuantityOptions = {
    ...defaultOptions,
    ...(typeof options === 'boolean' ? { vulgarFractions: options } : options),
  };

  if (!isValidTolerance(opts.tolerance)) {
    opts.tolerance = defaultOptions.tolerance;
  }

  return opts;
};

// oxfmt-ignore
const romanNumeralsByPlace = [
  '', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM',
  '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC',
  '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX',
] as const;

/**
 * Formats a number as Roman numerals. The number must be between
 * 1 and 3999, inclusive; any other value—including non-numbers,
 * `NaN`, and non-finite numbers—yields `null`.
 */
export const formatRomanNumerals = (qty: number): string | null => {
  if (typeof qty !== 'number' || !Number.isFinite(qty) || qty < 1 || qty >= 4000) {
    return null;
  }

  const floored = Math.floor(qty);

  const digits = `${floored}`.split('');
  let roman = '';
  let i = 3;
  while (i--) {
    roman = `${romanNumeralsByPlace[+digits.pop()! + i * 10] || ''}${roman}`;
  }

  return `${Array(+digits.join('') + 1).join('M')}${roman}`;
};

/**
 * Formats a number (or string that appears to be a number)
 * as one would see it written in imperial measurements, e.g.
 * "1 1/2" instead of "1.5". To use vulgar fraction characters
 * like "½", pass `true` as the second argument. For other options
 * see {@link FormatQuantityOptions}.
 */
export const formatQuantity: FormatQuantity = (qty, options) => {
  // Only numbers and strings are accepted. Anything else (`bigint`, arrays like
  // `[1]` that would coerce to a numeric string, objects, booleans, nullish) is
  // rejected up front so off-type inputs behave consistently.
  if (typeof qty !== 'number' && typeof qty !== 'string') {
    return null;
  }

  const qtyAsNumber =
    typeof qty !== 'number'
      ? numericQuantity(qty, { round: false, allowTrailingInvalid: true })
      : qty;

  // Return `null` if input is not number-like.
  if (isNaN(qtyAsNumber)) {
    return null;
  }

  // Return an empty string if the value is zero.
  // TODO: Consider a `zeroDisplay` option (e.g. `{ zeroDisplay: "0" }`) so
  // callers outside the recipe-ingredient use case can get "0" instead of "".
  if (qtyAsNumber === 0) {
    return '';
  }

  // The default options parameter in the function signature only takes effect
  // if the parameter is `undefined`. The nullish coalescing operator below
  // covers the `null` case.
  const opts = normalizeOptions(options);

  if (opts.romanNumerals) {
    return formatRomanNumerals(qtyAsNumber);
  }

  const absoluteValue = Math.abs(qtyAsNumber);
  const flooredAbsVal = Math.floor(absoluteValue);
  const sign = qtyAsNumber < 0 ? '-' : '';
  const wholeStr = `${flooredAbsVal || ''}`;
  const decimalValue = absoluteValue - flooredAbsVal;

  // For integers just return the given value as a string.
  if (decimalValue === 0) {
    return `${qtyAsNumber}`;
  }

  let closestMatch: VulgarFraction | Sixteenth | null = null;
  let closestMatchDiff = Infinity;
  // `tolerance: false` disables fraction matching entirely.
  if (opts.tolerance !== false) {
    for (const [num, vf] of fractionDecimalMatches) {
      const diff = Math.abs(decimalValue - num);
      // `diff === 0` keeps exact quotients matching even at `tolerance: 0`.
      if (diff < opts.tolerance || diff === 0) {
        if (diff === 0) {
          closestMatch = vf;
          break;
        }
        if (diff < closestMatchDiff) {
          closestMatch = vf;
          closestMatchDiff = diff;
        }
      }
    }
  }

  if (closestMatch) {
    const fraction = getFraction(closestMatch, opts);
    const isVulgar = fraction in vulgarToAsciiMap;
    const sep = wholeStr ? (opts.separator ?? (isVulgar ? '' : ' ')) : '';
    return `${sign}${wholeStr}${sep}${fraction}`;
  }

  return `${qtyAsNumber}`;
};
