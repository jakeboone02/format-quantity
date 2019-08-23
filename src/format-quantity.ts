/**
 * Determines if two numbers are close enough to consider
 * them equal for our purposes
 */
const closeEnough = (a: number, b: number) => Math.abs(a - b) < 0.009;

/**
 * Formats a number (or string that appears to be a number)
 * as one would see it written in imperial measurements, e.g.
 * "1 1/2" instead of "1.5".
 */
function formatQuantity(qty: string | number) {
  const dQty = typeof qty === 'string' ? parseFloat(qty) : qty;

  // Bomb out if not a number
  if (isNaN(dQty) || dQty === null) {
    return '-1';
  }

  // Return an empty string if the value is zero
  if (dQty === 0) {
    return '';
  }

  const dQtyAbs = Math.abs(dQty);
  const iFloor = Math.floor(dQtyAbs);
  const sFloor = iFloor === 0.0 ? '' : `${dQty < 0 ? '-' : ''}${iFloor} `;
  const dDecimal = dQtyAbs - iFloor;

  // Handle integers first.  Just return the given value as a string.
  if (dDecimal === 0) {
    return `${dQty}`;
  }

  // Handle infinitely repeating decimals next, since
  // we'll never get an exact match for a switch case:
  if (closeEnough(dDecimal, 0.33)) {
    return sFloor + '1/3';
  } else if (closeEnough(dDecimal, 0.66)) {
    return sFloor + '2/3';
  } else if (closeEnough(dDecimal, 0.2)) {
    return sFloor + '1/5';
  } else if (closeEnough(dDecimal, 0.4)) {
    return sFloor + '2/5';
  } else if (closeEnough(dDecimal, 0.6)) {
    return sFloor + '3/5';
  } else if (closeEnough(dDecimal, 0.8)) {
    return sFloor + '4/5';
  } else {
    switch (dDecimal) {
      case 0.125:
        return sFloor + '1/8';
      case 0.25:
        return sFloor + '1/4';
      case 0.375:
        return sFloor + '3/8';
      case 0.5:
        return sFloor + '1/2';
      case 0.625:
        return sFloor + '5/8';
      case 0.75:
        return sFloor + '3/4';
      case 0.875:
        return sFloor + '7/8';
    }
  }

  return `${dQty}`;
}

export default formatQuantity;
