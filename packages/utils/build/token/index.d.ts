/// <reference types="node" />
import BN from 'bn.js';
import { Buffer } from 'buffer';
/**
 * Token allows to handle the different denominations filecoin uses.
 * You can convert from and to atto, nano and whole, as well as do operations like
 * addition and subtraction. Besides, logical operations can be applied, such as
 * grater than, equal to, less than, and so on.
 * For more information about denominations, please refer to this {@link https://docs.filecoin.io/about/assets/fil-token/#denominations-of-filecoin|link}
 */
export declare class Token {
    value: BN;
    constructor(value: BN);
    /**
     * Creates an instance with 0 as value
     */
    static zero: () => Token;
    /**
     * Parse buffer value as attoFil.
     * @param value - attoFil value to parse
     * @returns new Token instance
     */
    static deserialize: (value: Buffer) => Token;
    /**
     * Parse string value as attoFil
     * @param value - attoFil value to parse
     * @returns new Token instance
     */
    static fromAtto: (value: string) => Token;
    /**
     * Parse string value as femtoFil
     * @param value - femtoFil value to parse
     * @returns new Token instance
     */
    static fromFemto: (value: string) => Token;
    /**
     * Parse string value as picoFil
     * @param value - picoFil value to parse
     * @returns new Token instance
     */
    static fromPico: (value: string) => Token;
    /**
     * Parse string value as nanoFil
     * @param value - nanoFil value to parse
     * @returns new Token instance
     */
    static fromNano: (value: string) => Token;
    /**
     * Parse string value as microFIL
     * @param value - microFIL value to parse
     * @returns new Token instance
     */
    static fromMicro: (value: string) => Token;
    /**
     * Parse string value as milliFIL
     * @param value - milliFIL value to parse
     * @returns new Token instance
     */
    static fromMilli: (value: string) => Token;
    /**
     * Parse string value as FIL (tokens as whole unit)
     * @param value - fils value to parse
     * @returns new Token instance
     */
    static fromWhole: (value: string) => Token;
    /**
     * Allows to add to Token amounts. It will update the current value internally.
     * @param val - Token to add to the current value
     * @returns the current Token instance (with the internal value updated). This allows to chain many operations together.
     */
    add: (val: Token) => Token;
    /**
     * Allows to subtract to Token amounts. It will update the current value internally.
     * @param val - Token to substract to the current value
     * @returns the current Token instance (with the internal value updated). This allows to chain many operations together.
     */
    sub: (val: Token) => Token;
    /**
     * Allows compare which is grater
     * @param val - Token to compare to the current value
     * @returns if the current value is grater or not
     */
    gt: (val: Token) => boolean;
    /**
     * Allows compare which is grater or equal
     * @param val - Token to compare to the current value
     * @returns if the current value is grater or equal, or not
     */
    gte: (val: Token) => boolean;
    /**
     * Allows compare which is less
     * @param val - Token to compare to the current value
     * @returns if the current value is less or not
     */
    lt: (val: Token) => boolean;
    /**
     * Allows compare which is less or equal
     * @param val - Token to compare to the current value
     * @returns if the current value is less or equal, or not
     */
    lte: (val: Token) => boolean;
    /**
     * Check if the value is negative
     * @returns whether the value is negative or not
     */
    isNegative: () => boolean;
    /**
     * Check if the value is positive
     * @returns whether the value is positive or not
     */
    isPositive: () => boolean;
    /**
     * Check if the value is zero
     * @returns whether the value is zero or not
     */
    isZero: () => boolean;
    /**
     * Express the current value as fil (token unit as whole)
     * @returns the value expressed as whole
     */
    toWhole: () => string;
    /**
     * Express the current value as milliFil
     * @returns the value expressed as milliFil
     */
    toMilli: () => string;
    /**
     * Express the current value as microFil
     * @returns the value expressed as microFil
     */
    toMicro: () => string;
    /**
     * Express the current value as nanoFil
     * @returns the value expressed as nanoFil
     */
    toNano: () => string;
    /**
     * Express the current value as picoFil
     * @returns the value expressed as picoFil
     */
    toPico: () => string;
    /**
     * Express the current value as femtoFil
     * @returns the value expressed as femtoFil
     */
    toFemto: () => string;
    /**
     * Express the current value as attoFil.
     * @returns the value expressed as attoFil
     */
    toAtto: () => string;
    /**
     * Serialize the current value as bigint (buffer) per Filecoin specification.
     * The result denomination is atto fil.
     * 1 byte sign (0x00 positive - 0x01 negative) + arbitrary buffer length (big endian)
     * @returns serialized value
     */
    serialize: () => Buffer;
}
