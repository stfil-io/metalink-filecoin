import { defaultSnapOrigin } from "../config";
import { MetaLinkFilecoinSnap, enableMetaLinkFilecoinSnap } from "@stfil/metalink-filecoin-adapter";

let isInstalled: boolean = false;
export interface SnapInitializationResponse {
    isSnapInstalled: boolean;
    snap?: MetaLinkFilecoinSnap;
}

export async function initiateFilecoinSnap(): Promise<SnapInitializationResponse> {
    const snapId = defaultSnapOrigin
    try {
        console.log('Attempting to connect to snap...');
        const MetaLinkFilecoinSnap = await enableMetaLinkFilecoinSnap({network: "f"}, snapId, {version: "latest"});
        isInstalled = true;
        console.log('Snap installed!');
        return {isSnapInstalled: true, snap: MetaLinkFilecoinSnap};
    } catch (e) {
        console.error(e);
        isInstalled = false;
        return {isSnapInstalled: false};
    }
}

export async function isFilecoinSnapInstalled(): Promise<boolean> {
    return isInstalled;
}
