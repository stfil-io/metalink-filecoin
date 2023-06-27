"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signature = exports.Wallet = void 0;
const secp256k1_1 = __importDefault(require("secp256k1"));
const utils_1 = require("./utils");
const wallet_1 = require("../artifacts/wallet");
const address_1 = require("../address");
const buffer_1 = require("buffer");
class Wallet {
    /**
     * Try to recover account related data from raw private key
     * @param networkPrefix - network type this account belongs
     * @param type - which type of account must be derived
     * @param privateKey - private key raw data to recover account from
     * @param path - derivation path
     */
    static recoverAccount(networkPrefix, type, privateKey, path) {
        switch (type) {
            case wallet_1.SignatureType.SECP256K1: {
                privateKey = (0, utils_1.tryToPrivateKeyBuffer)(privateKey);
                const { publicKey, address } = Wallet.getPublicSecp256k1FromPrivKey(networkPrefix, privateKey);
                return {
                    type,
                    privateKey,
                    address,
                    publicKey,
                    path,
                };
            }
            default:
                throw new Error('not supported yet');
        }
    }
}
exports.Wallet = Wallet;
_a = Wallet;
/**
 * Sign a transaction using account the private key
 * @param accountData - account data generated from deriving a new account
 * @param tx - transaction to sign
 * @returns generated signature
 */
Wallet.signTransaction = async (accountData, tx) => {
    const serializedTx = await tx.serialize();
    const txDigest = (0, utils_1.getDigest)(serializedTx);
    const { privateKey, type } = accountData;
    switch (type) {
        case wallet_1.SignatureType.SECP256K1: {
            const signature = secp256k1_1.default.ecdsaSign(txDigest, privateKey);
            return new Signature(type, buffer_1.Buffer.concat([buffer_1.Buffer.from(signature.signature), buffer_1.Buffer.from([signature.recid])]));
        }
        default:
            throw new Error('not supported yet');
    }
};
/**
 * Generate the public key based on an account private key
 * @param networkPrefix - network type this account belongs
 * @param privateKey - private key raw data to recover account from
 * @returns generated public key and new AddressSecp256k1 instance
 */
Wallet.getPublicSecp256k1FromPrivKey = (networkPrefix, privateKey) => {
    const pubKey = secp256k1_1.default.publicKeyCreate(privateKey);
    const uncompressedPublicKey = new Uint8Array(65);
    secp256k1_1.default.publicKeyConvert(pubKey, false, uncompressedPublicKey);
    const uncompressedPublicKeyBuf = buffer_1.Buffer.from(uncompressedPublicKey);
    const payload = (0, utils_1.getPayloadSECP256K1)(uncompressedPublicKey);
    return {
        publicKey: uncompressedPublicKeyBuf,
        address: new address_1.AddressSecp256k1(networkPrefix, payload),
    };
};
/**
 * Contains the data related to a transaction signature
 */
class Signature {
    /**
     * Creates a new Signature instance based on a type and payload
     * @param type - signature type
     * @param data - signature payload
     */
    constructor(type, data) {
        this.type = type;
        this.data = data;
        /**
         * Export a JSON object containing signature type and data (base64)
         * @returns signature JSON object
         */
        this.toJSON = () => ({ Type: this.type, Data: this.data.toString('base64') });
        /**
         * Getter to signature type
         */
        this.getType = () => this.type;
        /**
         * Getter to signature payload
         */
        this.getData = () => this.data;
        /**
         * Whether the signature type is SECP256K1 or not
         */
        this.isSecp256k1 = () => this.type === wallet_1.SignatureType.SECP256K1;
        /**
         * Whether the signature type is BLS or not
         */
        this.isBls = () => this.type === wallet_1.SignatureType.BLS;
    }
}
exports.Signature = Signature;
/**
 * Create a new Signature instance from a raw JSON object
 * @param input - raw JSON input
 * @returns new Signature instance
 */
Signature.fromJSON = (input) => {
    if (typeof input !== 'object' || input === null)
        throw new Error('input should be an object');
    if (!('Type' in input) || typeof input.Type !== 'number')
        throw new Error("'Type' should be a number");
    if (!(0, utils_1.isSignatureType)(input.Type))
        throw new Error('invalid signature type');
    if (!('Data' in input) || typeof input.Data !== 'string')
        throw new Error("'Data' should be a base64 encoded string");
    return new Signature(input.Type, buffer_1.Buffer.from(input.Data, 'base64'));
};
//# sourceMappingURL=index.js.map