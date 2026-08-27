import { describe, expect, test } from 'bun:test';
import { defaultTolerance, fractionDecimalMatches, vulgarToAsciiMap } from './constants';
import { formatQuantity } from './formatQuantity';
import type { SimpleFraction, Sixteenth, VulgarFraction } from './types';

/**
 * Generated sweep of the tolerance window around every anchor in
 * {@link fractionDecimalMatches}. Guards the "closest match wins" contract and
 * the exactness of the anchors themselves — a rounded anchor (`0.33` instead of
 * `1 / 3`) shifts its window off-center and fails the assertions below.
 */

/** "Nudge" used to land just inside/outside a boundary without float slop. */
const epsilon = 1e-9;

/** ASCII rendering of an anchor, which is what `formatQuantity` returns by default. */
const ascii = (f: VulgarFraction | Sixteenth): SimpleFraction | Sixteenth =>
  vulgarToAsciiMap[f as VulgarFraction] ?? f;

const anchors = fractionDecimalMatches.map(([value, fraction], i) => {
  const prev = fractionDecimalMatches[i - 1];
  const next = fractionDecimalMatches[i + 1];
  return {
    value,
    fraction,
    expected: ascii(fraction),
    /** Distance past which the previous anchor becomes the nearer one. */
    halfGapBelow: prev ? (value - prev[0]) / 2 : Infinity,
    /** Distance past which the next anchor becomes the nearer one. */
    halfGapAbove: next ? (next[0] - value) / 2 : Infinity,
  };
});

/** Smallest distance from `n` to any anchor. */
const distanceToNearestAnchor = (n: number) =>
  Math.min(...fractionDecimalMatches.map(([value]) => Math.abs(n - value)));

describe('tolerance boundary sweep', () => {
  for (const { value, fraction, expected, halfGapBelow, halfGapAbove } of anchors) {
    describe(`${expected} (${value})`, () => {
      test('the exact quotient matches', () => {
        expect(formatQuantity(value)).toBe(expected);
        expect(formatQuantity(value, true)).toBe(fraction);
      });

      // Just inside the window — but no farther than the midpoint to the
      // neighboring anchor, which would legitimately hand the match over.
      for (const direction of [-1, 1] as const) {
        const halfGap = direction < 0 ? halfGapBelow : halfGapAbove;
        const offset = Math.min(defaultTolerance, halfGap) - epsilon;
        const n = value + direction * offset;

        test(`just inside the window (${direction < 0 ? '-' : '+'}${offset}) still matches`, () => {
          expect(formatQuantity(n)).toBe(expected);
        });

        // Just outside the window. It only falls through to a decimal when it
        // is also outside every *other* anchor's window; otherwise all we can
        // say is that this anchor no longer claims it.
        const outside = value + direction * (defaultTolerance + epsilon);

        test(`just outside the window (${direction < 0 ? '-' : '+'}${defaultTolerance + epsilon}) does not match`, () => {
          const result = formatQuantity(outside);
          expect(result).not.toBe(expected);
          if (distanceToNearestAnchor(outside) >= defaultTolerance) {
            expect(result).toBe(`${outside}`);
          }
        });
      }
    });
  }
});

describe('nearest match wins between adjacent anchors', () => {
  for (let i = 1; i < fractionDecimalMatches.length; i++) {
    const [lowValue, lowFraction] = fractionDecimalMatches[i - 1];
    const [highValue, highFraction] = fractionDecimalMatches[i];
    const midpoint = (lowValue + highValue) / 2;
    const halfGap = (highValue - lowValue) / 2;

    // Only meaningful where both anchors can actually reach the midpoint.
    if (halfGap >= defaultTolerance) {
      continue;
    }

    test(`${ascii(lowFraction)} vs ${ascii(highFraction)}: the nearer anchor claims each side of ${midpoint}`, () => {
      expect(formatQuantity(midpoint - epsilon)).toBe(ascii(lowFraction));
      expect(formatQuantity(midpoint + epsilon)).toBe(ascii(highFraction));
    });

    test(`${ascii(lowFraction)} vs ${ascii(highFraction)}: the midpoint resolves to exactly one of them`, () => {
      const result = formatQuantity(midpoint);
      expect([ascii(lowFraction), ascii(highFraction)] as (string | null)[]).toContain(result);
      // Deterministic: repeated calls never flip between the two.
      expect(formatQuantity(midpoint)).toBe(result);
    });
  }
});

describe('tolerance sweep at a custom tolerance', () => {
  // A tolerance tighter than every half-gap makes each window independent, so
  // "inside matches / outside falls through to a decimal" holds unconditionally.
  const tolerance = 0.001;

  for (const { value, expected } of anchors) {
    test(`${expected} window at tolerance ${tolerance}`, () => {
      expect(formatQuantity(value - tolerance + epsilon, { tolerance })).toBe(expected);
      expect(formatQuantity(value + tolerance - epsilon, { tolerance })).toBe(expected);

      const below = value - tolerance - epsilon;
      const above = value + tolerance + epsilon;
      expect(formatQuantity(below, { tolerance })).toBe(`${below}`);
      expect(formatQuantity(above, { tolerance })).toBe(`${above}`);
    });
  }
});

describe('the tolerance window is symmetric around the exact quotient', () => {
  // Rounded anchors skew the window: one side accepts values
  // farther from the true quotient than the other rejects.
  for (const { value, expected } of anchors) {
    test(`${expected} accepts and rejects the same distance on both sides`, () => {
      const tolerance = 0.001;
      for (const offset of [tolerance / 2, tolerance - epsilon]) {
        expect(formatQuantity(value - offset, { tolerance })).toBe(expected);
        expect(formatQuantity(value + offset, { tolerance })).toBe(expected);
      }
      for (const offset of [tolerance + epsilon, tolerance * 2]) {
        expect(formatQuantity(value - offset, { tolerance })).not.toBe(expected);
        expect(formatQuantity(value + offset, { tolerance })).not.toBe(expected);
      }
    });
  }
});
