"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const utils_1 = require("./utils");
const token_1 = require("../artifacts/token");
const utils_2 = require("../transaction/utils");
const FEMTO_MUL = new bn_js_1.default(10).pow(new bn_js_1.default(token_1.MILLI_DECIMALS));
const PICO_MUL = new bn_js_1.default(10).pow(new bn_js_1.default(token_1.MICRO_DECIMALS));
const NANO_MUL = new bn_js_1.default(10).pow(new bn_js_1.default(token_1.NANO_DECIMALS));
const MICRO_MUL = new bn_js_1.default(10).pow(new bn_js_1.default(token_1.PICO_DECIMALS));
const MILLI_MUL = new bn_js_1.default(10).pow(new bn_js_1.default(token_1.FEMTO_DECIMALS));
const WHOLE_MUL = new bn_js_1.default(10).pow(new bn_js_1.default(token_1.ATTO_DECIMALS));
/**
 * Token allows to handle the different denominations filecoin uses.
 * You can convert from and to atto, nano and whole, as well as do operations like
 * addition and subtraction. Besides, logical operations can be applied, such as
 * grater than, equal to, less than, and so on.
 * For more information about denominations, please refer to this {@link https://docs.filecoin.io/about/assets/fil-token/#denominations-of-filecoin|link}
 */
class Token {
    constructor(value) {
        this.value = value;
        /**
         * Allows to add to Token amounts. It will update the current value internally.
         * @param val - Token to add to the current value
         * @returns the current Token instance (with the internal value updated). This allows to chain many operations together.
         */
        this.add = (val) => {
            this.value = this.value.add(val.value);
            return this;
        };
        /**
         * Allows to subtract to Token amounts. It will update the current value internally.
         * @param val - Token to substract to the current value
         * @returns the current Token instance (with the internal value updated). This allows to chain many operations together.
         */
        this.sub = (val) => {
            this.value = this.value.sub(val.value);
            return this;
        };
        /**
         * Allows compare which is grater
         * @param val - Token to compare to the current value
         * @returns if the current value is grater or not
         */
        this.gt = (val) => this.value.gt(val.value);
        /**
         * Allows compare which is grater or equal
         * @param val - Token to compare to the current value
         * @returns if the current value is grater or equal, or not
         */
        this.gte = (val) => this.value.gte(val.value);
        /**
         * Allows compare which is less
         * @param val - Token to compare to the current value
         * @returns if the current value is less or not
         */
        this.lt = (val) => this.value.lt(val.value);
        /**
         * Allows compare which is less or equal
         * @param val - Token to compare to the current value
         * @returns if the current value is less or equal, or not
         */
        this.lte = (val) => this.value.lte(val.value);
        /**
         * Check if the value is negative
         * @returns whether the value is negative or not
         */
        this.isNegative = () => this.value.isNeg();
        /**
         * Check if the value is positive
         * @returns whether the value is positive or not
         */
        this.isPositive = () => !this.value.isNeg();
        /**
         * Check if the value is zero
         * @returns whether the value is zero or not
         */
        this.isZero = () => this.value.isZero();
        /**
         * Express the current value as fil (token unit as whole)
         * @returns the value expressed as whole
         */
        this.toWhole = () => (0, utils_1.bnToString)(this.value, token_1.ATTO_DECIMALS); // precision: ATTO_DECIMALS - WHOLE_DECIMALS
        /**
         * Express the current value as milliFil
         * @returns the value expressed as milliFil
         */
        this.toMilli = () => (0, utils_1.bnToString)(this.value, token_1.ATTO_DECIMALS - token_1.MILLI_DECIMALS);
        /**
         * Express the current value as microFil
         * @returns the value expressed as microFil
         */
        this.toMicro = () => (0, utils_1.bnToString)(this.value, token_1.ATTO_DECIMALS - token_1.MICRO_DECIMALS);
        /**
         * Express the current value as nanoFil
         * @returns the value expressed as nanoFil
         */
        this.toNano = () => (0, utils_1.bnToString)(this.value, token_1.ATTO_DECIMALS - token_1.NANO_DECIMALS);
        /**
         * Express the current value as picoFil
         * @returns the value expressed as picoFil
         */
        this.toPico = () => (0, utils_1.bnToString)(this.value, token_1.ATTO_DECIMALS - token_1.PICO_DECIMALS);
        /**
         * Express the current value as femtoFil
         * @returns the value expressed as femtoFil
         */
        this.toFemto = () => (0, utils_1.bnToString)(this.value, token_1.ATTO_DECIMALS - token_1.FEMTO_DECIMALS);
        /**
         * Express the current value as attoFil.
         * @returns the value expressed as attoFil
         */
        this.toAtto = () => (0, utils_1.bnToString)(this.value, 0); // precision: ATTO_DECIMALS - ATTO_DECIMALS
        /**
         * Serialize the current value as bigint (buffer) per Filecoin specification.
         * The result denomination is atto fil.
         * 1 byte sign (0x00 positive - 0x01 negative) + arbitrary buffer length (big endian)
         * @returns serialized value
         */
        this.serialize = () => (0, utils_2.serializeBigNum)(this.value.toString(10), 10);
    }
}
exports.Token = Token;
/**
 * Creates an instance with 0 as value
 */
Token.zero = () => new Token(new bn_js_1.default('0'));
/**
 * Parse buffer value as attoFil.
 * @param value - attoFil value to parse
 * @returns new Token instance
 */
Token.deserialize = (value) => new Token(new bn_js_1.default((0, utils_2.deserializeBigNum)(value, 10), 10));
/**
 * Parse string value as attoFil
 * @param value - attoFil value to parse
 * @returns new Token instance
 */
Token.fromAtto = (value) => new Token(new bn_js_1.default(value)); // new BN(value).mul(ATTO_MUL)
/**
 * Parse string value as femtoFil
 * @param value - femtoFil value to parse
 * @returns new Token instance
 */
Token.fromFemto = (value) => new Token(new bn_js_1.default(value).mul(FEMTO_MUL));
/**
 * Parse string value as picoFil
 * @param value - picoFil value to parse
 * @returns new Token instance
 */
Token.fromPico = (value) => new Token(new bn_js_1.default(value).mul(PICO_MUL));
/**
 * Parse string value as nanoFil
 * @param value - nanoFil value to parse
 * @returns new Token instance
 */
Token.fromNano = (value) => new Token(new bn_js_1.default(value).mul(NANO_MUL));
/**
 * Parse string value as microFIL
 * @param value - microFIL value to parse
 * @returns new Token instance
 */
Token.fromMicro = (value) => new Token(new bn_js_1.default(value).mul(MICRO_MUL));
/**
 * Parse string value as milliFIL
 * @param value - milliFIL value to parse
 * @returns new Token instance
 */
Token.fromMilli = (value) => new Token(new bn_js_1.default(value).mul(MILLI_MUL));
/**
 * Parse string value as FIL (tokens as whole unit)
 * @param value - fils value to parse
 * @returns new Token instance
 */
Token.fromWhole = (value) => new Token(new bn_js_1.default(value).mul(WHOLE_MUL));
//# sourceMappingURL=index.js.map