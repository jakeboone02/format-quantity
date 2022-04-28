import { formatQuantity } from './formatQuantity';

it('returns null for NaN and non-numeric strings', () => {
  expect(formatQuantity(NaN)).toBe(null);
  expect(formatQuantity('NaN')).toBe(null);
});
it('returns blank string for zero', () => {
  expect(formatQuantity(0)).toBe('');
  expect(formatQuantity(1 - 1)).toBe('');
});
it('handles integers', () => {
  expect(formatQuantity(1)).toBe('1');
  expect(formatQuantity(1 + 1)).toBe('2');
  expect(formatQuantity(1, true)).toBe('1');
  expect(formatQuantity(-1)).toBe('-1');
  expect(formatQuantity(100)).toBe('100');
});
it('returns most decimal values as-is', () => {
  expect(formatQuantity(1.123)).toBe('1.123');
  expect(formatQuantity(-1.123)).toBe('-1.123');
});
it('handles halves', () => {
  expect(formatQuantity(1.51)).toBe('1.51');
  expect(formatQuantity(1.5)).toBe('1 1/2');
  expect(formatQuantity(1 + 1 / 2)).toBe('1 1/2');
  expect(formatQuantity(1.5, true)).toBe('1½');
  expect(formatQuantity(1.52)).toBe('1.52');
});
it('handles thirds', () => {
  expect(formatQuantity(1.32)).toBe('1.32');
  expect(formatQuantity(1.33)).toBe('1 1/3');
  expect(formatQuantity(1 + 1 / 3)).toBe('1 1/3');
  expect(formatQuantity(1.33, true)).toBe('1⅓');
  expect(formatQuantity(1.3333333333333333)).toBe('1 1/3');
  expect(formatQuantity(1.34)).toBe('1.34');
  expect(formatQuantity(1.66)).toBe('1 2/3');
  expect(formatQuantity(1 + 2 / 3)).toBe('1 2/3');
  expect(formatQuantity(1.66, true)).toBe('1⅔');
  expect(formatQuantity(1.667)).toBe('1 2/3');
  expect(formatQuantity(1.6666666666666666)).toBe('1 2/3');
  expect(formatQuantity(1.67)).toBe('1.67');
});
it('handles quarters', () => {
  expect(formatQuantity(1.25)).toBe('1 1/4');
  expect(formatQuantity(1 + 1 / 4)).toBe('1 1/4');
  expect(formatQuantity(1.25, true)).toBe('1¼');
  expect(formatQuantity(-1.25)).toBe('-1 1/4');
  expect(formatQuantity(1.75)).toBe('1 3/4');
  expect(formatQuantity(1 + 3 / 4)).toBe('1 3/4');
  expect(formatQuantity(1.75, true)).toBe('1¾');
  expect(formatQuantity(-1.75)).toBe('-1 3/4');
});
it('handles fifths', () => {
  expect(formatQuantity(0.2)).toBe('1/5');
  expect(formatQuantity(0.2, true)).toBe('⅕');
  expect(formatQuantity(1.2)).toBe('1 1/5');
  expect(formatQuantity(1 + 1 / 5)).toBe('1 1/5');
  expect(formatQuantity(1.2, true)).toBe('1⅕');
  expect(formatQuantity(0.4)).toBe('2/5');
  expect(formatQuantity(1.4)).toBe('1 2/5');
  expect(formatQuantity(1 + 2 / 5)).toBe('1 2/5');
  expect(formatQuantity(1.4, true)).toBe('1⅖');
  expect(formatQuantity(0.6)).toBe('3/5');
  expect(formatQuantity(1.6)).toBe('1 3/5');
  expect(formatQuantity(1 + 3 / 5)).toBe('1 3/5');
  expect(formatQuantity(1.6, true)).toBe('1⅗');
  expect(formatQuantity(0.8)).toBe('4/5');
  expect(formatQuantity(1.8)).toBe('1 4/5');
  expect(formatQuantity(1 + 4 / 5)).toBe('1 4/5');
  expect(formatQuantity(1.8, true)).toBe('1⅘');
});
it('handles sixths', () => {
  expect(formatQuantity(1 + 1 / 6)).toBe('1 1/6');
  expect(formatQuantity(1.166, true)).toBe('1⅙');
  expect(formatQuantity(1 + 5 / 6)).toBe('1 5/6');
  expect(formatQuantity(1.833, true)).toBe('1⅚');
});
it('handles sevenths', () => {
  expect(formatQuantity(1 + 1 / 7)).toBe('1 1/7');
  expect(formatQuantity(1.1428, true)).toBe('1⅐');
});
it('handles eighths', () => {
  expect(formatQuantity(1.125)).toBe('1 1/8');
  expect(formatQuantity(1 + 1 / 8)).toBe('1 1/8');
  expect(formatQuantity(1.125, true)).toBe('1⅛');
  expect(formatQuantity(1.375)).toBe('1 3/8');
  expect(formatQuantity(1 + 3 / 8)).toBe('1 3/8');
  expect(formatQuantity(1.375, true)).toBe('1⅜');
  expect(formatQuantity(1.625)).toBe('1 5/8');
  expect(formatQuantity(1 + 5 / 8)).toBe('1 5/8');
  expect(formatQuantity(1.625, true)).toBe('1⅝');
  expect(formatQuantity(1.875)).toBe('1 7/8');
  expect(formatQuantity(1 + 7 / 8)).toBe('1 7/8');
  expect(formatQuantity(1.875, true)).toBe('1⅞');
});
it('handles ninths', () => {
  expect(formatQuantity(1 + 1 / 9)).toBe('1 1/9');
  expect(formatQuantity(1.11111, true)).toBe('1⅑');
});
it('handles tenths', () => {
  expect(formatQuantity(1 + 1 / 10)).toBe('1 1/10');
  expect(formatQuantity(1.1, true)).toBe('1⅒');
});
it('handles empty options object', () => {
  expect(formatQuantity(1.5, {})).toBe('1 1/2');
});
it('handles vulgarFractions option', () => {
  expect(formatQuantity(1.5, { vulgarFractions: false })).toBe('1 1/2');
  expect(formatQuantity(1.5, { vulgarFractions: true })).toBe('1½');
});
it('handles fractionSlash option', () => {
  expect(formatQuantity(1.5, { fractionSlash: false })).toBe('1 1/2');
  expect(formatQuantity(1.5, { fractionSlash: true })).toBe('1 1⁄2');
  // vulgarFractions option should override fractionSlash option
  expect(
    formatQuantity(1.5, { fractionSlash: true, vulgarFractions: true })
  ).toBe('1½');
});
it('handles tolerance option', () => {
  // Revert to default tolerance if null
  expect(formatQuantity(1.3, { tolerance: null as any })).toBe('1.3');
  // Normally returns "1.3" but tolerance is increased
  expect(formatQuantity(1.3, { tolerance: 0.1 })).toBe('1 1/3');
  // Normally returns "1 1/7" but tolerance is decreased
  expect(formatQuantity(1.1428, { tolerance: 0.000001 })).toBe('1.1428');
});
