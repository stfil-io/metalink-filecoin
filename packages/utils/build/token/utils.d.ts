import BN from 'bn.js';
/**
 * Convert a BN number to string float, based on the indicated precision
 * @param value - value to convert string to
 * @param precision - how many digits represent one unit of a token
 * @returns string float number expressed on the requested precision
 */
export declare const bnToString: (value: BN, precision: number) => string;
/**
 * Remove trailing zeros that are not relevant, as the string represents a float number
 * @param value - string float number to remove trailing zeros from
 * @returns string float number without trailing zeros
 */
export declare const trimTrailingZeros: (value: string) => string;
