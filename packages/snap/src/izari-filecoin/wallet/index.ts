import secp256k1 from 'secp256k1'

import { getDigest, getPayloadSECP256K1, isSignatureType, tryToPrivateKeyBuffer } from './utils'
import { Transaction } from '../transaction/index.js'
import { AccountData, SignatureJSON, SignatureType } from '../artifacts/wallet'
import { NetworkPrefix } from '../artifacts/address'
import { AddressSecp256k1 } from '../address'

export class Wallet {

  /**
   * Try to recover account related data from raw private key
   * @param networkPrefix - network type this account belongs
   * @param type - which type of account must be derived
   * @param privateKey - private key raw data to recover account from
   * @param path - derivation path
   */
  static recoverAccount(networkPrefix: NetworkPrefix, type: SignatureType, privateKey: string | Buffer, path?: string): AccountData {
    switch (type) {
      case SignatureType.SECP256K1: {
        privateKey = tryToPrivateKeyBuffer(privateKey)
        const { publicKey, address } = Wallet.getPublicSecp256k1FromPrivKey(networkPrefix, privateKey)

        return {
          type,
          privateKey,
          address,
          publicKey,
          path,
        }
      }

      default:
        throw new Error('not supported yet')
    }
  }
  
  /**
   * Sign a transaction using account the private key
   * @param accountData - account data generated from deriving a new account
   * @param tx - transaction to sign
   * @returns generated signature
   */
  static signTransaction = async (accountData: Pick<AccountData, 'privateKey' | 'type'>, tx: Transaction): Promise<Signature> => {
    const serializedTx = await tx.serialize()
    const txDigest = getDigest(serializedTx)
    const { privateKey, type } = accountData

    switch (type) {
      case SignatureType.SECP256K1: {
        const signature = secp256k1.ecdsaSign(txDigest, privateKey)

        return new Signature(type, Buffer.concat([Buffer.from(signature.signature), Buffer.from([signature.recid])]))
      }

      default:
        throw new Error('not supported yet')
    }
  }

  /**
   * Generate the public key based on an account private key
   * @param networkPrefix - network type this account belongs
   * @param privateKey - private key raw data to recover account from
   * @returns generated public key and new AddressSecp256k1 instance
   */
  protected static getPublicSecp256k1FromPrivKey = (
    networkPrefix: NetworkPrefix,
    privateKey: Buffer
  ): {
    publicKey: Buffer
    address: AddressSecp256k1
  } => {
    const pubKey = secp256k1.publicKeyCreate(privateKey)

    const uncompressedPublicKey = new Uint8Array(65)
    secp256k1.publicKeyConvert(pubKey, false, uncompressedPublicKey)
    const uncompressedPublicKeyBuf = Buffer.from(uncompressedPublicKey)

    const payload = getPayloadSECP256K1(uncompressedPublicKey)

    return {
      publicKey: uncompressedPublicKeyBuf,
      address: new AddressSecp256k1(networkPrefix, payload),
    }
  }
}

/**
 * Contains the data related to a transaction signature
 */
export class Signature {
  /**
   * Creates a new Signature instance based on a type and payload
   * @param type - signature type
   * @param data - signature payload
   */
  constructor(protected type: SignatureType, protected data: Buffer) {}

  /**
   * Create a new Signature instance from a raw JSON object
   * @param input - raw JSON input
   * @returns new Signature instance
   */
  static fromJSON = (input: unknown): Signature => {
    if (typeof input !== 'object' || input === null) throw new Error('input should be an object')
    if (!('Type' in input) || typeof input.Type !== 'number') throw new Error("'Type' should be a number")
    if (!isSignatureType(input.Type)) throw new Error('invalid signature type')
    if (!('Data' in input) || typeof input.Data !== 'string') throw new Error("'Data' should be a base64 encoded string")

    return new Signature(input.Type, Buffer.from(input.Data, 'base64'))
  }

  /**
   * Export a JSON object containing signature type and data (base64)
   * @returns signature JSON object
   */
  toJSON = (): SignatureJSON => ({ Type: this.type, Data: this.data.toString('base64') })

  /**
   * Getter to signature type
   */
  getType = (): SignatureType => this.type

  /**
   * Getter to signature payload
   */
  getData = (): Buffer => this.data

  /**
   * Whether the signature type is SECP256K1 or not
   */
  isSecp256k1 = (): boolean => this.type === SignatureType.SECP256K1

  /**
   * Whether the signature type is BLS or not
   */
  isBls = (): boolean => this.type === SignatureType.BLS
}
