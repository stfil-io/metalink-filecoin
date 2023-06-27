"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyMessage = void 0;
const secp256k1_1 = __importDefault(require("secp256k1"));
const transaction_1 = require("./transaction");
const wallet_1 = require("./wallet");
const utils_1 = require("./wallet/utils");
const wallet_2 = require("./artifacts/wallet");
const address_1 = require("./artifacts/address");
const address_2 = require("./address");
const buffer_1 = require("buffer");
async function verifyMessage(message, signature, networkPrefix) {
    if (typeof message === 'object') {
        const tx = transaction_1.Transaction.fromJSON({
            To: message.to,
            From: message.from,
            Value: message.value,
            Params: message.params,
            GasFeeCap: message.gasfeecap,
            GasPremium: message.gaspremium,
            GasLimit: message.gaslimit,
            Nonce: message.nonce,
            Method: message.method,
        });
        const serializedTx = await tx.serialize();
        const txDigest = (0, utils_1.getDigest)(serializedTx);
        const sign = wallet_1.Signature.fromJSON({ Type: wallet_2.SignatureType.SECP256K1, Data: signature });
        const sigDat = sign.getData();
        const uncompressedPublicKey = secp256k1_1.default.ecdsaRecover(sigDat.subarray(0, -1), sigDat[64], txDigest, false);
        const payload = (0, utils_1.getPayloadSECP256K1)(uncompressedPublicKey);
        return (new address_2.AddressSecp256k1(networkPrefix ? networkPrefix : address_1.NetworkPrefix.Mainnet, payload)).toString();
    }
    const msg = `0x${buffer_1.Buffer.from(message, 'utf8').toString('hex')}`;
    const messageBuf = buffer_1.Buffer.from(msg, 'hex');
    let signatureBuf;
    if (typeof signature === 'string') {
        // We should have a padding!
        if (signature.slice(-1) === '=') {
            signatureBuf = buffer_1.Buffer.from(signature, 'base64');
        }
        else {
            signatureBuf = buffer_1.Buffer.from(signature, 'hex');
        }
    }
    else {
        signatureBuf = signature;
    }
    const messageDigest = (0, utils_1.getDigest)(messageBuf);
    const uncompressedPublicKey = secp256k1_1.default.ecdsaRecover(signatureBuf.subarray(0, -1), signatureBuf[64], messageDigest, false);
    const payload = (0, utils_1.getPayloadSECP256K1)(uncompressedPublicKey);
    return (new address_2.AddressSecp256k1(networkPrefix ? networkPrefix : address_1.NetworkPrefix.Mainnet, payload)).toString();
}
exports.verifyMessage = verifyMessage;
//# sourceMappingURL=verify.js.map