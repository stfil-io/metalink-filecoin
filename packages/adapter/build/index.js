"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableFilecoinSnap = exports.isSnapInstalled = exports.isMetamaskSnapsSupported = exports.hasMetaMask = exports.MetamaskFilecoinSnap = void 0;
const utils_1 = require("./utils");
const snap_1 = require("./snap");
const defaultSnapOrigin = "npm:@stfil/metalink-filecoin";
var snap_2 = require("./snap");
Object.defineProperty(exports, "MetamaskFilecoinSnap", { enumerable: true, get: function () { return snap_2.MetamaskFilecoinSnap; } });
var utils_2 = require("./utils");
Object.defineProperty(exports, "hasMetaMask", { enumerable: true, get: function () { return utils_2.hasMetaMask; } });
Object.defineProperty(exports, "isMetamaskSnapsSupported", { enumerable: true, get: function () { return utils_2.isMetamaskSnapsSupported; } });
Object.defineProperty(exports, "isSnapInstalled", { enumerable: true, get: function () { return utils_2.isSnapInstalled; } });
/**
 * Install and enable Filecoin snap
 *
 * Checks for existence of Metamask and version compatibility with snaps before installation.
 *
 * Provided snap configuration must define at least network property so predefined configuration can be selected.
 * All other properties are optional, and if present will overwrite predefined property.
 *
 * @param config - SnapConfig
 * @param snapOrigin
 *
 * @return MetamaskFilecoinSnap - adapter object that exposes snap API
 */
async function enableFilecoinSnap(config, snapOrigin, snapInstallationParams = {}) {
    const snapId = snapOrigin !== null && snapOrigin !== void 0 ? snapOrigin : defaultSnapOrigin;
    // check all conditions
    if (!(0, utils_1.hasMetaMask)()) {
        throw new Error("Metamask is not installed");
    }
    if (!(await (0, utils_1.isMetamaskSnapsSupported)())) {
        throw new Error("Current Metamask version doesn't support snaps");
    }
    if (!config.network) {
        throw new Error("Configuration must at least define network type");
    }
    const isInstalled = await (0, utils_1.isSnapInstalled)(snapId);
    if (!isInstalled) {
        // // enable snap
        await window.ethereum.request({
            method: "wallet_requestSnaps",
            params: {
                [snapId]: Object.assign({}, snapInstallationParams),
            },
        });
    }
    //await unlockMetamask();
    // create snap describer
    const snap = new snap_1.MetamaskFilecoinSnap(snapOrigin || defaultSnapOrigin);
    // set initial configuration
    await (await snap.getFilecoinSnapApi()).configure(config);
    // return snap object
    return snap;
}
exports.enableFilecoinSnap = enableFilecoinSnap;
//# sourceMappingURL=index.js.map