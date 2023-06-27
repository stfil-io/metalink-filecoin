"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeBigNum = exports.serializeBigNum = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const buffer_1 = require("buffer");
/**
 * Serialize a string number to serialized BigInt per filecoin specification
 * @param value - string number to serialize
 * @param base - number base
 * @returns serialized bigint as buffer
 */
const serializeBigNum = (value, base = 10) => {
    if (value.toString() === '0')
        return buffer_1.Buffer.from('');
    const valueBN = new bn_js_1.default(value, base);
    const valueBuffer = valueBN.toArrayLike(buffer_1.Buffer, 'be', valueBN.byteLength());
    const signFlagBuffer = buffer_1.Buffer.from(valueBN.isNeg() ? '01' : '00', 'hex');
    return buffer_1.Buffer.concat([signFlagBuffer, valueBuffer]);
};
exports.serializeBigNum = serializeBigNum;
/**
 * Deserialize a buffer to string number per filecoin specification
 * @param value - buffer number to deserialize
 * @param base - number base
 * @returns deserialized bigint as string
 */
const deserializeBigNum = (value, base = 10) => {
    if (value.length === 0)
        return '0';
    if (value[0] != 0x00 && value[0] != 0x01)
        throw new Error('invalid bigint');
    const sign = value[0] === 0x01 ? '-' : '';
    const valueBN = new bn_js_1.default(value.subarray(1));
    return sign + valueBN.toString(base);
};
exports.deserializeBigNum = deserializeBigNum;
//# sourceMappingURL=utils.js.map