import {
  defaultTolerance,
  fractionDecimalMatches,
  vulgarToPlainMap,
} from './constants';
import type {
  FormatQuantity,
  FormatQuantityOptions,
  VulgarFraction,
} from './types';

/**
 * Determines if two numbers are close enough to consider
 * them equal for the purposes of this package.
 */
const closeEnough = (n1: number, n2: number, tolerance: number) =>
  Math.abs(n1 - n2) < tolerance;

/**
 * Formats a number (or string that appears to be a number)
 * as one would see it written in imperial measurements, e.g.
 * "1 1/2" instead of "1.5". To use vulgar fraction characters
 * like "½", pass `true` as the second argument. For other options
 * see the [documentation](https://jakeboone02.github.io/format-quantity/).
 */
export const formatQuantity: FormatQuantity = (qty, options) => {
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
  const sFloor = iFloor === 0.0 ? '' : `${dQty < 0 ? '-' : ''}${iFloor} `;
  const dDecimal = dQtyAbs - iFloor;

  // For integers just return the given value as a string
  if (dDecimal === 0) {
    return `${dQty}`;
  }

  const opts: FormatQuantityOptions =
    typeof options === 'boolean' ? { vulgarFractions: options } : options ?? {};

  const sFloorFinal = opts.vulgarFractions ? sFloor.trim() : sFloor;

  const getFraction = (vulgarFraction: VulgarFraction) =>
    opts.vulgarFractions
      ? vulgarFraction
      : opts.fractionSlash
      ? vulgarToPlainMap[vulgarFraction].replace('/', '⁄')
      : vulgarToPlainMap[vulgarFraction];

  for (const [num, vf] of fractionDecimalMatches) {
    if (closeEnough(dDecimal, num, opts.tolerance ?? defaultTolerance)) {
      return `${sFloorFinal}${getFraction(vf)}`;
    }
  }

  return `${dQty}`;
};
