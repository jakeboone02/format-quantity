import { describe, expect, test } from 'bun:test';
import { numericQuantity } from 'numeric-quantity';
import { defaultTolerance } from './constants';
import { formatQuantity } from './formatQuantity';
import type { FormatQuantityOptions } from './types';

/**
 * Deterministic property-style sweeps. A seeded generator is used instead of a
 * property-testing dependency so failures are reproducible without a shrinker.
 */

/** Seeded 32-bit LCG (numerical recipes constants). Deterministic across runs. */
const makeRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x1_0000_0000;
  };
};

const nqOpts = { round: false, verbose: false, bigIntOnOverflow: false } as const;

/** `formatQuantity` emits `String(n)`, which switches to exponent notation at the extremes. */
const isExponential = (n: number) => `${n}`.includes('e');

describe('property: null is returned exactly for non-numeric input', () => {
  test('numeric input yields null if and only if it is NaN', () => {
    const random = makeRandom(0x5eed_1234);
    const offenders: string[] = [];

    const specials = [0, -0, 1, -1, Infinity, -Infinity, NaN, Number.MAX_VALUE, Number.MIN_VALUE];
    const sampled = Array.from({ length: 2000 }, () => (random() - 0.5) * 2e4);

    for (const n of [...specials, ...sampled]) {
      const isNull = formatQuantity(n) === null;
      if (isNull !== Number.isNaN(n)) {
        offenders.push(`${n} → ${formatQuantity(n)}`);
      }
    }

    expect(offenders).toEqual([]);
  });

  test('every non-string, non-number input yields null', () => {
    const offenders: string[] = [];
    const inputs = [
      null,
      undefined,
      true,
      false,
      {},
      [],
      [1],
      () => 1,
      Symbol.iterator,
      new Date(0),
    ];

    for (const input of inputs) {
      if (formatQuantity(input as never) !== null) {
        offenders.push(Object.prototype.toString.call(input));
      }
    }

    expect(offenders).toEqual([]);
  });
});

