import { SnapConfig } from "@stfil/metalink-filecoin-types";
import { MetamaskFilecoinSnap } from "./snap";
export { MetamaskFilecoinSnap } from "./snap";
export { hasMetaMask, isMetamaskSnapsSupported, isSnapInstalled, } from "./utils";
export type SnapInstallationParamNames = "version" | string;
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
export declare function enableFilecoinSnap(config: Partial<SnapConfig>, snapOrigin?: string, snapInstallationParams?: Record<SnapInstallationParamNames, unknown>): Promise<MetamaskFilecoinSnap>;
