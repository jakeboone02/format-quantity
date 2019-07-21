# format-quantity

Formats a number (or string that appears to be a number) as one would see it written in imperial measurements, e.g. "1 1/2" instead of "1.5".

### Installation

##### npm

[format-quantity](https://www.npmjs.com/package/format-quantity)

```
npm i --save format-quantity
```

##### Browser

In the browser, available as a global function `formatQuantity`.

```
<script src="bower_components/format-quantity/index.js"></script>
<script>
  console.log(formatQuantity(10.5));  // "10 1/2"
</script>
```

### Usage

```
var formatQuantity = require("format-quantity");  // assuming node environment

console.log( formatQuantity(1.5) );   // "1 1/2"
console.log( formatQuantity(2.66) );  // "2 2/3"
```
