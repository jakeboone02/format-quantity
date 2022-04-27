# format-quantity

[![npm version](https://badge.fury.io/js/format-quantity.svg)](//npmjs.com/package/format-quantity)
![workflow status](https://github.com/jakeboone02/format-quantity/workflows/Continuous%20Integration/badge.svg)
[![codecov.io](https://codecov.io/github/jakeboone02/format-quantity/coverage.svg?branch=master)](https://codecov.io/github/jakeboone02/format-quantity?branch=master)
[![downloads](https://img.shields.io/npm/dm/format-quantity.svg)](http://npm-stat.com/charts.html?package=format-quantity&from=2015-08-01)
[![MIT License](https://img.shields.io/npm/l/format-quantity.svg)](http://opensource.org/licenses/MIT)

Formats a number (or string that appears to be a number) as one would see it written in imperial measurements, e.g. "1 1/2" instead of "1.5". To use unicode vulgar fractions like "⅞", pass `true` as the second argument.

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

formatQuantity(1.5); // "1 1/2"
formatQuantity(2.66); // "2 2/3"
formatQuantity(3.875, true); // "3⅞"
```

The return value will be `null` if the provided argument is not a number or a string that evaluates to a number using `parseFloat`. The return value will be an empty string (`""`) if the provided argument is `0` or `"0"` (this is done to fit the primary use case of recipe ingredients).

## Options

The second parameter to `formatQuantity` can be a `boolean` value or an options object.

### `vulgarFractions`

| Type      | Default |
| --------- | ------: |
| `boolean` | `false` |

Returns unicode vulgar fractions when appropriate. This option has the same effect as passing a plain `boolean` value as the second parameter.

```js
formatQuantity(3.875, true); // "3⅞"
formatQuantity(3.875, { vulgarFractions: true }); // "3⅞"
```

### `tolerance`

| Type     | Default |
| -------- | ------: |
| `number` | `0.009` |

This option determines how close the decimal portion of a number has to be to the actual quotient of a fraction to be considered a match. For example, consider the fraction ⅓: `1 ÷ 3 = 0.3333...` repeating forever. But `0.333` is really close, so even though `0.333 === (1 / 3)` evaluates to `false`, `formatQuantity` will return `"1/3"`.

A decreased tolerance increases the likelihood that `formatQuantity` will return a decimal representation instead of a fraction or mixed number. An increased tolerance increases the likelihood that `formatQuantity` will return a fraction or mixed number, but a sufficiently high tolerance may match a fraction that doesn't make sense.

```js
// Low tolerance - returns decimal even though 0.333 is close to 1/3
formatQuantity(0.333, { tolerance: 0.00001 }); // "0.333"
// High tolerance - matches "1/3" even for "3/10"
formatQuantity(0.3, { tolerance: 0.1 }); // "1/3"
// Inappropriately high tolerance
formatQuantity(0.5, { tolerance: 0.5 }); // "1/3"
```

### `fractionSlash`

| Type      | Default |
| --------- | ------: |
| `boolean` | `false` |

Uses the [unicode fraction slash character](<https://en.wikipedia.org/wiki/Slash_(punctuation)#Fractions>) (`"\u2044"`) to separate the numerator and denominator instead of the regular "solidus" slash (`"\u002f"`). This option is ignored if the `vulgarFractions` option is `true`.

```js
formatQuantity(3.875, { fractionSlash: true }); // "3 7⁄8"
formatQuantity(3.875, { fractionSlash: true, vulgarFractions: true }); // "3⅞"
```

## Other exports

| Name                    | Type        | Description                                                                                                                                               |
| ----------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FormatQuantityOptions` | `interface` | Shape of `formatQuantity`'s second parameter, if not a `boolean` value                                                                                    |
| `vulgarToPlainMap`      | `object`    | Map of unicode vulgar fractions to their traditional ASCII equivalents (`"⅓"` to `"1/3"`, `"⅞"` to `"7/8"`, etc.)                                         |
| `VulgarFraction`        | `type`      | The set of [unicode vulgar fractions](https://en.wikipedia.org/wiki/Number_Forms) (`"\u00bc"`, `"\u00bd"`, `"\u00be"`, and `"\u2150"` through `"\u215e"`) |
