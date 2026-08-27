import type { FormatQuantity } from './types';

export type FormatQuantityTests = Record<
  string,
  (
    | [Parameters<FormatQuantity>[0], ReturnType<FormatQuantity>]
    | [Parameters<FormatQuantity>[0], ReturnType<FormatQuantity>, Parameters<FormatQuantity>[1]]
  )[]
>;

const romanNumerals = true;
const fractionSlash = true;
const vulgarFractions = true;

export const formatQuantityTests: FormatQuantityTests = {
  'returns null for NaN, non-numeric strings, invalid inputs': [
    [NaN, null],
    ['NaN', null],
    // @ts-expect-error invalid input
    [null, null],
    // @ts-expect-error invalid input
    [undefined, null],
    // @ts-expect-error invalid input
    [true, null],
    // @ts-expect-error invalid input
    [false, null],
    // @ts-expect-error invalid input
    [{}, null],
    // @ts-expect-error invalid input
    [[], null],
    // Would coerce to the numeric string "1", but arrays are still rejected.
    // @ts-expect-error invalid input
    [[1], null],
    // @ts-expect-error invalid input
    [['1 1/2'], null],
    // @ts-expect-error invalid input
    [1n, null],
    // @ts-expect-error invalid input
    [Symbol.iterator, null],
    // @ts-expect-error invalid input
    [new Date(0), null],
    // Strings that are not a recognized numeric format.
    ['', null],
    [' ', null],
    ['abc', null],
    ['--1', null],
  ],
  'string inputs: trailing invalid characters are ignored': [
    // `allowTrailingInvalid` is passed to `numericQuantity`, so a leading
    // numeric portion wins even when the rest of the string is garbage.
    ['1.5abc', '1 1/2'],
    ['12 apples', '12'],
    ['1/2/3', '1/2'],
    ['2 3/4 cups', '2 3/4'],
    ['1½ tsp', '1 1/2'],
    // ...but there has to be a leading numeric portion.
    ['abc1.5', null],
  ],
  'returns blank string for zero': [
    [0, ''],
    [1 - 1, ''],
  ],
  integers: [
    [1, '1'],
    [1 + 1, '2'],
    [1, '1', true],
    [100, '100'],
  ],
  'negative values': [
    [-1, '-1'],
    [1 - 3, '-2'],
    [-1, '-1', true],
    [-1.5, '-1 1/2'],
    [-1.5, '-1½', true],
    [-0.5, '-1/2'],
    [-0.5, '-½', true],
    [-0.5, '-¹⁄₂', { fractionSlash }],
  ],
  'returns most decimal values as-is': [
    [1.45, '1.45'],
    [-1.45, '-1.45'],
  ],
  halves: [
    [1.49, '1.49'],
    [1.5, '1 1/2'],
    [1 + 1 / 2, '1 1/2'],
    [1.50001, '1 1/2'],
    [1.49999, '1 1/2'],
    [1.5, '1½', true],
    [1.52, '1.52'],
  ],
  thirds: [
    [1.32, '1.32'],
    [1.33, '1 1/3'],
    [1 + 1 / 3, '1 1/3'],
    [1.33, '1⅓', true],
    [1.3333333333333333, '1 1/3'],
    [1.34, '1 1/3'],
    [1.35, '1.35'],
    [1.65, '1.65'],
    [1.66, '1 2/3'],
    [1 + 2 / 3, '1 2/3'],
    [1.66, '1⅔', true],
    [1.667, '1 2/3'],
    [1.6666666666666666, '1 2/3'], // oxlint-disable-line eslint/no-loss-of-precision
    [1.67, '1 2/3'],
    [1.68, '1.68'],
  ],
  quarters: [
    [1.24, '1.24'],
    [1.25, '1 1/4'],
    [1 + 1 / 4, '1 1/4'],
    [1.25, '1¼', true],
    [-1.25, '-1 1/4'],
    [1.26, '1.26'],
    [1.74, '1.74'],
    [1.75, '1 3/4'],
    [1 + 3 / 4, '1 3/4'],
    [1.75, '1¾', true],
    [-1.75, '-1 3/4'],
    [1.76, '1.76'],
  ],
  fifths: [
    [0.2, '1/5'],
    [0.2, '⅕', true],
    [1.2, '1 1/5'],
    [1 + 1 / 5, '1 1/5'],
    [1.2, '1⅕', true],
    [0.4, '2/5'],
    [1.4, '1 2/5'],
    [1 + 2 / 5, '1 2/5'],
    [1.4, '1⅖', true],
    [0.6, '3/5'],
    [1.6, '1 3/5'],
    [1 + 3 / 5, '1 3/5'],
    [1.6, '1⅗', true],
    [0.8, '4/5'],
    [1.8, '1 4/5'],
    [1 + 4 / 5, '1 4/5'],
    [1.8, '1⅘', true],
  ],
  sixths: [
    [1 + 1 / 6, '1 1/6'],
    [1.166, '1⅙', true],
    [1 + 5 / 6, '1 5/6'],
    [1.833, '1⅚', true],
  ],
  sevenths: [
    [1 + 1 / 7, '1 1/7'],
    [1.1428, '1⅐', true],
  ],
  eighths: [
    [1.125, '1 1/8'],
    [1 + 1 / 8, '1 1/8'],
    [1.125, '1⅛', true],
    [1.375, '1 3/8'],
    [1 + 3 / 8, '1 3/8'],
    [1.375, '1⅜', true],
    [1.625, '1 5/8'],
    [1 + 5 / 8, '1 5/8'],
    [1.625, '1⅝', true],
    [1.875, '1 7/8'],
    [1 + 7 / 8, '1 7/8'],
    [1.875, '1⅞', true],
  ],
  ninths: [
    [1 + 1 / 9, '1 1/9'],
    [1.11111, '1⅑', true],
  ],
  tenths: [
    [1 + 1 / 10, '1 1/10'],
    [1.1, '1⅒', true],
  ],
  sixteenths: [
    [1 + 1 / 16, '1 1/16'],
    [1.0625, '1 1/16'],
    [1.0625, '1 1/16', { vulgarFractions }],
    [1.0625, '1 ¹⁄₁₆', { fractionSlash }],
    [1 + 3 / 16, '1 3/16'],
    [1.1875, '1 3/16'],
    [1.1875, '1 3/16', { vulgarFractions }],
    [1.1875, '1 ³⁄₁₆', { fractionSlash }],
    [1 + 5 / 16, '1 5/16'],
    [1.3125, '1 5/16'],
    [1.3125, '1 5/16', { vulgarFractions }],
    [1.3125, '1 ⁵⁄₁₆', { fractionSlash }],
    [1 + 7 / 16, '1 7/16'],
    [1.4375, '1 7/16'],
    [1.4375, '1 7/16', { vulgarFractions }],
    [1.4375, '1 ⁷⁄₁₆', { fractionSlash }],
    [1 + 9 / 16, '1 9/16'],
    [1.5625, '1 9/16'],
    [1.5625, '1 9/16', { vulgarFractions }],
    [1.5625, '1 ⁹⁄₁₆', { fractionSlash }],
    [1 + 11 / 16, '1 11/16'],
    [1.6875, '1 11/16'],
    [1.6875, '1 11/16', { vulgarFractions }],
    [1.6875, '1 ¹¹⁄₁₆', { fractionSlash }],
    [1 + 13 / 16, '1 13/16'],
    [1.8125, '1 13/16'],
    [1.8125, '1 13/16', { vulgarFractions }],
    [1.8125, '1 ¹³⁄₁₆', { fractionSlash }],
    [1 + 15 / 16, '1 15/16'],
    [1.9375, '1 15/16'],
    [1.9375, '1 15/16', { vulgarFractions }],
    [1.9375, '1 ¹⁵⁄₁₆', { fractionSlash }],
  ],
  'string inputs: mixed numbers': [
    ['1 1/2', '1 1/2'],
    ['2 3/4', '2 3/4'],
    ['1 1/2', '1½', true],
    ['10 1/3', '10 1/3'],
  ],
  'string inputs: vulgar fraction strings': [
    ['½', '1/2'],
    ['½', '½', true],
    ['1½', '1 1/2'],
    ['1½', '1½', true],
    ['1⅓', '1 1/3'],
    ['⅞', '7/8'],
  ],
  'string inputs: bare fraction strings': [
    ['1/2', '1/2'],
    ['3/4', '3/4'],
    ['1/3', '1/3'],
  ],
  'string inputs: comma/underscore-separated': [
    ['1,000', '1000'],
    ['1,000.5', '1000 1/2'],
    ['1_000', '1000'],
    ['1_000.5', '1000 1/2'],
  ],
  'empty or invalid options': [
    [1.5, '1 1/2', 42 as any],
    [1.5, '1 1/2', 'string' as any],
    [1.5, '1 1/2', null as any],
    [1.5, '1 1/2', [] as any],
    [1.5, '1 1/2', {}],
  ],
  'vulgarFractions option': [
    [1.5, '1 1/2', { vulgarFractions: false }],
    [1.5, '1½', { vulgarFractions }],
  ],
  'fractionSlash option': [
    [1.5, '1 1/2', { fractionSlash: false }],
    [1.5, '1 ¹⁄₂', { fractionSlash }],
    [1.5, '1½', { fractionSlash, vulgarFractions }],
  ],
  'separator option': [
    [1.5, '1 1/2', { separator: ' ' }],
    [1.5, '1-1/2', { separator: '-' }],
    [1.5, '1½', { vulgarFractions }],
    [1.5, '1 ½', { separator: ' ', vulgarFractions }],
    [1.5, '1-½', { separator: '-', vulgarFractions }],
    [0.5, '1/2', { separator: '-' }],
    [-1.5, '-1-1/2', { separator: '-' }],
    [-0.5, '-1/2', { separator: '-' }],
    [1.5, '1\u00a01/2', { separator: '\u00a0' }],
  ],
  'separator option: combined with other options': [
    // separator × sixteenths (never vulgar, so the default separator is ' ')
    [1.0625, '1-1/16', { separator: '-' }],
    [1.9375, '1-15/16', { separator: '-' }],
    [1.0625, '1 1/16', { separator: ' ' }],
    [1.0625, '11/16', { separator: '' }],
    [-1.3125, '-1-5/16', { separator: '-' }],
    // Sixteenths ignore `vulgarFractions` (no vulgar code point exists).
    [1.0625, '1-1/16', { separator: '-', vulgarFractions }],
    // separator × fractionSlash
    [1.5, '1-¹⁄₂', { separator: '-', fractionSlash }],
    [1.5, '1¹⁄₂', { separator: '', fractionSlash }],
    [1.0625, '1-¹⁄₁₆', { separator: '-', fractionSlash }],
    [1.5, '1\u00a0¹⁄₂', { separator: '\u00a0', fractionSlash }],
    // separator × vulgarFractions (vulgarFractions overrides fractionSlash)
    [1.5, '1-½', { separator: '-', fractionSlash, vulgarFractions }],
    [1.5, '1 ½', { separator: ' ', fractionSlash, vulgarFractions }],
    [1.6875, '1-11/16', { separator: '-', fractionSlash, vulgarFractions }],
    // separator is ignored when there is no whole-number part
    [0.0625, '1/16', { separator: '-' }],
    [0.5, '¹⁄₂', { separator: '-', fractionSlash }],
    [-0.5, '-½', { separator: '-', vulgarFractions }],
    // separator is ignored for integers and Roman numerals
    [3, '3', { separator: '-' }],
    [12, 'XII', { separator: '-', romanNumerals }],
  ],
  'tolerance option': [
    // could be '1 1/3' with this tolerance, but '1 5/16' is closer
    [1.3, '1 5/16', { tolerance: 0.1 }],
    [1.1499, '1.1499', { tolerance: 0.000001 }],
    // @ts-expect-error invalid option type
    [1.3, '1.3', { tolerance: null }],
  ],
  'tolerance option: zero means exact quotients only': [
    [1.5, '1 1/2', { tolerance: 0 }],
    [0.5, '1/2', { tolerance: 0 }],
    [-1.5, '-1 1/2', { tolerance: 0 }],
    [1.5, '1½', { tolerance: 0, vulgarFractions }],
    [1.25, '1 1/4', { tolerance: 0 }],
    [1.0625, '1 1/16', { tolerance: 0 }],
    [1 / 3, '1/3', { tolerance: 0 }],
    // Near misses fall through to the decimal.
    [1.51, '1.51', { tolerance: 0 }],
    [1.50001, '1.50001', { tolerance: 0 }],
    [1.333, '1.333', { tolerance: 0 }],
    // Integers and zero are unaffected.
    [3, '3', { tolerance: 0 }],
    [0, '', { tolerance: 0 }],
  ],
  'tolerance option: false disables fraction matching': [
    [1.5, '1.5', { tolerance: false }],
    [0.5, '0.5', { tolerance: false }],
    [-1.5, '-1.5', { tolerance: false }],
    [1 / 3, '0.3333333333333333', { tolerance: false }],
    [1.0625, '1.0625', { tolerance: false }],
    // Other formatting options have nothing to apply to.
    [1.5, '1.5', { tolerance: false, vulgarFractions }],
    [1.5, '1.5', { tolerance: false, fractionSlash }],
    [1.5, '1.5', { tolerance: false, separator: '-' }],
    // Integers, zero, and Roman numerals are unaffected.
    [3, '3', { tolerance: false }],
    [0, '', { tolerance: false }],
    [12, 'XII', { tolerance: false, romanNumerals }],
    ['1 1/2', '1.5', { tolerance: false }],
  ],
  'tolerance option: invalid values resolve to the default': [
    // 1.333 is within the default tolerance of 1/3, so anything that resolves
    // to the default renders '1 1/3'.
    [1.333, '1 1/3'],
    [1.333, '1 1/3', {}],
    // @ts-expect-error invalid option type
    [1.333, '1 1/3', { tolerance: null }],
    [1.333, '1 1/3', { tolerance: undefined }],
    [1.333, '1 1/3', { tolerance: -1 }],
    [1.333, '1 1/3', { tolerance: -0.0001 }],
    // @ts-expect-error invalid option type
    [1.333, '1 1/3', { tolerance: '0.5' }],
    [1.333, '1 1/3', { tolerance: NaN }],
    // @ts-expect-error invalid option type
    [1.333, '1 1/3', { tolerance: true }],
    // @ts-expect-error invalid option type
    [1.333, '1 1/3', { tolerance: {} }],
    // @ts-expect-error invalid option type
    [1.333, '1 1/3', { tolerance: [] }],
    // ...and the same values leave 1.3 (outside the default window) alone.
    [1.3, '1.3'],
    [1.3, '1.3', { tolerance: -1 }],
    [1.3, '1.3', { tolerance: NaN }],
    // @ts-expect-error invalid option type
    [1.3, '1.3', { tolerance: '0.5' }],
  ],
  'tolerance option: infinite tolerance always matches the nearest anchor': [
    [1.5, '1 1/2', { tolerance: Infinity }],
    // 0.05 is nearer 1/16 (0.0625) than to any other anchor
    [1.05, '1 1/16', { tolerance: Infinity }],
    // 0.99 is nearer 15/16 (0.9375) than to any other anchor
    [1.99, '1 15/16', { tolerance: Infinity }],
  ],
  'zeroFormat option': [
    [0, '', { zeroFormat: '' }],
    [0, '0', { zeroFormat: '0' }],
    [0, 'zero', { zeroFormat: 'zero' }],
    [0, 'n/a', { zeroFormat: 'n/a' }],
    [0, 'none', { zeroFormat: 'none' }],
    [0, '0', { zeroFormat: '0', tolerance: 0 }],
    [0, 'zero', { zeroFormat: 'zero', tolerance: 0 }],
    [0, '0', { zeroFormat: '0', romanNumerals }],
    [0, 'zero', { zeroFormat: 'zero', romanNumerals }],
    [-0, 'negative zero', { zeroFormat: 'negative zero' }],
    // @ts-expect-error invalid option type
    [0, '', { zeroFormat: 0 }],
    // @ts-expect-error invalid option type
    [0, '', { zeroFormat: null }],
  ],
  'non-finite inputs are stringified as-is': [
    [Infinity, 'Infinity'],
    [-Infinity, '-Infinity'],
    ['1/0', 'Infinity'],
    ['-1/0', '-Infinity'],
    // The literal string "Infinity" is not a numeric format `numeric-quantity`
    // recognizes, so it is rejected like any other non-numeric string.
    ['Infinity', null],
    ['-Infinity', null],
    [Infinity, 'Infinity', true],
    [Infinity, 'Infinity', { separator: '-' }],
    [Infinity, 'Infinity', { tolerance: false }],
  ],
  'extreme magnitudes keep JavaScript exponential notation': [
    [1e21, '1e+21'],
    [-1e21, '-1e+21'],
    [1e-7, '1e-7'],
    [-1e-7, '-1e-7'],
    [Number.MAX_VALUE, '1.7976931348623157e+308'],
    [Number.MIN_VALUE, '5e-324'],
    // Just below the exponential threshold, output stays positional.
    [1e20, '100000000000000000000'],
  ],
  'Roman numerals': [
    ['NaN', null, { romanNumerals }],
    // Out of the 1–3999 range (inclusive) yields `null`.
    [0.9, null, { romanNumerals }],
    [-1, null, { romanNumerals }],
    [-3999, null, { romanNumerals }],
    [4000, null, { romanNumerals }],
    [4000.5, null, { romanNumerals }],
    [1e21, null, { romanNumerals }],
    // Zero is short-circuited before the `romanNumerals` option is read.
    [0, '', { romanNumerals }],
    [3999.99999, 'MMMCMXCIX', { romanNumerals }],
    [1.3, 'I', { romanNumerals }],
    [1.9, 'I', { romanNumerals }],
    [1, 'I', { romanNumerals }],
    [2, 'II', { romanNumerals }],
    [3, 'III', { romanNumerals }],
    [4, 'IV', { romanNumerals }],
    [5, 'V', { romanNumerals }],
    [6, 'VI', { romanNumerals }],
    [7, 'VII', { romanNumerals }],
    [8, 'VIII', { romanNumerals }],
    [9, 'IX', { romanNumerals }],
    [10, 'X', { romanNumerals }],
    [11, 'XI', { romanNumerals }],
    [12, 'XII', { romanNumerals }],
    [1214, 'MCCXIV', { romanNumerals }],
    // Make sure it favors the romanNumerals option
    [12, 'XII', { romanNumerals, fractionSlash }],
    [12, 'XII', { romanNumerals, vulgarFractions }],
    [12, 'XII', { romanNumerals, fractionSlash, vulgarFractions }],
  ],
};
