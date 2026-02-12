export interface FormatQuantityOptions {
  /**
   * Output vulgar fractions, like "½" instead of "1/2", when appropriate.
   * Overrides the `fractionSlash` option.
   */
  vulgarFractions?: boolean;
  /**
   * Amount by which a number can deviate from the calculated quotient to be
   * considered a match. For example, 0.66 is close enough to 2 ÷ 3 (which
   * is 0.66666... repeating) to be considered equivalent so the function
   * will return "2/3". The smaller this number, the higher the likelihood that
   * the function will return a decimal instead of a fraction or mixed number.
   *
   * @default 0.0075
   */
  tolerance?: number;
  /**
   * Output the fraction slash character (⁄) instead of the "solidus"
   * slash (/) for fractions. Results appear like "1⁄2" instead of "1/2".
   * Overridden by the `vulgarFractions` option.
   */
  fractionSlash?: boolean;
  /**
   * Output in Roman numerals. Provided value must be between 1 and 3999, inclusive.
   * Decimal values will be ignored (`Math.floor` is used to remove them). Overrides
   * all other options.
   */
  romanNumerals?: boolean;
  /**
   * String to place between the whole number and fraction parts. When not specified,
   * defaults to `" "` for ASCII and fraction-slash fractions, and `""` for vulgar
   * fractions (preserving the standard typographic convention of no space before
   * vulgar fraction characters).
   */
  separator?: string;
}

/**
 * {@link FormatQuantityOptions} with all properties resolved to their
 * default values, except {@link FormatQuantityOptions.separator | separator}
 * which remains optional so that unset vs explicitly-set can be distinguished.
 */
export type ResolvedFormatQuantityOptions = Required<
  Omit<FormatQuantityOptions, 'separator'>
> &
  Pick<FormatQuantityOptions, 'separator'>;

/**
 * Function signature of {@link formatQuantity}.
 */
export interface FormatQuantity {
  (
    qty: string | number,
    options?: boolean | FormatQuantityOptions
  ): string | null;
}

/** Any numeric character. */
export type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
/** Any numeric character except '0'. */
export type NonZeroDigit = Exclude<Digit, '0'>;

/**
 * Fraction string with either one or two numeric characters in both the
 * numerator and denominator (but not two characters in the numerator while
 * the denominator only has one).
 */
export type SimpleFraction =
  | `${NonZeroDigit}/${NonZeroDigit}`
  | `${NonZeroDigit}/${NonZeroDigit}${Digit}`
  | `${NonZeroDigit}${Digit}/${NonZeroDigit}${Digit}`;

/**
 * Odd numerator sixteenth fraction strings.
 */
export type Sixteenth = `${
  | '1'
  | '3'
  | '5'
  | '7'
  | '9'
  | '11'
  | '13'
  | '15'}/16`;

/**
 * Unicode vulgar fraction code points.
 */
export type VulgarFraction =
  | '¼' // '\u00bc' | 0.25
  | '½' // '\u00bd' | 0.5
  | '¾' // '\u00be' | 0.75
  | '⅐' // '\u2150' | 0.142857...
  | '⅑' // '\u2151' | 0.111...
  | '⅒' // '\u2152' | 0.1
  | '⅓' // '\u2153' | 0.333...
  | '⅔' // '\u2154' | 0.666...
  | '⅕' // '\u2155' | 0.2
  | '⅖' // '\u2156' | 0.4
  | '⅗' // '\u2157' | 0.6
  | '⅘' // '\u2158' | 0.8
  | '⅙' // '\u2159' | 0.166...
  | '⅚' // '\u215a' | 0.833...
  | '⅛' // '\u215b' | 0.125
  | '⅜' // '\u215c' | 0.375
  | '⅝' // '\u215d' | 0.625
  | '⅞'; // '\u215e' | 0.875

/** @hidden */
export type FormatQuantityTests = Record<
  string,
  (
    | [Parameters<FormatQuantity>[0], ReturnType<FormatQuantity>]
    | [
        Parameters<FormatQuantity>[0],
        ReturnType<FormatQuantity>,
        Parameters<FormatQuantity>[1],
      ]
  )[]
>;
