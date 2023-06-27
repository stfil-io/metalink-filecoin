"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateGasForMessage = exports.getMessages = exports.sendMessage = exports.signMessageRaw = exports.signMessage = exports.configure = exports.exportPrivateKey = exports.getBalance = exports.getPublicKey = exports.getAddress = void 0;
async function sendSnapMethod(request, snapId) {
    return await window.ethereum.request({
        method: "wallet_invokeSnap",
        params: {
            request,
            snapId,
        },
    });
}
async function getAddress() {
    return await sendSnapMethod({ method: "fil_getAddress" }, this.snapId);
}
exports.getAddress = getAddress;
async function getPublicKey() {
    return await sendSnapMethod({ method: "fil_getPublicKey" }, this.snapId);
}
exports.getPublicKey = getPublicKey;
async function getBalance() {
    return await sendSnapMethod({ method: "fil_getBalance" }, this.snapId);
}
exports.getBalance = getBalance;
async function exportPrivateKey() {
    return await sendSnapMethod({ method: "fil_exportPrivateKey" }, this.snapId);
}
exports.exportPrivateKey = exportPrivateKey;
async function configure(configuration) {
    return await sendSnapMethod({ method: "fil_configure", params: { configuration: configuration } }, this.snapId);
}
exports.configure = configure;
async function signMessage(message) {
    return await sendSnapMethod({ method: "fil_signMessage", params: { message: message } }, this.snapId);
}
exports.signMessage = signMessage;
async function signMessageRaw(rawMessage) {
    return await sendSnapMethod({ method: "fil_signMessageRaw", params: { message: rawMessage } }, this.snapId);
}
exports.signMessageRaw = signMessageRaw;
async function sendMessage(signedMessage) {
    return await sendSnapMethod({ method: "fil_sendMessage", params: { signedMessage: signedMessage } }, this.snapId);
}
exports.sendMessage = sendMessage;
async function getMessages() {
    return await sendSnapMethod({ method: "fil_getMessages" }, this.snapId);
}
exports.getMessages = getMessages;
async function calculateGasForMessage(message, maxFee) {
    return await sendSnapMethod({
        method: "fil_getGasForMessage",
        params: { maxFee: maxFee, message: message },
    }, this.snapId);
}
exports.calculateGasForMessage = calculateGasForMessage;
//# sourceMappingURL=methods.js.map