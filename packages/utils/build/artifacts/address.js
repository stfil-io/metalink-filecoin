"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ID_PAYLOAD_MAX_NUM = exports.ID_PAYLOAD_MAX_LEN = exports.SECP256K1_PAYLOAD_LEN = exports.ACTOR_PAYLOAD_LEN = exports.BLS_PAYLOAD_LEN = exports.SUB_ADDRESS_MAX_LEN = exports.ETH_ADDRESS_LEN = exports.NetworkPrefix = exports.Network = exports.ProtocolIndicator = exports.ACTOR_ID_ETHEREUM_MASK = exports.DelegatedNamespace = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
/**
 * Well-known address manager in the filecoin network. An address manager is an actor that can create new actors and assign a f4 address to the new actor.
 * For more information, please refer to this {@link https://docs.filecoin.io/developers/smart-contracts/concepts/accounts-and-assets/#extensible-user-defined-actor-addresses-f4|link}.
 */
var DelegatedNamespace;
(function (DelegatedNamespace) {
    DelegatedNamespace["ETH"] = "10";
})(DelegatedNamespace = exports.DelegatedNamespace || (exports.DelegatedNamespace = {}));
/**
 * Actor ids can be converted to a special ethereum address in the filecoin blockchain. This is the prefix in ethereum addresses that indicates that
 * it holds an actor id.
 */
exports.ACTOR_ID_ETHEREUM_MASK = 0xff;
/**
 * Indicates the type of address.
 * For more information, please refer to this {@link https://spec.filecoin.io/appendix/address/#section-appendix.address.protocol-indicator|link}.
 */
var ProtocolIndicator;
(function (ProtocolIndicator) {
    ProtocolIndicator[ProtocolIndicator["ID"] = 0] = "ID";
    ProtocolIndicator[ProtocolIndicator["SECP256K1"] = 1] = "SECP256K1";
    ProtocolIndicator[ProtocolIndicator["ACTOR"] = 2] = "ACTOR";
    ProtocolIndicator[ProtocolIndicator["BLS"] = 3] = "BLS";
    ProtocolIndicator[ProtocolIndicator["DELEGATED"] = 4] = "DELEGATED";
})(ProtocolIndicator = exports.ProtocolIndicator || (exports.ProtocolIndicator = {}));
/**
 * Different Filecoin networks.
 * For more information, please refer to this {@link https://docs.filecoin.io/basics/what-is-filecoin/networks/|link}.
 */
var Network;
(function (Network) {
    Network["Mainnet"] = "mainnet";
    Network["Calibration"] = "calibration";
    Network["Butterfly"] = "butterfly";
})(Network = exports.Network || (exports.Network = {}));
/**
 * Prefix that indicates what network the address corresponds.
 * For more information, please refer to this {@link https://spec.filecoin.io/appendix/address/#section-appendix.address.network-prefix|link}.
 */
var NetworkPrefix;
(function (NetworkPrefix) {
    NetworkPrefix["Mainnet"] = "f";
    NetworkPrefix["Testnet"] = "t";
})(NetworkPrefix = exports.NetworkPrefix || (exports.NetworkPrefix = {}));
/**
 *  Payload length for ethereum addresses
 */
exports.ETH_ADDRESS_LEN = 20;
/**
 * Maximum sub address length for type four (f4/t4) addresses
 */
exports.SUB_ADDRESS_MAX_LEN = 54;
/**
 *  Payload length for type three (f3/t3) addresses
 */
exports.BLS_PAYLOAD_LEN = 48;
/**
 * Payload length for type two (f2/t2) addresses
 */
exports.ACTOR_PAYLOAD_LEN = 20;
/**
 *  Payload length for type one (f1/t1) addresses
 */
exports.SECP256K1_PAYLOAD_LEN = 20;
/**
 *  Maximum payload length for type one (f0/t0) addresses
 */
exports.ID_PAYLOAD_MAX_LEN = 9;
/**
 *  Maximum actor id (decimal) for type one (f0/t0) addresses
 */
exports.ID_PAYLOAD_MAX_NUM = new bn_js_1.default(2).pow(new bn_js_1.default(63)).sub(new bn_js_1.default(1));
//# sourceMappingURL=address.js.map