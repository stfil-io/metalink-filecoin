/// <reference types="node" />
import { Transaction } from '../transaction/index.js';
import { AccountData, SignatureJSON, SignatureType } from '../artifacts/wallet';
import { NetworkPrefix } from '../artifacts/address';
import { AddressSecp256k1 } from '../address';
import { Buffer } from 'buffer';
export declare class Wallet {
    /**
     * Try to recover account related data from raw private key
     * @param networkPrefix - network type this account belongs
     * @param type - which type of account must be derived
     * @param privateKey - private key raw data to recover account from
     * @param path - derivation path
     */
    static recoverAccount(networkPrefix: NetworkPrefix, type: SignatureType, privateKey: string | Buffer, path?: string): AccountData;
    /**
     * Sign a transaction using account the private key
     * @param accountData - account data generated from deriving a new account
     * @param tx - transaction to sign
     * @returns generated signature
     */
    static signTransaction: (accountData: Pick<AccountData, 'privateKey' | 'type'>, tx: Transaction) => Promise<Signature>;
    /**
     * Generate the public key based on an account private key
     * @param networkPrefix - network type this account belongs
     * @param privateKey - private key raw data to recover account from
     * @returns generated public key and new AddressSecp256k1 instance
     */
    protected static getPublicSecp256k1FromPrivKey: (networkPrefix: NetworkPrefix, privateKey: Buffer) => {
        publicKey: Buffer;
        address: AddressSecp256k1;
    };
}
/**
 * Contains the data related to a transaction signature
 */
export declare class Signature {
    protected type: SignatureType;
    protected data: Buffer;
    /**
     * Creates a new Signature instance based on a type and payload
     * @param type - signature type
     * @param data - signature payload
     */
    constructor(type: SignatureType, data: Buffer);
    /**
     * Create a new Signature instance from a raw JSON object
     * @param input - raw JSON input
     * @returns new Signature instance
     */
    static fromJSON: (input: unknown) => Signature;
    /**
     * Export a JSON object containing signature type and data (base64)
     * @returns signature JSON object
     */
    toJSON: () => SignatureJSON;
    /**
     * Getter to signature type
     */
    getType: () => SignatureType;
    /**
     * Getter to signature payload
     */
    getData: () => Buffer;
    /**
     * Whether the signature type is SECP256K1 or not
     */
    isSecp256k1: () => boolean;
    /**
     * Whether the signature type is BLS or not
     */
    isBls: () => boolean;
}
