"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTestnet = exports.getNetworkPrefix = exports.validateNetwork = exports.validateNetworkPrefix = exports.getLeb128Length = exports.getChecksum = void 0;
const blakejs_1 = __importDefault(require("blakejs"));
const address_1 = require("../artifacts/address");
const buffer_1 = require("buffer");
/**
 * Calculates the checksum of a given payload according to filecoin specifications
 * For more information about checksums, please refer to this {@link https://spec.filecoin.io/appendix/address/#section-appendix.address.checksum|link}.
 * @param payload - represents the information to calculate the checksum from
 */
function getChecksum(payload) {
    const blakeCtx = blakejs_1.default.blake2bInit(4);
    blakejs_1.default.blake2bUpdate(blakeCtx, payload);
    return buffer_1.Buffer.from(blakejs_1.default.blake2bFinal(blakeCtx));
}
exports.getChecksum = getChecksum;
/**
 * Looks for the end of a leb128 encoded number according to the algorithm specification.
 * For more information about leb128, please refer to this {@link https://en.wikipedia.org/wiki/LEB128|link}.
 * @param input - leb128 encoded data
 */
function getLeb128Length(input) {
    let count = 0;
    while (count < input.length) {
        const byte = input[count];
        count++;
        if (byte < 128)
            break;
    }
    if (count == input.length)
        return -1;
    return count;
}
exports.getLeb128Length = getLeb128Length;
/**
 * Validate is the given string is a valid filecoin network prefix type
 * @param networkPrefix - input string to validate
 * @returns whether the input is a valid network prefix or not
 */
const validateNetworkPrefix = (networkPrefix) => Object.values(address_1.NetworkPrefix).includes(networkPrefix);
exports.validateNetworkPrefix = validateNetworkPrefix;
/**
 * Validate is the given string is a valid filecoin network type
 * @param network - input string to validate
 * @returns whether the input is a valid network or not
 */
const validateNetwork = (network) => Object.values(address_1.Network).includes(network);
exports.validateNetwork = validateNetwork;
/**
 * Get network prefix from a given network
 * @param network - input string to validate
 * @returns network prefix
 */
const getNetworkPrefix = (network) => (network === address_1.Network.Mainnet ? address_1.NetworkPrefix.Mainnet : address_1.NetworkPrefix.Testnet);
exports.getNetworkPrefix = getNetworkPrefix;
/**
 * Check if a given network is testnet or not
 * @param network - input string to validate
 * @returns network prefix
 */
const isTestnet = (network) => network !== address_1.Network.Mainnet;
exports.isTestnet = isTestnet;
//# sourceMappingURL=utils.js.map