[![npm][badge-npm]](https://www.npmjs.com/package/format-quantity)
![workflow status](https://github.com/jakeboone02/format-quantity/actions/workflows/main.yml/badge.svg)
[![codecov.io](https://codecov.io/github/jakeboone02/format-quantity/coverage.svg?branch=main)](https://codecov.io/github/jakeboone02/format-quantity?branch=main)
[![downloads](https://img.shields.io/npm/dm/format-quantity.svg)](https://npm-stat.com/charts.html?package=format-quantity&from=2015-08-01)
[![MIT License](https://img.shields.io/npm/l/format-quantity.svg)](https://opensource.org/licenses/MIT)

Formats a number (or string that appears to be a number) as one would see it written in imperial measurements, e.g. "1 1/2" instead of "1.5".

**[Full documentation](https://jakeboone02.github.io/format-quantity/)**

Features:

- To use vulgar fraction characters like "⅞", pass `true` as the second argument. Other options like Roman numerals are described below.
- String inputs are parsed with [`numeric-quantity`](https://www.npmjs.com/package/numeric-quantity), so mixed numbers (`"1 1/2"`), vulgar fractions (`"½"`), bare fractions (`"1/3"`), and comma/underscore-separated numbers (`"1,000"`) are all accepted in addition to plain decimal strings.
- The return value will be `null` if the first argument is not a `number` or `string`, or is a string with no recognizable numeric portion at the start. Trailing junk is tolerated, so `formatQuantity("1.5 cups")` returns `"1 1/2"`.
- The return value will be an empty string (`""`) if the first argument is `0` or `"0"`, which fits the primary use case of formatting recipe ingredient quantities.
- Values too large or too small for positional notation are returned in JavaScript's exponential form (e.g. `formatQuantity(1e21)` is `"1e+21"`), and `Infinity`/`-Infinity` are stringified as-is.

> _For the inverse operation—converting a string to a `number`—check out [numeric-quantity](https://www.npmjs.com/package/numeric-quantity). It handles mixed numbers, vulgar fractions, comma/underscore separators, and Roman numerals._
>
> _If you're interested in parsing recipe ingredient strings, try [parse-ingredient](https://www.npmjs.com/package/parse-ingredient)._

## Usage

### Installed

```js
import { formatQuantity } from 'format-quantity';

formatQuantity(1.5); // "1 1/2"
formatQuantity(2.66); // "2 2/3"
formatQuantity(3.875, true); // "3⅞"
```

### CDN

As an ES module:

```html
<script type="module">
  import { formatQuantity } from 'https://cdn.jsdelivr.net/npm/format-quantity/+esm';

  console.log(formatQuantity(10.5)); // "10 1/2"
</script>
```

As UMD (all exports are properties of the global object `FormatQuantity`):

```html
<script src="https://unpkg.com/format-quantity"></script>
<script>
  console.log(FormatQuantity.formatQuantity(10.5)); // "10 1/2"
</script>
```

## Options

The second parameter to `formatQuantity` can be a `boolean` value or an options object.

### `vulgarFractions`

| Type      | Default |
| --------- | ------- |
| `boolean` | `false` |

Returns vulgar fractions when appropriate. This option has the same effect as passing a plain `boolean` value as the second parameter.

```js
formatQuantity(3.875, { vulgarFractions: true }); // "3⅞"
// is the same as
formatQuantity(3.875, true); // "3⅞"
```

Note: `formatQuantity` supports sixteenths, but no vulgar fraction characters exist for that denomination. Therefore the `vulgarFractions` option has no effect if the fraction portion of the final string is an odd numerator over a denominator of `16`.

### `fractionSlash`

| Type      | Default |
| --------- | ------- |
| `boolean` | `false` |

Uses the [fraction slash character](<https://en.wikipedia.org/wiki/Slash_(punctuation)#Fractions>) (`"\u2044"`) to separate the numerator and denominator instead of the regular "solidus" slash (`"\u002f"`), with Unicode superscript numerator and subscript denominator digits. This option is ignored if the `vulgarFractions` option is also `true`.

```js
formatQuantity(3.875, { fractionSlash: true }); // "3 ⁷⁄₈"
formatQuantity(3.875, { fractionSlash: true, vulgarFractions: true }); // "3⅞"
```

### `separator`

| Type     | Default |
| -------- | ------- |
| `string` | N/A     |

Overrides the string placed between the whole number and the fraction. When not specified, the default is `" "` (a space) for ASCII and fraction-slash fractions, and `""` (no space) for vulgar fractions. Common alternatives include a hyphen (`"-"`) and a no-break space (`"\u00a0"`).

```js
formatQuantity(1.5, { separator: '-' }); // "1-1/2"
formatQuantity(1.5, { separator: ' ', vulgarFractions: true }); // "1 ½"
formatQuantity(1.5, { separator: '\u00a0' }); // "1\u00a01/2" (no-break space)
```

### `tolerance`

| Type              |  Default |
| ----------------- | -------: |
| `number \| false` | `0.0075` |

This option determines how close the decimal portion of a number has to be to the actual quotient of a fraction to be considered a match. For example, consider the fraction 1⁄3: $1 \div 3 = 0.\overline{333}$, repeating forever. The number `0.333` (exactly 333 thousandths) is not equivalent to 1⁄3, but it's very close. So even though $0.333 \neq 1 \div 3$, both `formatQuantity(0.333)` and `formatQuantity(1/3)` will return `"1/3"`.

The window is centered on the exact quotient and is checked against every candidate fraction; when more than one is within the window, the **closest** one wins regardless of evaluation order.

A lower tolerance increases the likelihood that `formatQuantity` will return a decimal representation instead of a fraction or mixed number since the matching algorithm will be stricter. A higher tolerance increases the likelihood that `formatQuantity` will return a fraction or mixed number, but at the risk of matching a fraction that is only loosely related to the input.

```js
// Low tolerance - returns a decimal since 0.333 is not close enough to 1/3
formatQuantity(0.333, { tolerance: 0.00001 }); // "0.333"
// High tolerance - 0.3 is within 0.1 of both 5/16 and 1/3, and 5/16 is closer
formatQuantity(0.3, { tolerance: 0.1 }); // "5/16"
```

Two values are special:

- `0` means **only exact quotients match**. Anything else falls through to its decimal representation.
- `false` **disables fraction matching entirely**, so every non-integer is returned as a decimal.

```js
formatQuantity(1.5, { tolerance: 0 }); // "1 1/2" (0.5 is exactly 1 ÷ 2)
formatQuantity(1.51, { tolerance: 0 }); // "1.51"
formatQuantity(1.5, { tolerance: false }); // "1.5"
```

Any other value—a negative number, `NaN`, a numeric string, `null`, `undefined`—is ignored and the default is used instead.

### `zeroFormat`

| Type     | Default |
| -------- | ------- |
| `string` | `""`    |

Specify the string to return when the input numerically evaluates to zero (`0`).

```js
formatQuantity(0, { zeroFormat: '' }); // "" (default)
formatQuantity(0, { zeroFormat: '0' }); // "0"
formatQuantity(0, { zeroFormat: 'N/A' }); // "N/A"
```

### `romanNumerals`

| Type      | Default |
| --------- | ------: |
| `boolean` | `false` |

Coerces the number into an integer using `Math.floor`, then formats the value as Roman numerals. The algorithm uses strict, modern rules, so the number must be between 1 and 3999 (inclusive). Values outside that range return `null`.

When this option is `true`, all other options are ignored.

```js
formatQuantity(1214, { romanNumerals: true }); // "MCCXIV"
formatQuantity(12.14, { romanNumerals: true, vulgarFractions: true }); // "XII"
formatQuantity(4000, { romanNumerals: true }); // null
formatQuantity(-1, { romanNumerals: true }); // null
```

> _`formatQuantity(0, …)` returns `""` regardless of this option, since the zero rule is applied before options are read._

[badge-npm]: https://img.shields.io/npm/v/format-quantity.svg?cacheSeconds=3600&logo=npm
