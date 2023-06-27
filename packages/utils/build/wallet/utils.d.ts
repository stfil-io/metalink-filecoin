/// <reference types="node" />
import { SignatureType } from '../artifacts/wallet';
import { Buffer } from 'buffer';
/**
 * Returns the third position from path
 * @param path - path to parse
 * @returns coin type
 */
export declare const getCoinTypeFromPath: (path: string) => string;
/**
 * Calculate the CID (content identifier) from a raw data (buffer)
 * For more information about CID, please refer to this {@link https://spec.filecoin.io/glossary/#section-glossary.cid|link}
 * @param message - data to get CID from
 * @returns generated CID
 */
export declare function getCID(message: Buffer): Buffer;
/**
 * Digest a raw piece of data (buffer)
 * @param message - data to digest
 * @returns digest result
 */
export declare function getDigest(message: Buffer): Buffer;
/**
 * Run basic validation on a piece of data that could potentially be a private key
 * @param privateKey - piece of data that intents to be a private key
 * @returns parsed private key as buffer
 */
export declare const tryToPrivateKeyBuffer: (privateKey: string | Buffer) => Buffer;
/**
 * Generate the f1/t1 payload from public key
 * @param uncompressedPublicKey - public key
 * @returns generated payload
 */
export declare const getPayloadSECP256K1: (uncompressedPublicKey: Uint8Array) => Buffer;
/**
 * Validate if a given number is a valid signature type
 * @param type - possible signature type
 * @returns whether the input is a signature type or not
 */
export declare const isSignatureType: (type: number) => type is SignatureType;
