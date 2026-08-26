import type {
  ResolvedFormatQuantityOptions,
  SimpleFraction,
  Sixteenth,
  VulgarFraction,
} from './types';

/**
 * Default tolerance used by {@link formatQuantity} when determining if a number
 * is close enough to a fraction value to be considered equivalent.
 */
export const defaultTolerance = 0.0075 as const;

/**
 * Default options for {@link formatQuantity}.
 */
export const defaultOptions: ResolvedFormatQuantityOptions = {
  vulgarFractions: false,
  tolerance: defaultTolerance,
  fractionSlash: false,
  romanNumerals: false,
} as const;

/**
 * Map of vulgar fractions to their traditional ASCII equivalents.
 */
export const vulgarToAsciiMap: Record<VulgarFraction, SimpleFraction> = {
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
} as const;

/**
 * Map of "close enough" values to the {@link VulgarFraction} or {@link Sixteenth} fraction
 * string matches. The value +/- the `tolerance` option (or {@link defaultTolerance} if not
 * specified) is considered close enough to match the fraction.
 */
export const fractionDecimalMatches: [number, VulgarFraction | Sixteenth][] = [
  [1 / 3, '⅓'],
  [2 / 3, '⅔'],
  [1 / 5, '⅕'],
  [2 / 5, '⅖'],
  [3 / 5, '⅗'],
  [4 / 5, '⅘'],
  [1 / 6, '⅙'],
  [5 / 6, '⅚'],
  [1 / 7, '⅐'],
  [1 / 9, '⅑'],
  [1 / 10, '⅒'],
  [1 / 8, '⅛'],
  [1 / 4, '¼'],
  [3 / 8, '⅜'],
  [1 / 2, '½'],
  [5 / 8, '⅝'],
  [3 / 4, '¾'],
  [7 / 8, '⅞'],
  [1 / 16, '1/16'],
  [3 / 16, '3/16'],
  [5 / 16, '5/16'],
  [7 / 16, '7/16'],
  [9 / 16, '9/16'],
  [11 / 16, '11/16'],
  [13 / 16, '13/16'],
  [15 / 16, '15/16'],
] as const;
