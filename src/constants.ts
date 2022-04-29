import type { VulgarFraction } from './types';

export const defaultTolerance = 0.009;

/**
 * A map of vulgar fractions to their traditional ASCII equivalents.
 */
export const vulgarToPlainMap: {
  [vf in VulgarFraction]: `${number}/${number}`;
} = {
  '¼': '1/4',
  '½': '1/2',
  '¾': '3/4',
  '⅐': '1/7',
  '⅑': '1/9',
  '⅒': '1/10',
  '⅓': '1/3',
  '⅔': '2/3',
  '⅕': '1/5',
  '⅖': '2/5',
  '⅗': '3/5',
  '⅘': '4/5',
  '⅙': '1/6',
  '⅚': '5/6',
  '⅛': '1/8',
  '⅜': '3/8',
  '⅝': '5/8',
  '⅞': '7/8',
};

export const fractionDecimalMatches: [number, VulgarFraction][] = [
  [0.33, '⅓'],
  [0.66, '⅔'],
  [0.2, '⅕'],
  [0.4, '⅖'],
  [0.6, '⅗'],
  [0.8, '⅘'],
  [0.166, '⅙'],
  [0.833, '⅚'],
  [0.143, '⅐'],
  [0.111, '⅑'],
  [0.1, '⅒'],
  [0.125, '⅛'],
  [0.25, '¼'],
  [0.375, '⅜'],
  [0.5, '½'],
  [0.625, '⅝'],
  [0.75, '¾'],
  [0.875, '⅞'],
];
