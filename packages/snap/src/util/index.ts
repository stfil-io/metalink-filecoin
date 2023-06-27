import { LotusRpcApi } from "../filecoin/types";
import { Address } from "@stfil/metalink-filecoin-utils";
import { NetworkPrefix } from "@stfil/metalink-filecoin-utils/build/artifacts/address";

export async function isMainnet(
    api: LotusRpcApi,
  ): Promise<boolean> {
    try {
        const network = await api.stateNetworkName();
        if (network.toLocaleLowerCase() === 'mainnet') {
            return true;
        }
        return false;
    } catch(_) {
        return false;
    }
}

export async function getNetworkPrefix(
    api: LotusRpcApi,
  ): Promise<NetworkPrefix> {
    try {
        const network = await api.stateNetworkName();
        if (network.toLocaleLowerCase() === 'mainnet') {
            return NetworkPrefix.Mainnet;
        }
        return NetworkPrefix.Testnet;
    } catch(_) {
        return NetworkPrefix.Testnet;
    }
}

export async function getFilAddress(
    api: LotusRpcApi,
    addr: string,
  ): Promise<string> {
    try {
        const network = await api.stateNetworkName();
        const networkPrefix = network.toLocaleLowerCase() === 'mainnet' ? NetworkPrefix.Mainnet: NetworkPrefix.Testnet;
        if (addr && addr.startsWith("0x")) {
            return Address.fromEthAddress(networkPrefix, addr).toString();
        }
        return addr;
    } catch(_) {
        return addr;
    }
}
