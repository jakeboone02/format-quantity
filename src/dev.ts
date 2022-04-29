import * as FormatQuantity from '.';
import { formatQuantityTests } from './formatQuantityTests';
import type { FormatQuantityTests } from './types';

declare global {
  var formatQuantity: typeof FormatQuantity.formatQuantity;
  var vulgarToPlainMap: typeof FormatQuantity.vulgarToPlainMap;
  var formatQuantityTests: FormatQuantityTests;
}

globalThis.formatQuantity = FormatQuantity.formatQuantity;
globalThis.vulgarToPlainMap = FormatQuantity.vulgarToPlainMap;
globalThis.formatQuantityTests = formatQuantityTests;
