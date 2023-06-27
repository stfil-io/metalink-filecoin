"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const index_1 = require("../address/index");
const utils_1 = require("./utils");
const sleep_1 = require("../utils/sleep");
const transaction_1 = require("../artifacts/transaction");
const buffer_1 = require("buffer");
// Loading this module dynamically as it has no support to CJS
// The only way to keep CJS supported on our side is to load it dynamically
// The interface IpldDagCbor has been copied from the repo itself
let globalCbor;
Promise.resolve().then(() => __importStar(require('@ipld/dag-cbor'))).then(localCbor => {
    globalCbor = localCbor;
})
    .catch(e => {
    throw e;
});
/**
 * Represents a transaction in the filecoin blockchain.
 */
class Transaction {
    constructor(version, to, from, nonce, value, gasLimit, gasFeeCap, gasPremium, method, params) {
        this.version = version;
        this.to = to;
        this.from = from;
        this.nonce = nonce;
        this.value = value;
        this.gasLimit = gasLimit;
        this.gasFeeCap = gasFeeCap;
        this.gasPremium = gasPremium;
        this.method = method;
        this.params = params;
        /**
         * Export the current transaction fields to a JSON object (that can be saved in a file, or transmitted to anywhere)
         * @returns a JSON object representing the current transaction
         */
        this.toJSON = () => ({
            To: this.to.toString(),
            From: this.from.toString(),
            Nonce: this.nonce,
            Value: this.value,
            Params: this.params,
            GasFeeCap: this.gasFeeCap,
            GasPremium: this.gasPremium,
            GasLimit: this.gasLimit,
            Method: this.method,
        });
        /**
         * Encode the current transaction as CBOR following filecoin specifications. This is the format required as input to sign it.
         * @returns a cbor encoded transaction (as buffer)
         */
        this.serialize = async () => {
            const cbor = await (0, sleep_1.waitFor)(() => globalCbor);
            const message_to_encode = [
                this.version,
                this.to.toBytes(),
                this.from.toBytes(),
                this.nonce,
                (0, utils_1.serializeBigNum)(this.value, 10),
                this.gasLimit,
                (0, utils_1.serializeBigNum)(this.gasFeeCap, 10),
                (0, utils_1.serializeBigNum)(this.gasPremium, 10),
                this.method,
                buffer_1.Buffer.from(this.params, 'base64'),
            ];
            return buffer_1.Buffer.from(cbor.encode(message_to_encode));
        };
        if (value === '' || value.includes('-'))
            throw new Error('value must not be empty or negative');
    }
}
exports.Transaction = Transaction;
_a = Transaction;
/**
 * Create a new Transaction instance with the minimal values required
 * @param to - transaction receiver actor
 * @param from - transaction sender actor
 * @param value - tokens to be transferred from sender to receiver
 * @param method - method to be executed on the receiver actor
 * @param params - parameters related to the current tx. It is an optional parameter
 * @returns a new Transaction instance
 */
Transaction.getNew = (to, from, value, method, params = buffer_1.Buffer.alloc(0)) => new Transaction(transaction_1.TxVersion.Zero, to, from, 0, value.toAtto(), 0, '0', '0', method, params.toString('base64'));
/**
 * Create a new Transaction instance from a cbor encoded transaction
 * @param networkPrefix - network type this tx comes from
 * @param cborMessage - cbor encoded tx to parse
 * @returns a new Transaction instance
 */
Transaction.fromCBOR = async (networkPrefix, cborMessage) => {
    if (typeof cborMessage === 'string')
        cborMessage = buffer_1.Buffer.from(cborMessage, 'hex');
    const cbor = await (0, sleep_1.waitFor)(() => globalCbor);
    const decoded = cbor.decode(cborMessage);
    if (!(decoded instanceof Array))
        throw new Error('Decoded raw tx should be an array');
    if (decoded.length < 10)
        throw new Error('The cbor is missing some fields... please verify you have 9 fields.');
    const [txVersion, toRaw, fromRaw, nonceRaw, valueRaw, gasLimitRaw, gasFeeCapRaw, gasPremiumRaw, methodRaw, paramsRaw] = decoded;
    if (txVersion !== transaction_1.TxVersion.Zero)
        throw new Error('Unsupported version');
    if (valueRaw[0] === 0x01)
        throw new Error('Value cant be negative');
    const value = new bn_js_1.default(buffer_1.Buffer.from(valueRaw).toString('hex'), 16).toString(10);
    const gasFeeCap = new bn_js_1.default(buffer_1.Buffer.from(gasFeeCapRaw).toString('hex'), 16).toString(10);
    const gasPremium = new bn_js_1.default(buffer_1.Buffer.from(gasPremiumRaw).toString('hex'), 16).toString(10);
    return new Transaction(txVersion, index_1.Address.fromBytes(networkPrefix, toRaw), index_1.Address.fromBytes(networkPrefix, fromRaw), nonceRaw, value, gasLimitRaw, gasFeeCap, gasPremium, methodRaw, paramsRaw.toString('base64'));
};
/**
 * Create a new Transaction instance from a json object
 * @param message - raw json object containing transaction fields in json types
 * @returns a new Transaction instance
 */
Transaction.fromJSON = (message) => {
    if (typeof message !== 'object' || message == null)
        throw new Error('tx should be an json object');
    if (!('To' in message) || typeof message['To'] !== 'string')
        throw new Error("'To' is a required field and has to be a 'string'");
    if (!('From' in message) || typeof message['From'] !== 'string')
        throw new Error("'From' is a required field and has to be a 'string'");
    if (!('Nonce' in message) || typeof message['Nonce'] !== 'number')
        throw new Error("'Nonce' is a required field and has to be a 'number'");
    if (!('Value' in message) || typeof message['Value'] !== 'string' || message['Value'] === '' || message['Value'].includes('-'))
        throw new Error("'Value' is a required field and has to be a 'string' but not empty or negative");
    if (!('GasFeeCap' in message) || typeof message['GasFeeCap'] !== 'string')
        throw new Error("'GasFeeCap' is a required field and has to be a 'string'");
    if (!('GasPremium' in message) || typeof message['GasPremium'] !== 'string')
        throw new Error("'GasPremium' is a required field and has to be a 'string'");
    if (!('GasLimit' in message) || typeof message['GasLimit'] !== 'number')
        throw new Error("'GasLimit' is a required field and has to be a 'number'");
    if (!('Method' in message) || typeof message['Method'] !== 'number')
        throw new Error("'Method' is a required field and has to be a 'number'");
    if (!('Params' in message) || typeof message['Params'] !== 'string')
        throw new Error("'Params' is a required field and has to be a 'string'");
    return new Transaction(transaction_1.TxVersion.Zero, index_1.Address.fromString(message.To), index_1.Address.fromString(message.From), message.Nonce, message.Value, message.GasLimit, message.GasFeeCap, message.GasPremium, message.Method, message.Params);
};
//# sourceMappingURL=index.js.map