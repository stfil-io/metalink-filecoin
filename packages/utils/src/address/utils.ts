import blake from 'blakejs'
import { Network, NetworkPrefix } from '../artifacts/address'
import { Buffer } from 'buffer'

/**
 * Calculates the checksum of a given payload according to filecoin specifications
 * For more information about checksums, please refer to this {@link https://spec.filecoin.io/appendix/address/#section-appendix.address.checksum|link}.
 * @param payload - represents the information to calculate the checksum from
 */
export function getChecksum(payload: Buffer): Buffer {
  const blakeCtx = blake.blake2bInit(4)
  blake.blake2bUpdate(blakeCtx, payload)
  return Buffer.from(blake.blake2bFinal(blakeCtx))
}

/**
 * Looks for the end of a leb128 encoded number according to the algorithm specification.
 * For more information about leb128, please refer to this {@link https://en.wikipedia.org/wiki/LEB128|link}.
 * @param input - leb128 encoded data
 */
export function getLeb128Length(input: Buffer): number {
  let count = 0
  while (count < input.length) {
    const byte = input[count]
    count++
    if (byte < 128) break
  }
  if (count == input.length) return -1

  return count
}

/**
 * Validate is the given string is a valid filecoin network prefix type
 * @param networkPrefix - input string to validate
 * @returns whether the input is a valid network prefix or not
 */
export const validateNetworkPrefix = (networkPrefix: string): networkPrefix is NetworkPrefix =>
  Object.values(NetworkPrefix).includes(networkPrefix as NetworkPrefix)

/**
 * Validate is the given string is a valid filecoin network type
 * @param network - input string to validate
 * @returns whether the input is a valid network or not
 */
export const validateNetwork = (network: string): network is Network => Object.values(Network).includes(network as Network)

/**
 * Get network prefix from a given network
 * @param network - input string to validate
 * @returns network prefix
 */
export const getNetworkPrefix = (network: Network): NetworkPrefix => (network === Network.Mainnet ? NetworkPrefix.Mainnet : NetworkPrefix.Testnet)

/**
 * Check if a given network is testnet or not
 * @param network - input string to validate
 * @returns network prefix
 */
export const isTestnet = (network: Network): boolean => network !== Network.Mainnet
