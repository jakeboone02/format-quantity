import * as FormatQuantity from '.';
import { formatQuantityTests } from './formatQuantityTests';
import type { FormatQuantityTests } from './types';

declare global {
  var formatQuantity: typeof FormatQuantity.formatQuantity;
  var vulgarToAsciiMap: typeof FormatQuantity.vulgarToAsciiMap;
  var formatQuantityTests: FormatQuantityTests;
  var defaultTolerance: number;
}

globalThis.formatQuantity = FormatQuantity.formatQuantity;
globalThis.vulgarToAsciiMap = FormatQuantity.vulgarToAsciiMap;
globalThis.formatQuantityTests = formatQuantityTests;
globalThis.defaultTolerance = FormatQuantity.defaultTolerance;
