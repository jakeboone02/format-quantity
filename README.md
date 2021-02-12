# format-quantity

[![npm version](https://badge.fury.io/js/format-quantity.svg)](//npmjs.com/package/format-quantity)
![workflow status](https://github.com/jakeboone02/format-quantity/workflows/Continuous%20Integration/badge.svg)
[![codecov.io](https://codecov.io/github/jakeboone02/format-quantity/coverage.svg?branch=master)](https://codecov.io/github/jakeboone02/format-quantity?branch=master)
[![downloads](https://img.shields.io/npm/dm/format-quantity.svg)](http://npm-stat.com/charts.html?package=format-quantity&from=2015-08-01)
[![MIT License](https://img.shields.io/npm/l/format-quantity.svg)](http://opensource.org/licenses/MIT)

Formats a number (or string that appears to be a number) as one would see it written in imperial measurements, e.g. "1 1/2" instead of "1.5". To use unicode vulgar fractions like "⅞", pass `true` as the second argument.

For the inverse operation, converting a string (which may include mixed numbers or vulgar fractions) to a number, check out [numeric-quantity](https://www.npmjs.com/package/numeric-quantity) or, if you're interested in parsing recipe ingredient strings, try [parse-ingredient](https://www.npmjs.com/package/parse-ingredient).

## Installation

### npm

```shell
# npm
npm i format-quantity

# yarn
yarn add format-quantity
```

### Browser

In the browser, available as a global function `formatQuantity`.

```html
<script src="https://unpkg.com/format-quantity"></script>
<script>
  console.log(formatQuantity(10.5)); // "10 1/2"
</script>
```

## Usage

```js
import formatQuantity from 'format-quantity';

console.log(formatQuantity(1.5)); // "1 1/2"
console.log(formatQuantity(2.66)); // "2 2/3"
console.log(formatQuantity(3.875, true)); // "3⅞"
```

The return value will be `null` if the provided argument is not a number or a string that evaluates to a number using `parseFloat`. The return value will be an empty string (`""`) if the provided argument is `0` or `"0"` (this is done to fit the primary use case of recipe ingredients).
