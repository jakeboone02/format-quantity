# format-quantity

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
