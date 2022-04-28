import * as FormatQuantity from '.';

declare global {
  var formatQuantity: typeof FormatQuantity.formatQuantity;
  var vulgarToPlainMap: typeof FormatQuantity.vulgarToPlainMap;
}

globalThis.formatQuantity = FormatQuantity.formatQuantity;
globalThis.vulgarToPlainMap = FormatQuantity.vulgarToPlainMap;
