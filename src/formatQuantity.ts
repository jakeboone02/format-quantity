import { vulgarToPlainMap } from './constants';
import type { FormatQuantityOptions, VulgarFraction } from './types';

/**
 * Formats a number (or string that appears to be a number)
 * as one would see it written in imperial measurements, e.g.
 * "1 1/2" instead of "1.5". To use vulgar fraction characters
 * like "½", pass `true` as the second argument. For other options
 * see the [documentation](https://jakeboone02.github.io/format-quantity/).
 */
export function formatQuantity(
  qty: string | number,
  options?: boolean | FormatQuantityOptions
) {
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

  /**
   * Determines if a number is close enough to dDecimal to consider
   * them equal for the purposes of this package.
   */
  const closeEnough = (n: number) =>
    Math.abs(dDecimal - n) < (opts.tolerance ?? 0.009);

  // Handle infinitely repeating decimals and floating point math quirks with
  // `closeEnough` since we'll never get an exact match for a switch case
  if (closeEnough(0.33)) {
    return `${sFloorFinal}${getFraction('⅓')}`;
  } else if (closeEnough(0.66)) {
    return `${sFloorFinal}${getFraction('⅔')}`;
  } else if (closeEnough(0.2)) {
    return `${sFloorFinal}${getFraction('⅕')}`;
  } else if (closeEnough(0.4)) {
    return `${sFloorFinal}${getFraction('⅖')}`;
  } else if (closeEnough(0.6)) {
    return `${sFloorFinal}${getFraction('⅗')}`;
  } else if (closeEnough(0.8)) {
    return `${sFloorFinal}${getFraction('⅘')}`;
  } else if (closeEnough(0.166)) {
    return `${sFloorFinal}${getFraction('⅙')}`;
  } else if (closeEnough(0.833)) {
    return `${sFloorFinal}${getFraction('⅚')}`;
  } else if (closeEnough(0.143)) {
    return `${sFloorFinal}${getFraction('⅐')}`;
  } else if (closeEnough(0.111)) {
    return `${sFloorFinal}${getFraction('⅑')}`;
  } else if (closeEnough(0.1)) {
    return `${sFloorFinal}${getFraction('⅒')}`;
  } else {
    switch (dDecimal) {
      case 0.125:
        return `${sFloorFinal}${getFraction('⅛')}`;
      case 0.25:
        return `${sFloorFinal}${getFraction('¼')}`;
      case 0.375:
        return `${sFloorFinal}${getFraction('⅜')}`;
      case 0.5:
        return `${sFloorFinal}${getFraction('½')}`;
      case 0.625:
        return `${sFloorFinal}${getFraction('⅝')}`;
      case 0.75:
        return `${sFloorFinal}${getFraction('¾')}`;
      case 0.875:
        return `${sFloorFinal}${getFraction('⅞')}`;
    }
  }

  return `${dQty}`;
}
