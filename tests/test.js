/**
 * Crude test suite
 */

const fq =
  this.formatQuantity !== undefined ? this.formatQuantity : require('..');

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
    console.log(
      passes ? 'pass' : "FAIL: '" + this.attempt + "' is not '" + test + "'"
    );
  }
}

function assert(attempt) {
  testCount++;
  return new Tester(attempt);
}

// NaN
assert(fq('NaN')).is(null);
// Zero should return blank string
assert(fq(0)).is('');
// Integers
assert(fq(1)).is('1');
assert(fq(-1)).is('-1');
assert(fq(100)).is('100');
// Most decimal values should be returned as-is
assert(fq(1.1)).is('1.1');
assert(fq(-1.1)).is('-1.1');
// Quarters
assert(fq(1.25)).is('1 1/4');
assert(fq(-1.25)).is('-1 1/4');
assert(fq(1.75)).is('1 3/4');
assert(fq(-1.75)).is('-1 3/4');
// Fifths
assert(fq(0.2)).is('1/5');
assert(fq(1.2)).is('1 1/5');
assert(fq(0.4)).is('2/5');
assert(fq(1.4)).is('1 2/5');
assert(fq(0.6)).is('3/5');
assert(fq(1.6)).is('1 3/5');
assert(fq(0.8)).is('4/5');
assert(fq(1.8)).is('1 4/5');
// Thirds
assert(fq(1.32)).is('1.32');
assert(fq(1.33)).is('1 1/3');
assert(fq(1.3333333333333333)).is('1 1/3');
assert(fq(1.34)).is('1.34');
assert(fq(1.66)).is('1 2/3');
assert(fq(1.667)).is('1 2/3');
assert(fq(1.6666666666666666)).is('1 2/3');
assert(fq(1.67)).is('1.67');
// Halves
assert(fq(1.51)).is('1.51');
assert(fq(1.5)).is('1 1/2');
assert(fq(1.52)).is('1.52');

// Report results
console.log(passCount + ' of ' + testCount + ' tests passed.');

if (typeof process !== 'undefined') {
  process.exit(testCount - passCount ? 1 : 0);
}
