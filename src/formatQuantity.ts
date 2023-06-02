import {
  defaultTolerance,
  fractionDecimalMatches,
  vulgarFractions,
  vulgarToPlainMap,
} from './constants';
import type {
  FormatQuantity,
  FormatQuantityOptions,
  SimpleFraction,
  VulgarFraction,
} from './types';

/**
 * Determines if two numbers are close enough to consider
 * them equal for the purposes of this package.
 */
const closeEnough = (n1: number, n2: number, tolerance: number) =>
  Math.abs(n1 - n2) < tolerance;

const getFraction = (
  vulgarFraction: VulgarFraction | SimpleFraction,
  { fractionSlash, vulgarFractions }: FormatQuantityOptions
) => {
  if (vulgarFractions) {
    return vulgarFraction;
  }

  const plainFraction = vulgarToPlainMap[vulgarFraction];

  if (fractionSlash) {
    return plainFraction.replace('/', '⁄');
  }

  return plainFraction;
};

/**
 * Formats a number (or string that appears to be a number)
 * as one would see it written in imperial measurements, e.g.
 * "1 1/2" instead of "1.5". To use vulgar fraction characters
 * like "½", pass `true` as the second argument. For other options
 * see the [documentation](https://jakeboone02.github.io/format-quantity/).
 */
export const formatQuantity: FormatQuantity = (qty, options = false) => {
  const dQty = typeof qty === 'string' ? parseFloat(qty) : qty;

  // Return `null` if input is not number-like
  if (isNaN(dQty) || dQty === null) {
    return null;
  }

  // Return an empty string if the value is zero
  if (dQty === 0) {
    return '';
  }

  const dQtyAbs = Math.abs(dQty);
  const iFloor = Math.floor(dQtyAbs);
  const sFloor = `${dQty < 0 ? '-' : ''}${iFloor === 0 ? '' : `${iFloor} `}`;
  const dDecimal = dQtyAbs - iFloor;

  // For integers just return the given value as a string
  if (dDecimal === 0) {
    return `${dQty}`;
  }

  const opts: FormatQuantityOptions =
    typeof options === 'boolean' ? { vulgarFractions: options } : options ?? {};

  for (const [num, vf] of fractionDecimalMatches) {
    if (closeEnough(dDecimal, num, opts.tolerance ?? defaultTolerance)) {
      const fraction = getFraction(vf, opts);
      const int = vulgarFractions.includes(fraction) ? sFloor.trim() : sFloor;
      return `${int}${fraction}`;
    }
  }

  return `${dQty}`;
};
