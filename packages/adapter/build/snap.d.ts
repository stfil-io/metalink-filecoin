import { MetaLinkFilecoinSnapApi } from "@stfil/metalink-filecoin-types";
export declare class MetaLinkFilecoinSnap {
    protected readonly snapOrigin: string;
    protected readonly snapId: string;
    constructor(snapOrigin: string);
    getApi: () => Promise<MetaLinkFilecoinSnapApi>;
}
