[![npm version](https://badge.fury.io/js/format-quantity.svg)](//npmjs.com/package/format-quantity)
[![Travis (.org)](https://img.shields.io/travis/jakeboone02/format-quantity)](https://travis-ci.org/jakeboone02/format-quantity)

# format-quantity

Formats a number (or string that appears to be a number) as one would see it written in imperial measurements, e.g. "1 1/2" instead of "1.5".

For the inverse operation, converting a string (which may include mixed numbers or vulgar fractions) to a number, check out [numeric-quantity](https://www.npmjs.com/package/numeric-quantity).

### Installation

##### npm

```
npm i --save format-quantity
```

or

```
yarn add format-quantity
```

##### Browser

In the browser, available as a global function `formatQuantity`.

```
<script src="path/to/format-quantity.umd.js"></script>
<script>
  console.log(formatQuantity(10.5));  // "10 1/2"
</script>
```

### Usage

```
import formatQuantity from "format-quantity";

console.log( formatQuantity(1.5) );   // "1 1/2"
console.log( formatQuantity(2.66) );  // "2 2/3"
```
