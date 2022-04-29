# format-quantity

[![npm version](https://badge.fury.io/js/format-quantity.svg)](//npmjs.com/package/format-quantity)
![workflow status](https://github.com/jakeboone02/format-quantity/workflows/Continuous%20Integration/badge.svg)
[![codecov.io](https://codecov.io/github/jakeboone02/format-quantity/coverage.svg?branch=master)](https://codecov.io/github/jakeboone02/format-quantity?branch=master)
[![downloads](https://img.shields.io/npm/dm/format-quantity.svg)](http://npm-stat.com/charts.html?package=format-quantity&from=2015-08-01)
[![MIT License](https://img.shields.io/npm/l/format-quantity.svg)](http://opensource.org/licenses/MIT)

Formats a number (or string that appears to be a number) as one would see it written in imperial measurements, e.g. "1 1/2" instead of "1.5". To use vulgar fraction characters like "⅞", pass `true` as the second argument.

For the inverse operation, converting a string (which may include mixed numbers or vulgar fractions) to a `number`, check out [numeric-quantity](https://www.npmjs.com/package/numeric-quantity) or, if you're interested in parsing recipe ingredient strings, try [parse-ingredient](https://www.npmjs.com/package/parse-ingredient).

## Installation

### npm

```shell
# npm
npm i format-quantity

# yarn
yarn add format-quantity
```

### Browser

In the browser, all exports including the `formatQuantity` function are available on the global object `FormatQuantity`.

```html
<script src="https://unpkg.com/format-quantity"></script>
<script>
  console.log(FormatQuantity.formatQuantity(10.5)); // "10 1/2"
</script>
```

## Usage

```js
import { formatQuantity } from 'format-quantity';

formatQuantity(1.5); // "1 1/2"
formatQuantity(2.66); // "2 2/3"
formatQuantity(3.875, true); // "3⅞"
```

The return value will be `null` if the provided argument is not a number or a string that evaluates to a number using `parseFloat`. The return value will be an empty string (`""`) if the provided argument is `0` or `"0"` (this is done to fit the primary use case of recipe ingredient quantities).

## Options

The second parameter to `formatQuantity` can be a `boolean` value or an options object.

### `vulgarFractions`

| Type      | Default |
| --------- | ------: |
| `boolean` | `false` |

Returns vulgar fractions when appropriate. This option has the same effect as passing a plain `boolean` value as the second parameter.

```js
formatQuantity(3.875, { vulgarFractions: true }); // "3⅞"
// is the same as
formatQuantity(3.875, true); // "3⅞"
```

### `tolerance`

| Type     | Default |
| -------- | ------: |
| `number` | `0.009` |

This option determines how close the decimal portion of a number has to be to the actual quotient of a fraction to be considered a match. For example, consider the fraction 1⁄3: `1 ÷ 3 = 0.3333...` repeating forever. The number `0.333` (333 thousandths) is not equivalent to 1⁄3, but it's very close. So even though `0.333 !== (1 / 3)`, `formatQuantity(0.333)` will return `"1/3"` the same as `formatQuantity(1/3)`.

A lower tolerance increases the likelihood that `formatQuantity` will return a decimal representation instead of a fraction or mixed number since the matching algorithm will be stricter. An greater tolerance increases the likelihood that `formatQuantity` will return a fraction or mixed number, but at the risk of arbitrarily matching an incorrect fraction simply because it gets evaluated first (see [`src/index.ts`](src/index.ts) for the actual order of evaluation).

```js
// Low tolerance - returns a decimal since 0.333 is not close enough to 1/3
formatQuantity(0.333, { tolerance: 0.00001 }); // "0.333"
// High tolerance - matches "1/3" even for "3/10"
formatQuantity(0.3, { tolerance: 0.1 }); // "1/3"
// Way too high tolerance - incorrect result because thirds get evaluated before halves
formatQuantity(0.5, { tolerance: 0.5 }); // "1/3"
```

### `fractionSlash`

| Type      | Default |
| --------- | ------: |
| `boolean` | `false` |

Uses the [fraction slash character](<https://en.wikipedia.org/wiki/Slash_(punctuation)#Fractions>) (`"\u2044"`) to separate the numerator and denominator instead of the regular "solidus" slash (`"\u002f"`). This option is ignored if the `vulgarFractions` option is also `true`.

```js
formatQuantity(3.875, { fractionSlash: true }); // "3 7⁄8"
formatQuantity(3.875, { fractionSlash: true, vulgarFractions: true }); // "3⅞"
```

## Other exports

| Name                     | Type                         | Description                                                                                                                                                 |
| ------------------------ | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultTolerance`       | `number`                     | `0.009`                                                                                                                                                     |
| `fractionDecimalMatches` | `[number, VulgarFraction][]` | List of fractions and the decimal values that are close enough to match them (inputs are evaluated against the decimal values in the order of this array)   |
| `vulgarToPlainMap`       | `object`                     | Map of vulgar fraction characters to their equivalent ASCII strings (`"⅓"` to `"1/3"`, `"⅞"` to `"7/8"`, etc.)                                              |
| `FormatQuantityOptions`  | `interface`                  | Shape of `formatQuantity`'s second parameter, if not a `boolean` value                                                                                      |
| `VulgarFraction`         | `type`                       | The set of [vulgar fraction characters](https://en.wikipedia.org/wiki/Number_Forms) (`"\u00bc"`, `"\u00bd"`, `"\u00be"`, and `"\u2150"` through `"\u215e"`) |
