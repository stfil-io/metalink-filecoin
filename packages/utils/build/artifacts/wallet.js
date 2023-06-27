"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureType = void 0;
/**
 * Enumerates the possible signature types filecoin network has to sign transactions
 * For more information about secp256k1 signature scheme, please refer to this {@link https://en.bitcoin.it/wiki/Secp256k1|link}.
 * For more information about bls signature scheme, please refer to this {@link https://en.wikipedia.org/wiki/BLS_digital_signature|link}.
 */
var SignatureType;
(function (SignatureType) {
    SignatureType[SignatureType["SECP256K1"] = 1] = "SECP256K1";
    SignatureType[SignatureType["BLS"] = 3] = "BLS";
})(SignatureType = exports.SignatureType || (exports.SignatureType = {}));
//# sourceMappingURL=wallet.js.map