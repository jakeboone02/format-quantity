import { formatQuantity, formatRomanNumerals } from './formatQuantity';
import { formatQuantityTests } from './formatQuantityTests';

for (const [description, expects] of Object.entries(formatQuantityTests)) {
  it(description, () => {
    for (const [quantity, result, options] of expects) {
      expect(formatQuantity(quantity, options)).toBe(result);
    }
  });
}

it('returns null for NaN and strings (Roman)', () => {
  expect(formatRomanNumerals(NaN)).toBe(null);
  expect(formatRomanNumerals('NaN' as any)).toBe(null);
});
