import type { SimpleFraction, VulgarFraction } from './types';

export const defaultTolerance = 0.0075;

export const vulgarFractions = [
  '¼',
  '½',
  '¾',
  '⅐',
  '⅑',
  '⅒',
  '⅓',
  '⅔',
  '⅕',
  '⅖',
  '⅗',
  '⅘',
  '⅙',
  '⅚',
  '⅛',
  '⅜',
  '⅝',
  '⅞',
];

/**
 * A map of vulgar or simple fractions to their traditional ASCII equivalents.
 * Simple fractions (i.e., sixteenths) map to themselves.
 */
export const vulgarToPlainMap: Record<string, SimpleFraction> = {
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
  '1/16': '1/16',
  '3/16': '3/16',
  '5/16': '5/16',
  '7/16': '7/16',
  '9/16': '9/16',
  '11/16': '11/16',
  '13/16': '13/16',
  '15/16': '15/16',
};

export const fractionDecimalMatches: [
  number,
  VulgarFraction | SimpleFraction
][] = [
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
  [0.0625, '1/16'],
  [0.1875, '3/16'],
  [0.3125, '5/16'],
  [0.4375, '7/16'],
  [0.5625, '9/16'],
  [0.6875, '11/16'],
  [0.8125, '13/16'],
  [0.9375, '15/16'],
];
