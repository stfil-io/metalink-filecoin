"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimTrailingZeros = exports.bnToString = void 0;
/**
 * Convert a BN number to string float, based on the indicated precision
 * @param value - value to convert string to
 * @param precision - how many digits represent one unit of a token
 * @returns string float number expressed on the requested precision
 */
const bnToString = (value, precision) => {
    const sign = value.isNeg() ? '-' : '';
    const valueStr = value.abs().toString();
    const decimals = valueStr.length - precision;
    const parsedValue = (0, exports.trimTrailingZeros)(decimals > 0 ? `${valueStr.substring(0, decimals)}.${valueStr.substring(decimals)}` : `0.${''.padStart(-1 * decimals, '0')}${valueStr}`);
    return `${sign}${parsedValue}`;
};
exports.bnToString = bnToString;
/**
 * Remove trailing zeros that are not relevant, as the string represents a float number
 * @param value - string float number to remove trailing zeros from
 * @returns string float number without trailing zeros
 */
const trimTrailingZeros = (value) => {
    for (let i = value.length - 1; i >= 0; i--) {
        if (value[i] == '.')
            return value.substring(0, i);
        if (value[i] != '0' || i === 1)
            return value.substring(0, i + 1);
    }
    throw new Error('invalid value');
};
exports.trimTrailingZeros = trimTrailingZeros;
//# sourceMappingURL=utils.js.map