import { describe, expect, test } from 'bun:test';
import { numericQuantity } from 'numeric-quantity';
import { formatQuantity } from './formatQuantity';
import type { FormatQuantityOptions } from './types';

const nqOpts = { round: false } as const;

/**
 * Helper: number → formatQuantity → numericQuantity → assert ≈ original.
 */
const expectNumberRoundTrip = (
  n: number,
  fqOpts?: FormatQuantityOptions,
  nqExtra?: Parameters<typeof numericQuantity>[1]
) => {
  const str = formatQuantity(n, fqOpts);
  expect(str).not.toBeNull();
  const result = numericQuantity(str!, { ...nqOpts, ...nqExtra });
  expect(result).toBeCloseTo(n, 5);
};

/**
 * Helper: string → numericQuantity → formatQuantity → assert === original.
 */
const expectStringRoundTrip = (
  s: string,
  fqOpts?: FormatQuantityOptions,
  nqExtra?: Parameters<typeof numericQuantity>[1]
) => {
  const num = numericQuantity(s, { ...nqOpts, ...nqExtra });
  expect(num).not.toBeNaN();
  const result = formatQuantity(num, fqOpts);
  expect(result).toBe(s);
};

// ── Direction A: number → string → number ───────────────────────────

describe('Round trip A: number → string → number', () => {
  describe('A1: default options (ASCII fractions)', () => {
    const cases: [string, number][] = [
      ['1/2', 0.5],
      ['1/3', 1 / 3],
      ['2/3', 2 / 3],
      ['1/4', 0.25],
      ['3/4', 0.75],
      ['1/5', 0.2],
      ['2/5', 0.4],
      ['3/5', 0.6],
      ['4/5', 0.8],
      ['1/6', 1 / 6],
      ['5/6', 5 / 6],
      ['1/7', 1 / 7],
      ['1/8', 0.125],
      ['3/8', 0.375],
      ['5/8', 0.625],
      ['7/8', 0.875],
      ['1/9', 1 / 9],
      ['1/10', 0.1],
      ['1/16', 1 / 16],
      ['3/16', 3 / 16],
      ['5/16', 5 / 16],
      ['7/16', 7 / 16],
      ['9/16', 9 / 16],
      ['11/16', 11 / 16],
      ['13/16', 13 / 16],
      ['15/16', 15 / 16],
    ];

    for (const [label, n] of cases) {
      test(`${label} (${n})`, () => expectNumberRoundTrip(n));
    }

    test('whole + fraction: 2.5', () => expectNumberRoundTrip(2.5));
    test('whole + fraction: 10.25', () => expectNumberRoundTrip(10.25));
    test('whole + fraction: 3.75', () => expectNumberRoundTrip(3.75));
    test('whole + fraction: 1.125', () => expectNumberRoundTrip(1.125));
  });

  describe('A2: vulgar fractions', () => {
    const vf = { vulgarFractions: true } satisfies FormatQuantityOptions;
    const cases: [string, number][] = [
      ['½', 0.5],
      ['⅓', 1 / 3],
      ['⅔', 2 / 3],
      ['¼', 0.25],
      ['¾', 0.75],
      ['⅕', 0.2],
      ['⅖', 0.4],
      ['⅗', 0.6],
      ['⅘', 0.8],
      ['⅙', 1 / 6],
      ['⅚', 5 / 6],
      ['⅐', 1 / 7],
      ['⅛', 0.125],
      ['⅜', 0.375],
      ['⅝', 0.625],
      ['⅞', 0.875],
      ['⅑', 1 / 9],
      ['⅒', 0.1],
    ];

    for (const [label, n] of cases) {
      test(`${label} (${n})`, () => expectNumberRoundTrip(n, vf));
    }

    test('whole + vulgar: 2½', () => expectNumberRoundTrip(2.5, vf));
    test('whole + vulgar: 10¼', () => expectNumberRoundTrip(10.25, vf));
  });

  describe('A3: fraction slash', () => {
    const fs = { fractionSlash: true } satisfies FormatQuantityOptions;
    const cases: [string, number][] = [
      ['¹⁄₂', 0.5],
      ['¹⁄₃', 1 / 3],
      ['²⁄₃', 2 / 3],
      ['¹⁄₄', 0.25],
      ['³⁄₄', 0.75],
      ['¹⁄₅', 0.2],
      ['⅛ equiv', 0.125],
      ['⅜ equiv', 0.375],
      ['⅝ equiv', 0.625],
      ['⅞ equiv', 0.875],
    ];

    for (const [label, n] of cases) {
      test(`${label} (${n})`, () => expectNumberRoundTrip(n, fs));
    }

    test('whole + fraction slash: 1 ¹⁄₂', () => expectNumberRoundTrip(1.5, fs));
    test('whole + fraction slash: 2 ³⁄₈', () =>
      expectNumberRoundTrip(2.375, fs));
  });

  describe('A4: custom separator (non-breaking space)', () => {
    const nbsp = { separator: '\u00a0' } satisfies FormatQuantityOptions;

    test('1.5 with nbsp separator', () => {
      const str = formatQuantity(1.5, nbsp);
      expect(str).toBe('1\u00a01/2');
      const result = numericQuantity(str!, nqOpts);
      expect(result).toBeCloseTo(1.5, 5);
    });

    test('2.75 with nbsp separator', () => {
      const str = formatQuantity(2.75, nbsp);
      expect(str).toBe('2\u00a03/4');
      const result = numericQuantity(str!, nqOpts);
      expect(result).toBeCloseTo(2.75, 5);
    });
  });

  describe('A5: Roman numerals', () => {
    const rn = { romanNumerals: true } satisfies FormatQuantityOptions;
    const rnNq = { romanNumerals: true } as const;
    const cases: [number, string][] = [
      [1, 'I'],
      [2, 'II'],
      [3, 'III'],
      [4, 'IV'],
      [5, 'V'],
      [9, 'IX'],
      [10, 'X'],
      [14, 'XIV'],
      [20, 'XX'],
      [100, 'C'],
      [500, 'D'],
      [999, 'CMXCIX'],
      [1000, 'M'],
      [1214, 'MCCXIV'],
      [3999, 'MMMCMXCIX'],
    ];

    for (const [n, expected] of cases) {
      test(`${n} → ${expected} → ${n}`, () => {
        const str = formatQuantity(n, rn);
        expect(str).toBe(expected);
        const result = numericQuantity(str!, { ...nqOpts, ...rnNq });
        expect(result).toBe(n);
      });
    }
  });

  describe('A6: negative values', () => {
    const cases: [string, number, FormatQuantityOptions | undefined][] = [
      ['-1.5 default', -1.5, undefined],
      ['-0.5 default', -0.5, undefined],
      ['-2.75 default', -2.75, undefined],
      ['-1.5 vulgar', -1.5, { vulgarFractions: true }],
      ['-0.5 vulgar', -0.5, { vulgarFractions: true }],
      ['-1.5 fractionSlash', -1.5, { fractionSlash: true }],
      ['-0.5 fractionSlash', -0.5, { fractionSlash: true }],
    ];

    for (const [label, n, opts] of cases) {
      test(label, () => expectNumberRoundTrip(n, opts));
    }
  });

  describe('A7: integers', () => {
    for (const n of [1, 42, 100, 1000]) {
      test(`${n}`, () => expectNumberRoundTrip(n));
    }
  });

  describe('A8: edge cases', () => {
    test('NaN → null (no round trip)', () => {
      expect(formatQuantity(NaN)).toBeNull();
    });

    test('0 → "" → NaN (asymmetry)', () => {
      const str = formatQuantity(0);
      expect(str).toBe('');
      expect(numericQuantity(str!)).toBeNaN();
    });

    test('non-fraction decimal 1.45 survives', () => {
      const str = formatQuantity(1.45);
      expect(str).toBe('1.45');
      expect(numericQuantity(str!, nqOpts)).toBe(1.45);
    });

    test('non-fraction decimal 2.71 survives', () => {
      const str = formatQuantity(2.71);
      expect(str).toBe('2.71');
      expect(numericQuantity(str!, nqOpts)).toBe(2.71);
    });
  });
});

