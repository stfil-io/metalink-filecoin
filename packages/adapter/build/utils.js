"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSnapInstalled = exports.isMetamaskSnapsSupported = exports.hasMetaMask = void 0;
function hasMetaMask() {
    if (!window.ethereum) {
        return false;
    }
    return window.ethereum.isMetaMask;
}
exports.hasMetaMask = hasMetaMask;
async function getWalletSnaps() {
    return await window.ethereum.request({
        method: "wallet_getSnaps",
    });
}
async function isMetamaskSnapsSupported() {
    try {
        await getWalletSnaps();
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.isMetamaskSnapsSupported = isMetamaskSnapsSupported;
/**
 *
 * @returns
 */
async function isSnapInstalled(snapOrigin, version) {
    console.log(await getWalletSnaps());
    try {
        return !!Object.values(await getWalletSnaps()).find((permission) => permission.id === snapOrigin &&
            (!version || permission.version === version));
    }
    catch (e) {
        console.log("Failed to obtain installed snaps", e);
        return false;
    }
}
exports.isSnapInstalled = isSnapInstalled;
//# sourceMappingURL=utils.js.map