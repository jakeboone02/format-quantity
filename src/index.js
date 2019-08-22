/**
 * Determines if two numbers are close enough to consider
 * them equal for our purposes
 * @param {number} a first number
 * @param {number} b second number
 */
var closeEnough = function(a, b) {
  return Math.abs(a - b) < 0.009;
};

/**
 * Formats a number (or string that appears to be a number)
 * as one would see it written in imperial measurements, e.g.
 * "1 1/2" instead of "1.5".
 * @param {number|string} sInQty The quantity
 */
var formatQuantity = function(sInQty) {
  var sQty = sInQty;

  // bomb out if not a number
  if (isNaN(sQty)) {
    return '-1';
  }

  var dQty = sQty - 0;

  if (dQty === 0) {
    return '';
  }

  var iFloor = Math.floor(dQty);
  var sFloor = iFloor === 0.0 ? '' : iFloor + ' ';
  var dDecimal = dQty - iFloor;

  // Handle integers first.  Just return the given value.
  if (dDecimal === 0) {
    return sInQty + '';
  }

  // Handle infinitely repeating decimals next, since
  // we'll never get an exact match for a switch case:
  if (closeEnough(dDecimal, 0.33)) {
    sQty = sFloor + '1/3';
  } else if (closeEnough(dDecimal, 0.66)) {
    sQty = sFloor + '2/3';
  } else if (closeEnough(dDecimal, 0.2)) {
    sQty = sFloor + '1/5';
  } else if (closeEnough(dDecimal, 0.4)) {
    sQty = sFloor + '2/5';
  } else if (closeEnough(dDecimal, 0.6)) {
    sQty = sFloor + '3/5';
  } else if (closeEnough(dDecimal, 0.8)) {
    sQty = sFloor + '4/5';
  } else {
    switch (dDecimal) {
      case 0.125:
        sQty = sFloor + '1/8';
        break;
      // case 0.2:   sQty = sFloor + "1/5"; break;
      case 0.25:
        sQty = sFloor + '1/4';
        break;
      case 0.375:
        sQty = sFloor + '3/8';
        break;
      // case 0.4:   sQty = sFloor + "2/5"; break;
      case 0.5:
        sQty = sFloor + '1/2';
        break;
      // case 0.6:   sQty = sFloor + "3/5"; break;
      case 0.625:
        sQty = sFloor + '5/8';
        break;
      case 0.75:
        sQty = sFloor + '3/4';
        break;
      // case 0.8:   sQty = sFloor + "4/5"; break;
      case 0.875:
        sQty = sFloor + '7/8';
        break;
    }
  }

  return sQty + '';
};

export default formatQuantity;
