export type base32Variant = 'RFC3548' | 'RFC4648' | 'RFC4648-HEX' | 'Crockford';
export type base32Options = {
    padding: boolean;
};
export declare function encode(data: ArrayBuffer, variant: base32Variant, options: base32Options): string;
