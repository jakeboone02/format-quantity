import { describe, expect, test } from 'bun:test';
import {
  defaultOptions,
  defaultTolerance,
  fractionDecimalMatches,
  vulgarToAsciiMap,
} from './constants';
import { formatQuantity } from './formatQuantity';
import { formatQuantityTests } from './formatQuantityTests';

/**
 * Structural guarantees that the table-driven suite cannot express: exported
 * constants are immutable, and the fixture's keys (which become `describe`
 * names) are unique.
 */

const frozenExports = {
  defaultOptions,
  vulgarToAsciiMap,
  fractionDecimalMatches,
} as const;

describe('exported constants are frozen', () => {
  test.each(Object.entries(frozenExports))('%s is frozen', (_name, value) => {
    expect(Object.isFrozen(value)).toBe(true);
  });

  test('every entry of fractionDecimalMatches is frozen', () => {
    for (const entry of fractionDecimalMatches) {
      expect(Object.isFrozen(entry)).toBe(true);
    }
  });
});

describe('mutating an exported constant is rejected and cannot reconfigure the library', () => {
  test('defaultOptions rejects writes and formatQuantity is unaffected', () => {
    expect(() => {
      (defaultOptions as { tolerance: number }).tolerance = 0.5;
    }).toThrow(TypeError);
    expect(defaultOptions.tolerance).toBe(defaultTolerance);
    // 0.3 is inside a 0.5 tolerance of 1/3 but outside the default.
    expect(formatQuantity(0.3)).toBe('0.3');
  });

  test('defaultOptions rejects new properties', () => {
    expect(() => {
      (defaultOptions as Record<string, unknown>).separator = '-';
    }).toThrow(TypeError);
    expect(formatQuantity(1.5)).toBe('1 1/2');
  });

  test('vulgarToAsciiMap rejects writes and formatQuantity is unaffected', () => {
    expect(() => {
      (vulgarToAsciiMap as Record<string, string>)['½'] = 'HALF';
    }).toThrow(TypeError);
    expect(vulgarToAsciiMap['½']).toBe('1/2');
    expect(formatQuantity(1.5)).toBe('1 1/2');
  });

  test('vulgarToAsciiMap rejects deletes', () => {
    expect(() => {
      delete (vulgarToAsciiMap as Record<string, string>)['½'];
    }).toThrow(TypeError);
    expect(formatQuantity(0.5, true)).toBe('½');
  });

  test('fractionDecimalMatches rejects writes and formatQuantity is unaffected', () => {
    expect(() => {
      (fractionDecimalMatches as unknown as [number, string][])[0] = [0.5, 'BOGUS'];
    }).toThrow(TypeError);
    expect(formatQuantity(0.0625)).toBe('1/16');
    expect(formatQuantity(0.5)).toBe('1/2');
  });

  test('fractionDecimalMatches rejects push', () => {
    expect(() => {
      (fractionDecimalMatches as unknown as [number, string][]).push([0.99, 'BOGUS']);
    }).toThrow(TypeError);
    expect(fractionDecimalMatches).toHaveLength(26);
  });

  test('an individual fractionDecimalMatches entry rejects writes', () => {
    expect(() => {
      (fractionDecimalMatches[0] as unknown as [number, string])[0] = 0.999;
    }).toThrow(TypeError);
    expect(fractionDecimalMatches[0][0]).toBe(1 / 16);
  });
});

describe('formatQuantityTests fixture', () => {
  test('has no duplicate keys', async () => {
    // Duplicate keys in the object literal would silently collapse — and take a
    // whole `describe` group's worth of assertions with them — so the source
    // text is checked rather than the parsed object.
    const source = await Bun.file(new URL('./formatQuantityTests.ts', import.meta.url)).text();
    const keys = [...source.matchAll(/^ {2}(?:'([^']+)'|([A-Za-z_$][\w$]*)): \[$/gm)].map(
      m => m[1] ?? m[2]
    );

    expect(keys.length).toBeGreaterThan(0);
    expect(keys).toHaveLength(Object.keys(formatQuantityTests).length);
    expect(new Set(keys).size).toBe(keys.length);
  });

  test('has no empty groups', () => {
    for (const [name, cases] of Object.entries(formatQuantityTests)) {
      expect(`${name}: ${cases.length}`).not.toBe(`${name}: 0`);
    }
  });
});
