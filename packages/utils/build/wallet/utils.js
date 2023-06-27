"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSignatureType = exports.getPayloadSECP256K1 = exports.tryToPrivateKeyBuffer = exports.getDigest = exports.getCID = exports.getCoinTypeFromPath = void 0;
const blakejs_1 = __importDefault(require("blakejs"));
const errors_1 = require("../address/errors");
const wallet_1 = require("../artifacts/wallet");
const buffer_1 = require("buffer");
const CID_PREFIX = buffer_1.Buffer.from([0x01, 0x71, 0xa0, 0xe4, 0x02, 0x20]);
const CID_LEN = 32;
/**
 * Returns the third position from path
 * @param path - path to parse
 * @returns coin type
 */
const getCoinTypeFromPath = (path) => {
    const split = path.split('/');
    return split[2].includes("'") ? split[2].substring(0, split[2].length - 1) : split[2];
};
exports.getCoinTypeFromPath = getCoinTypeFromPath;
/**
 * Calculate the CID (content identifier) from a raw data (buffer)
 * For more information about CID, please refer to this {@link https://spec.filecoin.io/glossary/#section-glossary.cid|link}
 * @param message - data to get CID from
 * @returns generated CID
 */
function getCID(message) {
    const blakeCtx = blakejs_1.default.blake2bInit(CID_LEN);
    blakejs_1.default.blake2bUpdate(blakeCtx, message);
    const hash = buffer_1.Buffer.from(blakejs_1.default.blake2bFinal(blakeCtx));
    return buffer_1.Buffer.concat([CID_PREFIX, hash]);
}
exports.getCID = getCID;
/**
 * Digest a raw piece of data (buffer)
 * @param message - data to digest
 * @returns digest result
 */
function getDigest(message) {
    // digest = blake2-256( prefix + blake2b-256(tx) )
    const blakeCtx = blakejs_1.default.blake2bInit(32);
    blakejs_1.default.blake2bUpdate(blakeCtx, getCID(message));
    return buffer_1.Buffer.from(blakejs_1.default.blake2bFinal(blakeCtx));
}
exports.getDigest = getDigest;
/**
 * Run basic validation on a piece of data that could potentially be a private key
 * @param privateKey - piece of data that intents to be a private key
 * @returns parsed private key as buffer
 */
const tryToPrivateKeyBuffer = (privateKey) => {
    if (typeof privateKey === 'string') {
        // We should have a padding!
        if (privateKey.substring(privateKey.length - 1) === '=')
            privateKey = buffer_1.Buffer.from(privateKey, 'base64');
        else
            throw new errors_1.InvalidPrivateKeyFormat();
    }
    if (privateKey.length !== 32)
        throw new errors_1.InvalidPrivateKeyFormat();
    return privateKey;
};
exports.tryToPrivateKeyBuffer = tryToPrivateKeyBuffer;
/**
 * Generate the f1/t1 payload from public key
 * @param uncompressedPublicKey - public key
 * @returns generated payload
 */
const getPayloadSECP256K1 = (uncompressedPublicKey) => {
    // blake2b-160
    const blakeCtx = blakejs_1.default.blake2bInit(20);
    blakejs_1.default.blake2bUpdate(blakeCtx, uncompressedPublicKey);
    return buffer_1.Buffer.from(blakejs_1.default.blake2bFinal(blakeCtx));
};
exports.getPayloadSECP256K1 = getPayloadSECP256K1;
/**
 * Validate if a given number is a valid signature type
 * @param type - possible signature type
 * @returns whether the input is a signature type or not
 */
const isSignatureType = (type) => wallet_1.SignatureType.BLS === type || wallet_1.SignatureType.SECP256K1 === type;
exports.isSignatureType = isSignatureType;
//# sourceMappingURL=utils.js.map