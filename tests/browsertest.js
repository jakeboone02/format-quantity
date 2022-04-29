/**
 * Crude test suite
 */

const { formatQuantity } = FormatQuantity;

const logEl = document.querySelector('#log');
const log = message => (logEl.innerHTML += message + '<br>');

let testCount = 0;
let passCount = 0;

class Tester {
  constructor(attempt) {
    this.attempt = attempt;
  }

  is(test) {
    const passes = this.attempt === test;
    if (passes) {
      passCount++;
    }
    log(
      passes
        ? `pass: ${
            typeof this.attempt === 'string'
              ? `'${this.attempt}'`
              : this.attempt
          }`
        : `FAIL: '${this.attempt}' is not '${test}'`
    );
  }
}

const assert = attempt => {
  testCount++;
  return new Tester(attempt);
};

[
  // NaN
  ['NaN', null],
  // Zero should return blank string
  [0, ''],
  // Integers
  [1, '1'],
  [-1, '-1'],
  [100, '100'],
  // Most decimal values should be returned as-is
  [1.123, '1.123'],
  [-1.123, '-1.123'],
  // Quarters
  [1.25, '1 1/4'],
  [-1.25, '-1 1/4'],
  [1.75, '1 3/4'],
  [-1.75, '-1 3/4'],
  // Fifths
  [0.2, '1/5'],
  [1.2, '1 1/5'],
  [0.4, '2/5'],
  [1.4, '1 2/5'],
  [0.6, '3/5'],
  [1.6, '1 3/5'],
  [0.8, '4/5'],
  [1.8, '1 4/5'],
  // Thirds
  [1.32, '1.32'],
  [1.33, '1 1/3'],
  [1.3333333333333333, '1 1/3'],
  [1.34, '1.34'],
  [1.66, '1 2/3'],
  [1.667, '1 2/3'],
  [1.6666666666666666, '1 2/3'],
  [1.67, '1.67'],
  // Halves
  [1.51, '1.51'],
  [1.5, '1 1/2'],
  [1.5, '1½', true],
  [1.52, '1.52'],
].forEach(([test, result, options]) =>
  assert(formatQuantity(test, options)).is(result)
);

// Report results
log('');
log(`Total : ${testCount} tests`);
log(`Passed: ${passCount} (${(passCount * 100) / testCount}%)`);
log(
  `Failed: ${testCount - passCount} (${
    ((testCount - passCount) * 100) / testCount
  }%)`
);

if (typeof process !== 'undefined') {
  process.exit(testCount - passCount ? 1 : 0);
}
