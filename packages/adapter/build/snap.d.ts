import { FilecoinSnapApi } from "@stfil/metalink-filecoin-types";
export declare class MetamaskFilecoinSnap {
    protected readonly snapOrigin: string;
    protected readonly snapId: string;
    constructor(snapOrigin: string);
    getFilecoinSnapApi: () => Promise<FilecoinSnapApi>;
}
