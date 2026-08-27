import { describe, expect, test } from 'bun:test';
import { numericQuantity } from 'numeric-quantity';
import { formatQuantity, formatRomanNumerals } from './formatQuantity';

/**
 * Direct coverage of `formatRomanNumerals`, which was previously exercised only
 * indirectly through `formatQuantity`.
 */

const nqRoman = { romanNumerals: true, round: false, verbose: false } as const;

describe('formatRomanNumerals: range boundaries', () => {
  const cases: [unknown, string | null][] = [
    // Below the supported range.
    [-4000, null],
    [-3999, null],
    [-1, null],
    [-0.5, null],
    [0, null],
    [0.5, null],
    [0.999, null],
    // In range.
    [1, 'I'],
    [1.000001, 'I'],
    [1.999999, 'I'],
    [3998, 'MMMCMXCVIII'],
    [3999, 'MMMCMXCIX'],
    [3999.999999, 'MMMCMXCIX'],
    // Above the supported range.
    [4000, null],
    [4000.1, null],
    [1e21, null],
    // Not a usable number at all.
    [NaN, null],
    [Infinity, null],
    [-Infinity, null],
    ['NaN', null],
    ['1', null],
    ['MCMXCIX', null],
    [null, null],
    [undefined, null],
    [true, null],
    [{}, null],
    [[], null],
  ];

  for (const [input, expected] of cases) {
    test(`${String(input)} → ${expected}`, () => {
      expect(formatRomanNumerals(input as number)).toBe(expected);
    });
  }
});

describe('formatRomanNumerals: place-value construction', () => {
  const cases: [number, string][] = [
    [4, 'IV'],
    [9, 'IX'],
    [10, 'X'],
    [40, 'XL'],
    [49, 'XLIX'],
    [50, 'L'],
    [90, 'XC'],
    [99, 'XCIX'],
    [100, 'C'],
    [400, 'CD'],
    [444, 'CDXLIV'],
    [500, 'D'],
    [900, 'CM'],
    [999, 'CMXCIX'],
    [1000, 'M'],
    [1987, 'MCMLXXXVII'],
    [2000, 'MM'],
    [3000, 'MMM'],
    [3888, 'MMMDCCCLXXXVIII'],
  ];

  for (const [input, expected] of cases) {
    test(`${input} → ${expected}`, () => {
      expect(formatRomanNumerals(input)).toBe(expected);
    });
  }
});

describe('formatRomanNumerals: exhaustive 1–3999', () => {
  test('every value in range round-trips through numericQuantity', () => {
    for (let n = 1; n < 4000; n++) {
      const roman = formatRomanNumerals(n);
      expect(`${n}: ${roman}`).not.toBe(`${n}: null`);
      expect(`${n}: ${numericQuantity(roman!, nqRoman)}`).toBe(`${n}: ${n}`);
    }
  });

  test('every value in range uses only Roman numeral characters', () => {
    const invalid = [];
    for (let n = 1; n < 4000; n++) {
      if (!/^[MDCLXVI]+$/.test(formatRomanNumerals(n)!)) {
        invalid.push(n);
      }
    }
    expect(invalid).toEqual([]);
  });

  test('every value in range produces a distinct numeral', () => {
    const seen = new Set<string>();
    for (let n = 1; n < 4000; n++) {
      seen.add(formatRomanNumerals(n)!);
    }
    expect(seen.size).toBe(3999);
  });

  test('the fractional part is discarded via Math.floor', () => {
    for (let n = 1; n < 4000; n++) {
      const roman = formatRomanNumerals(n);
      expect(`${n}.5 → ${formatRomanNumerals(n + 0.5)}`).toBe(`${n}.5 → ${roman}`);
    }
  });
});

describe('formatQuantity delegates to formatRomanNumerals', () => {
  test('matches the direct call across the supported range', () => {
    for (let n = 1; n < 4000; n++) {
      expect(`${n}: ${formatQuantity(n, { romanNumerals: true })}`).toBe(
        `${n}: ${formatRomanNumerals(n)}`
      );
    }
  });

  test('parses string inputs before formatting', () => {
    expect(formatQuantity('1214', { romanNumerals: true })).toBe('MCCXIV');
    expect(formatQuantity('12 1/2', { romanNumerals: true })).toBe('XII');
    expect(formatQuantity('1,984', { romanNumerals: true })).toBe('MCMLXXXIV');
  });

  test('overrides every other option', () => {
    const expected = 'MCCXIV';
    const optionSets = [
      { vulgarFractions: true },
      { fractionSlash: true },
      { separator: '-' },
      { tolerance: 0 },
      { tolerance: false },
      { tolerance: 0.4 },
      { vulgarFractions: true, fractionSlash: true, separator: '~' },
    ] as const;

    for (const options of optionSets) {
      expect(formatQuantity(1214.75, { ...options, romanNumerals: true })).toBe(expected);
    }
  });

  test('zero is short-circuited before the romanNumerals option is read', () => {
    // `formatRomanNumerals(0)` is `null`, but `formatQuantity`'s
    // recipe-oriented zero rule takes precedence.
    expect(formatRomanNumerals(0)).toBe(null);
    expect(formatQuantity(0, { romanNumerals: true })).toBe('');
  });
});
