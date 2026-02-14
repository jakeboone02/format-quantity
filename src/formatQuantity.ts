import { numericQuantity } from 'numeric-quantity';
import {
  defaultOptions,
  fractionDecimalMatches,
  vulgarToAsciiMap,
} from './constants';
import type {
  FormatQuantity,
  FormatQuantityOptions,
  ResolvedFormatQuantityOptions,
  SimpleFraction,
  Sixteenth,
  VulgarFraction,
} from './types';

/**
 * Determines if two numbers are close enough to consider
 * them equal for the purposes of this package.
 */
const closeEnough = (n1: number, n2: number, tolerance: number) =>
  Math.abs(n1 - n2) < tolerance;

const superscriptDigits = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const subscriptDigits = '₀₁₂₃₄₅₆₇₈₉';

const toSuperscript = (s: string) => {
  let r = '';
  for (let i = 0; i < s.length; i++) r += superscriptDigits[+s[i]];
  return r;
};
const toSubscript = (s: string) => {
  let r = '';
  for (let i = 0; i < s.length; i++) r += subscriptDigits[+s[i]];
  return r;
};

/**
 * Applies the `vulgarFractions` or `fractionSlash` options as necessary.
 */
const getFraction = (
  vulgarFractionOrSixteenth: VulgarFraction | Sixteenth,
  { fractionSlash, vulgarFractions }: FormatQuantityOptions
) => {
  if (vulgarFractions) {
    return vulgarFractionOrSixteenth;
  }

  const plainFraction: SimpleFraction =
    vulgarToAsciiMap[vulgarFractionOrSixteenth as VulgarFraction] ??
    vulgarFractionOrSixteenth;

  if (fractionSlash) {
    const [num, den] = plainFraction.split('/');
    return `${toSuperscript(num)}⁄${toSubscript(den)}`;
  }

  return plainFraction;
};

/**
 * Merges options object with default options, converting boolean to object if necessary.
 */
const normalizeOptions = (
  options: Parameters<FormatQuantity>[1]
): ResolvedFormatQuantityOptions => ({
  ...defaultOptions,
  ...(typeof options === 'boolean' ? { vulgarFractions: options } : options),
});

// prettier-ignore
const romanNumeralValueKey = [
  "", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
  "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
  "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX",
] as const;

/**
 * Formats a number as Roman numerals. The number must be between
 * 1 and 3999, inclusive.
 */
export const formatRomanNumerals = (qty: number): string | null => {
  if (typeof qty !== 'number' || isNaN(qty)) {
    return null;
  }

  if (qty < 1 || qty >= 4000) {
    return '';
  }

  const floored = Math.floor(qty);

  const digits = `${floored}`.split('');
  let roman = '';
  let i = 3;
  while (i--) {
    roman = `${romanNumeralValueKey[+digits.pop()! + i * 10] || ''}${roman}`;
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
export const formatQuantity: FormatQuantity = (
  qty,
  options = defaultOptions
) => {
  const qtyAsNumber =
    typeof qty === 'string'
      ? numericQuantity(qty, { round: false, allowTrailingInvalid: true })
      : qty;

  // Return `null` if input is not number-like.
  if (isNaN(qtyAsNumber) || qtyAsNumber === null) {
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
  const opts = normalizeOptions(options ?? defaultOptions);

  if (opts.romanNumerals) {
    return formatRomanNumerals(qtyAsNumber);
  }

  const absoluteValue = Math.abs(qtyAsNumber);
  const flooredAbsVal = Math.floor(absoluteValue);
  const sign = qtyAsNumber < 0 ? '-' : '';
  const wholeStr = flooredAbsVal === 0 ? '' : `${flooredAbsVal}`;
  const decimalValue = absoluteValue - flooredAbsVal;

  // For integers just return the given value as a string.
  if (decimalValue === 0) {
    return `${qtyAsNumber}`;
  }

  for (const [num, vf] of fractionDecimalMatches) {
    if (closeEnough(decimalValue, num, opts.tolerance)) {
      const fraction = getFraction(vf, opts);
      const isVulgar = fraction in vulgarToAsciiMap;
      const sep = wholeStr ? (opts.separator ?? (isVulgar ? '' : ' ')) : '';
      return `${sign}${wholeStr}${sep}${fraction}`;
    }
  }

  return `${qtyAsNumber}`;
};
