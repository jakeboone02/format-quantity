import { formatQuantity, formatRomanNumerals } from './formatQuantity';
import { formatQuantityTests } from './formatQuantityTests';

for (const [description, expects] of Object.entries(formatQuantityTests)) {
  describe(description, () => {
    for (const [quantity, result, options] of expects) {
      it(`${quantity}${
        typeof options === 'undefined'
          ? ''
          : ` with option ${JSON.stringify(options)}`
      } should evaluate to ${result}`, () => {
        expect(formatQuantity(quantity, options)).toBe(result);
      });
    }
  });
}

it('returns null for NaN and strings (Roman)', () => {
  expect(formatRomanNumerals(NaN)).toBe(null);
  expect(formatRomanNumerals('NaN' as any)).toBe(null);
});
