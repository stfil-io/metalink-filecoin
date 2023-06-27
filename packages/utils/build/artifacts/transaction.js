"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Methods = exports.TxVersion = void 0;
/**
 *
 */
var TxVersion;
(function (TxVersion) {
    TxVersion[TxVersion["Zero"] = 0] = "Zero";
})(TxVersion = exports.TxVersion || (exports.TxVersion = {}));
/**
 * Specific method to call on an actor
 * For more information about actor, please refer to this {@link https://spec.filecoin.io/systems/filecoin_vm/actor/#section-systems.filecoin_vm.actor|link}
 */
var Methods;
(function (Methods) {
    Methods[Methods["Transfer"] = 0] = "Transfer";
    Methods[Methods["InvokeEVM"] = 3844450837] = "InvokeEVM";
})(Methods = exports.Methods || (exports.Methods = {}));
//# sourceMappingURL=transaction.js.map