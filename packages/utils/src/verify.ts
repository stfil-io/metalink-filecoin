import secp256k1 from 'secp256k1'

import { Message } from "@stfil/metalink-filecoin-types";
import { Transaction } from "./transaction";
import { Signature } from "./wallet";
import { getDigest, getPayloadSECP256K1 } from "./wallet/utils";
import { SignatureType } from "./artifacts/wallet";
import { NetworkPrefix } from './artifacts/address';
import { AddressSecp256k1 } from './address';
import { Buffer } from 'buffer'


export async function verifyMessage(message: Message | string, signature: string, networkPrefix?: NetworkPrefix): Promise<string> {
    if (typeof message === 'object') {
        const tx = Transaction.fromJSON({
            To: message.to,
            From: message.from,
            Value: message.value,
            Params: message.params,
            GasFeeCap: message.gasfeecap,
            GasPremium: message.gaspremium,
            GasLimit: message.gaslimit,
            Nonce: message.nonce,
            Method: message.method,
        });
        const serializedTx = await tx.serialize()
        const txDigest = getDigest(serializedTx)

        const sign = Signature.fromJSON({Type: SignatureType.SECP256K1, Data: signature})
        const sigDat = sign.getData()
        const uncompressedPublicKey = secp256k1.ecdsaRecover(sigDat.subarray(0, -1), sigDat[64], txDigest, false)
        const payload = getPayloadSECP256K1(uncompressedPublicKey)
        return (new AddressSecp256k1(networkPrefix ? networkPrefix : NetworkPrefix.Mainnet, payload)).toString()
    } 
    const messageBuf = Buffer.from(message, 'hex')
    let signatureBuf: Buffer
    if (typeof signature === 'string') {
        // We should have a padding!
        if (signature.slice(-1) === '=') {
            signatureBuf = Buffer.from(signature, 'base64')
        } else {
            signatureBuf = Buffer.from(signature, 'hex')
        }
    } else {
        signatureBuf = signature
    }
    const messageDigest = getDigest(messageBuf)
    const uncompressedPublicKey = secp256k1.ecdsaRecover(signatureBuf.subarray(0, -1), signatureBuf[64], messageDigest, false)
    const payload = getPayloadSECP256K1(uncompressedPublicKey)
    return (new AddressSecp256k1(networkPrefix ? networkPrefix : NetworkPrefix.Mainnet, payload)).toString()
  }