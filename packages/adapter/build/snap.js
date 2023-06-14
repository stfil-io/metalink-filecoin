"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetamaskFilecoinSnap = void 0;
const methods_1 = require("./methods");
class MetamaskFilecoinSnap {
    constructor(snapOrigin) {
        // eslint-disable-next-line @typescript-eslint/require-await
        this.getFilecoinSnapApi = async () => {
            return {
                calculateGasForMessage: methods_1.calculateGasForMessage.bind(this),
                configure: methods_1.configure.bind(this),
                exportPrivateKey: methods_1.exportPrivateKey.bind(this),
                getAddress: methods_1.getAddress.bind(this),
                getBalance: methods_1.getBalance.bind(this),
                getMessages: methods_1.getMessages.bind(this),
                getPublicKey: methods_1.getPublicKey.bind(this),
                sendMessage: methods_1.sendMessage.bind(this),
                signMessage: methods_1.signMessage.bind(this),
                signMessageRaw: methods_1.signMessageRaw.bind(this),
            };
        };
        this.snapOrigin = snapOrigin;
        this.snapId = this.snapOrigin;
    }
}
exports.MetamaskFilecoinSnap = MetamaskFilecoinSnap;
//# sourceMappingURL=snap.js.map