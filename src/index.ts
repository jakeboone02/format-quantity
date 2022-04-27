export interface FormatQuantityOptions {
  /**
   * Output vulgar fractions, like "½" instead of "1/2", when appropriate.
   * Overrides the `fractionSlash` option.
   */
  vulgarFractions?: boolean;
  /**
   * Amount by which a number can deviate from the calculated quotient to be
   * considered a match. For example, 0.66 is close enough to 2 ÷ 3 (which
   * is 0.66666... repeating) to be considered equivalent so the function
   * will return "2/3". The smaller this number, the higher the likelihood that
   * the function will return a decimal instead of a fraction or mixed number.
   *
   * @default 0.009
   */
  tolerance?: number;
  /**
   * Output the unicode fraction slash character (⁄) instead of the "solidus"
   * slash (/) for fractions. Overridden by the `vulgarFractions` option.
   */
  fractionSlash?: boolean;
}

export type VulgarFraction =
  | '¼' // '\u00bc' | 0.25
  | '½' // '\u00bd' | 0.5
  | '¾' // '\u00be' | 0.75
  | '⅐' // '\u2150' | 0.142857...
  | '⅑' // '\u2151' | 0.111...
  | '⅒' // '\u2152' | 0.1
  | '⅓' // '\u2153' | 0.333...
  | '⅔' // '\u2154' | 0.666...
  | '⅕' // '\u2155' | 0.2
  | '⅖' // '\u2156' | 0.4
  | '⅗' // '\u2157' | 0.6
  | '⅘' // '\u2158' | 0.8
  | '⅙' // '\u2159' | 0.166...
  | '⅚' // '\u215a' | 0.833...
  | '⅛' // '\u215b' | 0.125
  | '⅜' // '\u215c' | 0.375
  | '⅝' // '\u215d' | 0.625
  | '⅞'; // '\u215e' | 0.875

/**
 * A map of vulgar fractions to their traditional ASCII equivalents.
 */
export const vulgarToPlainMap: {
  [vf in VulgarFraction]: `${number}/${number}`;
} = {
  '¼': '1/4',
  '½': '1/2',
  '¾': '3/4',
  '⅐': '1/7',
  '⅑': '1/9',
  '⅒': '1/10',
  '⅓': '1/3',
  '⅔': '2/3',
  '⅕': '1/5',
  '⅖': '2/5',
  '⅗': '3/5',
  '⅘': '4/5',
  '⅙': '1/6',
  '⅚': '5/6',
  '⅛': '1/8',
  '⅜': '3/8',
  '⅝': '5/8',
  '⅞': '7/8',
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

export default formatQuantity;