// ── Direction B: string → number → string ───────────────────────────

describe('Round trip B: string → number → string', () => {
  describe('B1: ASCII fraction strings', () => {
    const cases = [
      '1/2',
      '1 1/2',
      '2 3/4',
      '1 1/3',
      '10 1/3',
      '3/8',
      '1 7/8',
      '1/4',
      '3/4',
      '1/5',
      '2/5',
      '3/5',
      '4/5',
      '1 1/16',
      '1 7/16',
    ];

    for (const s of cases) {
      test(`"${s}"`, () => expectStringRoundTrip(s));
    }
  });

  describe('B2: vulgar fraction strings', () => {
    const vf = { vulgarFractions: true } satisfies FormatQuantityOptions;
    const cases = [
      '½',
      '1½',
      '⅓',
      '2⅕',
      '⅞',
      '¼',
      '¾',
      '⅔',
      '⅛',
      '⅜',
      '⅝',
      '1⅓',
      '10⅓',
    ];

    for (const s of cases) {
      test(`"${s}"`, () => expectStringRoundTrip(s, vf));
    }
  });

  describe('B3: fraction slash strings', () => {
    const fs = { fractionSlash: true } satisfies FormatQuantityOptions;
    const cases = [
      '¹⁄₂',
      '1 ¹⁄₂',
      '³⁄₈',
      '1 ¹¹⁄₁₆',
      '¹⁄₃',
      '²⁄₃',
      '¹⁄₄',
      '³⁄₄',
      '2 ³⁄₈',
    ];

    for (const s of cases) {
      test(`"${s}"`, () => expectStringRoundTrip(s, fs));
    }
  });

  describe('B4: whole number strings', () => {
    for (const s of ['1', '42', '1000']) {
      test(`"${s}"`, () => expectStringRoundTrip(s));
    }
  });

  describe('B5: decimal strings (no fraction snap)', () => {
    for (const s of ['1.45', '2.71', '0.99']) {
      test(`"${s}"`, () => expectStringRoundTrip(s));
    }
  });

  describe('B6: Roman numeral strings', () => {
    const rn = { romanNumerals: true } satisfies FormatQuantityOptions;
    const rnNq = { romanNumerals: true } as const;
    const cases = ['I', 'IV', 'XIV', 'MCCXIV', 'MMMCMXCIX'];

    for (const s of cases) {
      test(`"${s}"`, () => expectStringRoundTrip(s, rn, rnNq));
    }
  });

  describe('B7: negative strings', () => {
    const cases: [string, FormatQuantityOptions | undefined][] = [
      ['-1 1/2', undefined],
      ['-3/4', undefined],
      ['-1/2', undefined],
      ['-1½', { vulgarFractions: true }],
      ['-½', { vulgarFractions: true }],
      ['-1 ¹⁄₂', { fractionSlash: true }],
      ['-¹⁄₂', { fractionSlash: true }],
    ];

    for (const [s, opts] of cases) {
      test(`"${s}"`, () => expectStringRoundTrip(s, opts));
    }
  });

  describe('B8: normalisation (expected asymmetries)', () => {
    test('"01" normalises to "1"', () => {
      const num = numericQuantity('01', nqOpts);
      expect(formatQuantity(num)).toBe('1');
    });

    test('" 1 1/2 " normalises to "1 1/2"', () => {
      const num = numericQuantity(' 1 1/2 ', nqOpts);
      expect(formatQuantity(num)).toBe('1 1/2');
    });

    test('"1 1 / 2" normalises to "1 1/2"', () => {
      const num = numericQuantity('1 1 / 2', nqOpts);
      expect(formatQuantity(num)).toBe('1 1/2');
    });

    test('"1,000" normalises to "1000"', () => {
      const num = numericQuantity('1,000', nqOpts);
      expect(formatQuantity(num)).toBe('1000');
    });

    test('"1,000.5" normalises to "1000 1/2"', () => {
      const num = numericQuantity('1,000.5', nqOpts);
      expect(formatQuantity(num)).toBe('1000 1/2');
    });
  });
});
