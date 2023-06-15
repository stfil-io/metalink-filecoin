import { SnapConfig } from "@stfil/metalink-filecoin-types";
import {
  hasMetaMask,
  isMetamaskSnapsSupported,
  isSnapInstalled,
} from "./utils";
import { MetaLinkFilecoinSnap } from "./snap";

const defaultSnapOrigin = "npm:@stfil/metalink-filecoin";

export { MetaLinkFilecoinSnap } from "./snap";
export {
  hasMetaMask,
  isMetamaskSnapsSupported,
  isSnapInstalled,
} from "./utils";

export type SnapInstallationParamNames = "version" | string;

/**
 * Install and enable MetaLinkFilecoin snap
 *
 * Checks for existence of Metamask and version compatibility with snaps before installation.
 *
 * Provided snap configuration must define at least network property so predefined configuration can be selected.
 * All other properties are optional, and if present will overwrite predefined property.
 *
 * @param config - SnapConfig
 * @param snapOrigin
 *
 * @return MetaLinkFilecoinSnap - adapter object that exposes snap API
 */
export async function enableMetaLinkFilecoinSnap(
  config: Partial<SnapConfig>,
  snapOrigin?: string,
  snapInstallationParams: Record<SnapInstallationParamNames, unknown> = {}
): Promise<MetaLinkFilecoinSnap> {
  const snapId = snapOrigin ?? defaultSnapOrigin;

  // check all conditions
  if (!hasMetaMask()) {
    throw new Error("Metamask is not installed");
  }
  if (!(await isMetamaskSnapsSupported())) {
    throw new Error("Current Metamask version doesn't support snaps");
  }
  if (!config.network) {
    throw new Error("Configuration must at least define network type");
  }

  const isInstalled = await isSnapInstalled(snapId);

  if (!isInstalled) {
    // // enable snap
    await window.ethereum.request({
      method: "wallet_requestSnaps",
      params: {
        [snapId]: { ...snapInstallationParams },
      },
    });
  }

  //await unlockMetamask();

  // create snap describer
  const snap = new MetaLinkFilecoinSnap(snapOrigin || defaultSnapOrigin);
  // set initial configuration
  await (await snap.getApi()).configure(config);
  // return snap object
  return snap;
}
