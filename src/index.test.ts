import formatQuantity from '.';

it('works', () => {
  // NaN
  expect(formatQuantity('NaN')).toBe(null);
  // Zero should return blank string
  expect(formatQuantity(0)).toBe('');
  // Integers
  expect(formatQuantity(1)).toBe('1');
  expect(formatQuantity(1, true)).toBe('1');
  expect(formatQuantity(-1)).toBe('-1');
  expect(formatQuantity(100)).toBe('100');
  // Most decimal values should be returned as-is
  expect(formatQuantity(1.1)).toBe('1.1');
  expect(formatQuantity(-1.1)).toBe('-1.1');
  // Quarters
  expect(formatQuantity(1.25)).toBe('1 1/4');
  expect(formatQuantity(1.25, true)).toBe('1¼');
  expect(formatQuantity(-1.25)).toBe('-1 1/4');
  expect(formatQuantity(1.75)).toBe('1 3/4');
  expect(formatQuantity(1.75, true)).toBe('1¾');
  expect(formatQuantity(-1.75)).toBe('-1 3/4');
  // Fifths
  expect(formatQuantity(0.2)).toBe('1/5');
  expect(formatQuantity(0.2, true)).toBe('⅕');
  expect(formatQuantity(1.2)).toBe('1 1/5');
  expect(formatQuantity(1.2, true)).toBe('1⅕');
  expect(formatQuantity(0.4)).toBe('2/5');
  expect(formatQuantity(1.4)).toBe('1 2/5');
  expect(formatQuantity(1.4, true)).toBe('1⅖');
  expect(formatQuantity(0.6)).toBe('3/5');
  expect(formatQuantity(1.6)).toBe('1 3/5');
  expect(formatQuantity(1.6, true)).toBe('1⅗');
  expect(formatQuantity(0.8)).toBe('4/5');
  expect(formatQuantity(1.8)).toBe('1 4/5');
  expect(formatQuantity(1.8, true)).toBe('1⅘');
  // Thirds
  expect(formatQuantity(1.32)).toBe('1.32');
  expect(formatQuantity(1.33)).toBe('1 1/3');
  expect(formatQuantity(1.33, true)).toBe('1⅓');
  expect(formatQuantity(1.3333333333333333)).toBe('1 1/3');
  expect(formatQuantity(1.34)).toBe('1.34');
  expect(formatQuantity(1.66)).toBe('1 2/3');
  expect(formatQuantity(1.66, true)).toBe('1⅔');
  expect(formatQuantity(1.667)).toBe('1 2/3');
  expect(formatQuantity(1.6666666666666666)).toBe('1 2/3');
  expect(formatQuantity(1.67)).toBe('1.67');
  // Halves
  expect(formatQuantity(1.51)).toBe('1.51');
  expect(formatQuantity(1.5)).toBe('1 1/2');
  expect(formatQuantity(1.5, true)).toBe('1½');
  expect(formatQuantity(1.52)).toBe('1.52');
  // Eighths
  expect(formatQuantity(1.125)).toBe('1 1/8');
  expect(formatQuantity(1.125, true)).toBe('1⅛');
  expect(formatQuantity(1.375)).toBe('1 3/8');
  expect(formatQuantity(1.375, true)).toBe('1⅜');
  expect(formatQuantity(1.625)).toBe('1 5/8');
  expect(formatQuantity(1.625, true)).toBe('1⅝');
  expect(formatQuantity(1.875)).toBe('1 7/8');
  expect(formatQuantity(1.875, true)).toBe('1⅞');
});
