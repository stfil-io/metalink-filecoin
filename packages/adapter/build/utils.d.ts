export declare function hasMetaMask(): boolean;
export type GetSnapsResponse = {
    [k: string]: {
        permissionName?: string;
        id?: string;
        version?: string;
        initialPermissions?: {
            [k: string]: unknown;
        };
    };
};
export declare function isMetamaskSnapsSupported(): Promise<boolean>;
/**
 *
 * @returns
 */
export declare function isSnapInstalled(snapOrigin: string, version?: string): Promise<boolean>;