describe('property: format → parse stays within tolerance', () => {
  /** Formats `n`, parses it back, and reports a description of any deviation. */
  const checkRoundTrip = (n: number, options: FormatQuantityOptions, tolerance: number) => {
    const formatted = formatQuantity(n, options);
    if (formatted === null) {
      return `${n} → null`;
    }
    const parsed = numericQuantity(formatted, {
      ...nqOpts,
      romanNumerals: options.romanNumerals ?? false,
    });
    if (Number.isNaN(parsed)) {
      return `${n} → ${JSON.stringify(formatted)} → NaN`;
    }
    // A matched fraction is allowed to move the value by up to the tolerance;
    // anything else must come back exactly.
    return Math.abs(parsed - n) > tolerance
      ? `${n} → ${JSON.stringify(formatted)} → ${parsed}`
      : null;
  };

  const optionSets: [string, FormatQuantityOptions][] = [
    ['default', {}],
    ['vulgarFractions', { vulgarFractions: true }],
    ['fractionSlash', { fractionSlash: true }],
    ['separator: " "', { separator: ' ' }],
    ['separator: no-break space', { separator: '\u00a0' }],
    ['tolerance: 0', { tolerance: 0 }],
    ['tolerance: false', { tolerance: false }],
    ['tolerance: 0.02', { tolerance: 0.02 }],
  ];

  for (const [name, options] of optionSets) {
    test(`random values in [-10000, 10000] with ${name}`, () => {
      const random = makeRandom(0xc0ff_ee01);
      const tolerance =
        typeof options.tolerance === 'number' ? options.tolerance : defaultTolerance;
      const offenders: string[] = [];

      for (let i = 0; i < 2000; i++) {
        const n = (random() - 0.5) * 2e4;
        if (n === 0 || isExponential(n)) {
          continue;
        }
        const offense = checkRoundTrip(n, options, tolerance);
        if (offense) {
          offenders.push(offense);
        }
      }

      expect(offenders).toEqual([]);
    });
  }

  test('every exact anchor at every whole number in [-20, 20]', () => {
    const offenders: string[] = [];

    for (let whole = -20; whole <= 20; whole++) {
      for (const [num, den] of [
        [1, 16],
        [1, 10],
        [1, 8],
        [1, 6],
        [1, 5],
        [1, 4],
        [1, 3],
        [1, 2],
        [2, 3],
        [3, 4],
        [7, 8],
        [15, 16],
      ]) {
        const n = whole + (whole < 0 ? -1 : 1) * (num / den);
        if (n === 0) {
          continue;
        }
        const offense = checkRoundTrip(n, {}, defaultTolerance);
        if (offense) {
          offenders.push(offense);
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  test('integers in [-500, 500] round-trip exactly', () => {
    const offenders: string[] = [];

    for (let n = -500; n <= 500; n++) {
      if (n === 0) {
        continue;
      }
      const formatted = formatQuantity(n);
      if (formatted !== `${n}` || numericQuantity(formatted, nqOpts) !== n) {
        offenders.push(`${n} → ${formatted}`);
      }
    }

    expect(offenders).toEqual([]);
  });
});

describe('property: extreme magnitudes use exponential notation but still round-trip', () => {
  const exponential = [1e21, -1e21, 1e-7, -1e-7, Number.MAX_VALUE, Number.MIN_VALUE];

  test('they are formatted as JavaScript exponential notation, not null', () => {
    for (const n of exponential) {
      expect(isExponential(n)).toBe(true);
      expect(formatQuantity(n)).toBe(`${n}`);
    }
  });

  test('numericQuantity parses the exponential form back exactly', () => {
    for (const n of exponential) {
      expect(`${n}: ${numericQuantity(formatQuantity(n)!, nqOpts)}`).toBe(`${n}: ${n}`);
    }
  });

  test('the magnitudes just inside the notation switch also round-trip', () => {
    for (const n of [1e20, -1e20, 1e-6, -1e-6]) {
      expect(isExponential(n)).toBe(false);
      expect(numericQuantity(formatQuantity(n)!, nqOpts)).toBe(n);
    }
  });

  test('a fractional extreme is never matched to a fraction', () => {
    // Below 1e-7 the whole value is smaller than any tolerance, but it is also
    // farther from every anchor than the tolerance allows.
    for (const n of [1e-7, 1e-10, Number.MIN_VALUE]) {
      expect(formatQuantity(n)).toBe(`${n}`);
    }
  });
});

describe('property: a non-round-trippable separator is the one documented exception', () => {
  // `numeric-quantity` requires whitespace (or nothing, before a vulgar
  // fraction) between the whole and fraction parts, so a custom separator such
  // as "-" is a formatting-only choice.
  test('separator: "-" produces output numericQuantity cannot parse', () => {
    for (const n of [1.5, -1.5, 9047.75]) {
      const formatted = formatQuantity(n, { separator: '-' })!;
      expect(formatted).toContain('-');
      expect(numericQuantity(formatted, nqOpts)).toBeNaN();
    }
  });

  test('whitespace separators keep the round trip intact', () => {
    for (const separator of [' ', '\u00a0']) {
      for (const n of [1.5, -1.5, 9047.75]) {
        expect(numericQuantity(formatQuantity(n, { separator })!, nqOpts)).toBe(n);
      }
    }
  });

  test('an empty separator only round-trips when the fraction is actually vulgar', () => {
    const options = { separator: '', vulgarFractions: true } as const;

    // 3/4 has a vulgar code point, so "9047¾" is unambiguous.
    expect(formatQuantity(9047.75, options)).toBe('9047¾');
    expect(numericQuantity(formatQuantity(9047.75, options)!, nqOpts)).toBe(9047.75);

    // Sixteenths do not, so the ASCII fraction runs into the whole number.
    expect(formatQuantity(9047.9375, options)).toBe('904715/16');
    expect(numericQuantity(formatQuantity(9047.9375, options)!, nqOpts)).not.toBe(9047.9375);
  });
});

describe('property: options never change which values match, only how they render', () => {
  test('vulgarFractions / fractionSlash / separator agree on match-vs-decimal', () => {
    const random = makeRandom(0xdec1_5a1e);
    const offenders: string[] = [];

    for (let i = 0; i < 2000; i++) {
      const n = (random() - 0.5) * 20;
      if (n === 0) {
        continue;
      }
      const matched = formatQuantity(n) !== `${n}`;
      for (const options of [
        { vulgarFractions: true },
        { fractionSlash: true },
        { separator: '-' },
        { vulgarFractions: true, separator: '' },
      ] satisfies FormatQuantityOptions[]) {
        if ((formatQuantity(n, options) !== `${n}`) !== matched) {
          offenders.push(`${n} with ${JSON.stringify(options)}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  test('tolerance: false always returns String(n)', () => {
    const random = makeRandom(0xfa15_e000);
    const offenders: string[] = [];

    for (let i = 0; i < 2000; i++) {
      const n = (random() - 0.5) * 20;
      if (n === 0) {
        continue;
      }
      if (formatQuantity(n, { tolerance: false }) !== `${n}`) {
        offenders.push(`${n}`);
      }
    }

    expect(offenders).toEqual([]);
  });

  test('a larger tolerance never turns a match back into a decimal', () => {
    const random = makeRandom(0x7011_e2a1);
    const offenders: string[] = [];

    for (let i = 0; i < 1000; i++) {
      const n = (random() - 0.5) * 20;
      if (n === 0) {
        continue;
      }
      let matchedAtSmaller = false;
      for (const tolerance of [0, 0.001, 0.0075, 0.02, 0.05]) {
        const matched = formatQuantity(n, { tolerance }) !== `${n}`;
        if (matchedAtSmaller && !matched) {
          offenders.push(`${n} stopped matching at tolerance ${tolerance}`);
        }
        matchedAtSmaller ||= matched;
      }
    }

    expect(offenders).toEqual([]);
  });
});
