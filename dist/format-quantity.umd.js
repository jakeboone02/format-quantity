(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.formatQuantity = factory());
}(this, function () { 'use strict';

  /**
   * Determines if two numbers are close enough to consider
   * them equal for our purposes
   */
  var closeEnough = function (a, b) { return Math.abs(a - b) < 0.009; };
  /**
   * Formats a number (or string that appears to be a number)
   * as one would see it written in imperial measurements, e.g.
   * "1 1/2" instead of "1.5".
   */
  function formatQuantity(qty) {
      var dQty = typeof qty === 'string' ? parseFloat(qty) : qty;
      // bomb out if not a number
      if (isNaN(dQty) || dQty === null) {
          return '-1';
      }
      if (dQty === 0) {
          return '';
      }
      var iFloor = Math.floor(dQty);
      var sFloor = iFloor === 0.0 ? '' : iFloor + " ";
      var dDecimal = dQty - iFloor;
      // Handle integers first.  Just return the given value.
      if (dDecimal === 0) {
          return "" + dQty;
      }
      // Handle infinitely repeating decimals next, since
      // we'll never get an exact match for a switch case:
      if (closeEnough(dDecimal, 0.33)) {
          return sFloor + '1/3';
      }
      else if (closeEnough(dDecimal, 0.66)) {
          return sFloor + '2/3';
      }
      else if (closeEnough(dDecimal, 0.2)) {
          return sFloor + '1/5';
      }
      else if (closeEnough(dDecimal, 0.4)) {
          return sFloor + '2/5';
      }
      else if (closeEnough(dDecimal, 0.6)) {
          return sFloor + '3/5';
      }
      else if (closeEnough(dDecimal, 0.8)) {
          return sFloor + '4/5';
      }
      else {
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
      return "" + dQty;
  }

  return formatQuantity;

}));
