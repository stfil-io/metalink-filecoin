/// <reference types="node" />
import { Address } from '../address/index';
import { TransactionJSON, TxVersion } from '../artifacts/transaction';
import { NetworkPrefix } from '../artifacts/address';
import { Token } from '../token';
import { Buffer } from 'buffer';
/**
 * Represents a transaction in the filecoin blockchain.
 */
export declare class Transaction {
    version: TxVersion;
    to: Address;
    from: Address;
    nonce: number;
    value: string;
    gasLimit: number;
    gasFeeCap: string;
    gasPremium: string;
    method: number;
    params: string;
    constructor(version: TxVersion, to: Address, from: Address, nonce: number, value: string, gasLimit: number, gasFeeCap: string, gasPremium: string, method: number, params: string);
    /**
     * Create a new Transaction instance with the minimal values required
     * @param to - transaction receiver actor
     * @param from - transaction sender actor
     * @param value - tokens to be transferred from sender to receiver
     * @param method - method to be executed on the receiver actor
     * @param params - parameters related to the current tx. It is an optional parameter
     * @returns a new Transaction instance
     */
    static getNew: (to: Address, from: Address, value: Token, method: number, params?: Buffer) => Transaction;
    /**
     * Create a new Transaction instance from a cbor encoded transaction
     * @param networkPrefix - network type this tx comes from
     * @param cborMessage - cbor encoded tx to parse
     * @returns a new Transaction instance
     */
    static fromCBOR: (networkPrefix: NetworkPrefix, cborMessage: Buffer | string) => Promise<Transaction>;
    /**
     * Create a new Transaction instance from a json object
     * @param message - raw json object containing transaction fields in json types
     * @returns a new Transaction instance
     */
    static fromJSON: (message: unknown) => Transaction;
    /**
     * Export the current transaction fields to a JSON object (that can be saved in a file, or transmitted to anywhere)
     * @returns a JSON object representing the current transaction
     */
    toJSON: () => TransactionJSON;
    /**
     * Encode the current transaction as CBOR following filecoin specifications. This is the format required as input to sign it.
     * @returns a cbor encoded transaction (as buffer)
     */
    serialize: () => Promise<Buffer>;
}
