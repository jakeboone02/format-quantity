export interface FormatQuantityOptions {
  /**
   * Output unicode vulgar fractions--like "½" instead of "1/2"--when appropriate.
   */
  vulgarFractions?: boolean;
}

export type VulgarFraction =
  | '⅓'
  | '⅔'
  | '⅕'
  | '⅖'
  | '⅗'
  | '⅘'
  | '⅛'
  | '¼'
  | '⅜'
  | '½'
  | '⅝'
  | '¾'
  | '⅞'
  | '⅐'
  | '⅑'
  | '⅒'
  | '⅙'
  | '⅚';

/**
 * Determines if two numbers are close enough to consider
 * them equal for the purposes of this package.
 */
const closeEnough = (a: number, b: number) => Math.abs(a - b) < 0.009;

/**
 * A map of unicode vulgar fractions to their traditional equivalents.
 */
export const vulgarToPlainMap: Record<VulgarFraction, `${number}/${number}`> = {
  '⅓': '1/3',
  '⅔': '2/3',
  '⅕': '1/5',
  '⅖': '2/5',
  '⅗': '3/5',
  '⅘': '4/5',
  '⅛': '1/8',
  '¼': '1/4',
  '⅜': '3/8',
  '½': '1/2',
  '⅝': '5/8',
  '¾': '3/4',
  '⅞': '7/8',
  '⅐': '1/7',
  '⅑': '1/9',
  '⅒': '1/10',
  '⅙': '1/6',
  '⅚': '5/6',
};

/**
 * Formats a number (or string that appears to be a number)
 * as one would see it written in imperial measurements, e.g.
 * "1 1/2" instead of "1.5". To use unicode vulgar fraction
 * characters like "½", pass `true` or `{vulgarFractions: true}`
 * as the second argument.
 */
function formatQuantity(
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

  const useVulgarFractions =
    options === true ||
    (typeof options === 'object' && !!options.vulgarFractions);

  const sFloorFinal = useVulgarFractions ? sFloor.trim() : sFloor;

  const getFraction = (vulgarFraction: VulgarFraction) =>
    useVulgarFractions ? vulgarFraction : vulgarToPlainMap[vulgarFraction];

  // Handle infinitely repeating decimals and floating point math quirks with
  // `closeEnough` since we'll never get an exact match for a switch case
  if (closeEnough(dDecimal, 0.33)) {
    return `${sFloorFinal}${getFraction('⅓')}`;
  } else if (closeEnough(dDecimal, 0.66)) {
    return `${sFloorFinal}${getFraction('⅔')}`;
  } else if (closeEnough(dDecimal, 0.2)) {
    return `${sFloorFinal}${getFraction('⅕')}`;
  } else if (closeEnough(dDecimal, 0.4)) {
    return `${sFloorFinal}${getFraction('⅖')}`;
  } else if (closeEnough(dDecimal, 0.6)) {
    return `${sFloorFinal}${getFraction('⅗')}`;
  } else if (closeEnough(dDecimal, 0.8)) {
    return `${sFloorFinal}${getFraction('⅘')}`;
  } else if (closeEnough(dDecimal, 0.166)) {
    return `${sFloorFinal}${getFraction('⅙')}`;
  } else if (closeEnough(dDecimal, 0.833)) {
    return `${sFloorFinal}${getFraction('⅚')}`;
  } else if (closeEnough(dDecimal, 0.143)) {
    return `${sFloorFinal}${getFraction('⅐')}`;
  } else if (closeEnough(dDecimal, 0.111)) {
    return `${sFloorFinal}${getFraction('⅑')}`;
  } else if (closeEnough(dDecimal, 0.1)) {
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

export default formatQuantity;
