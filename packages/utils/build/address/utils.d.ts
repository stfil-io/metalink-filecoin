/// <reference types="node" />
import { Network, NetworkPrefix } from '../artifacts/address';
import { Buffer } from 'buffer';
/**
 * Calculates the checksum of a given payload according to filecoin specifications
 * For more information about checksums, please refer to this {@link https://spec.filecoin.io/appendix/address/#section-appendix.address.checksum|link}.
 * @param payload - represents the information to calculate the checksum from
 */
export declare function getChecksum(payload: Buffer): Buffer;
/**
 * Looks for the end of a leb128 encoded number according to the algorithm specification.
 * For more information about leb128, please refer to this {@link https://en.wikipedia.org/wiki/LEB128|link}.
 * @param input - leb128 encoded data
 */
export declare function getLeb128Length(input: Buffer): number;
/**
 * Validate is the given string is a valid filecoin network prefix type
 * @param networkPrefix - input string to validate
 * @returns whether the input is a valid network prefix or not
 */
export declare const validateNetworkPrefix: (networkPrefix: string) => networkPrefix is NetworkPrefix;
/**
 * Validate is the given string is a valid filecoin network type
 * @param network - input string to validate
 * @returns whether the input is a valid network or not
 */
export declare const validateNetwork: (network: string) => network is Network;
/**
 * Get network prefix from a given network
 * @param network - input string to validate
 * @returns network prefix
 */
export declare const getNetworkPrefix: (network: Network) => NetworkPrefix;
/**
 * Check if a given network is testnet or not
 * @param network - input string to validate
 * @returns network prefix
 */
export declare const isTestnet: (network: Network) => boolean;
