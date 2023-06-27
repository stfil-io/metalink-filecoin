/// <reference types="node" />
import { Buffer } from 'buffer';
import { NetworkPrefix, ProtocolIndicator } from '../artifacts/address';
/**
 * Address is an abstract class that holds fundamental fields that a filecoin address is composed by.
 * Concrete class types will inherit from it, adding specific methods for each type. It will serve as a factory
 * for parsing addresses from string and bytes as well.
 */
export declare abstract class Address {
    protected networkPrefix: NetworkPrefix;
    protected protocol: ProtocolIndicator;
    /**
     *
     * @param networkPrefix - indicates which network the address belongs.
     * @param protocol - indicates the address types.
     */
    protected constructor(networkPrefix: NetworkPrefix, protocol: ProtocolIndicator);
    /**
     * Each address is composed by a payload
     * For more information about payloads, please refer to this {@link https://spec.filecoin.io/appendix/address/#section-appendix.address.payload|link}.
     */
    protected abstract payload: Buffer;
    /**
     * Getter for payload
     */
    getPayload: () => Buffer;
    /**
     * Getter for network type
     */
    getNetworkPrefix: () => NetworkPrefix;
    /**
     * Getter for protocol indicator
     */
    getProtocol: () => ProtocolIndicator;
    /**
     * Addresses need to implement a method to generate the bytes format of an address.
     * For more information about bytes format, please refer to this {@link https://spec.filecoin.io/appendix/address/#section-appendix.address.bytes|link}.
     * @returns address in bytes format (buffer)
     */
    abstract toBytes: () => Buffer;
    /**
     * Addresses need to implement a method to generate the string format of an address.
     * For more information about string format, please refer to this {@link https://spec.filecoin.io/appendix/address/#section-appendix.address.string|link}.
     * @returns address in string format
     */
    abstract toString: () => string;
    /**
     * Allows to generate the checksum related to the address.
     * For more information about string format, please refer to this {@link https://spec.filecoin.io/appendix/address/#section-appendix.address.checksum|link}.
     * @returns a buffer containing the calculated checksum
     */
    getChecksum: () => Buffer;
    /**
     * Allows to parse any address from string format to its corresponding type
     * @param address - address to parse in string format
     * @returns a new instance of a particular address type.
     */
    static fromString: (address: string) => Address;
    /**
     * Allows to parse any address from bytes format to its corresponding type
     * @param networkPrefix - indicates which network the address belongs, as the bytes format does not hold the network the address corresponds
     * @param address - address to parse in bytes format (buffer)
     * @returns a new instance of a particular address type.
     */
    static fromBytes: (networkPrefix: NetworkPrefix, address: Buffer) => Address;
    /**
     * Allows to create a new instance of an Address from an ethereum address.
     * It is based on {@link https://github.com/filecoin-project/lotus/blob/80aa6d1d646c9984761c77dcb7cf63be094b9407/chain/types/ethtypes/eth_types.go#L370|this code}
     * @param networkPrefix - indicates which network the address belongs, as the bytes format does not hold the network the address corresponds
     * @param ethAddr - ethereum address to parse (buffer or hex string, with or without prefix)
     * @returns a new instance of a particular address type.
     */
    static fromEthAddress: (networkPrefix: NetworkPrefix, ethAddr: Buffer | string) => AddressId | FilEthAddress;
    /**
     * Allows to check if true value of an address instance is AddressId
     * @param address - instance to check its actual type
     * @returns whether the instance is AddressId or not
     */
    static isAddressId: (address: Address) => address is AddressId;
    /**
     * Allows to check if true value of an address instance is AddressBls
     * @param address - instance to check its actual type
     * @returns whether the instance is AddressId or not
     */
    static isAddressBls: (address: Address) => address is AddressBls;
    /**
     * Allows to check if true value of an address instance is AddressSecp256k1
     * @param address - instance to check its actual type
     * @returns whether the instance is AddressSecp256k1 or not
     */
    static isAddressSecp256k1: (address: Address) => address is AddressSecp256k1;
    /**
     * Allows to check if true value of an address instance is AddressDelegated
     * @param address - instance to check its actual type
     * @returns whether the instance is AddressDelegated or not
     */
    static isAddressDelegated: (address: Address) => address is AddressDelegated;
    /**
     * Allows to check if true value of an address instance is FilEthAddress
     * @param address - instance to check its actual type
     * @returns whether the instance is FilEthAddress or not
     */
    static isFilEthAddress: (address: Address) => address is FilEthAddress;
    /**
     * Allows to check if true value of an address instance is AddressActor
     * @param address - instance to check its actual type
     * @returns whether the instance is AddressActor or not
     */
    static isAddressActor: (address: Address) => address is AddressActor;
}
/**
 * AddressBls is a concrete address type 3 on filecoin blockchain (f3/t3)
 * For more information about bls addresses, please refer to this {@link https://spec.filecoin.io/appendix/address/#section-appendix.address.protocol-3-bls|link}.
 */
export declare class AddressBls extends Address {
    /**
     * Contains BLS public key, base32 encoded
     * For more information about payloads, please refer to this {@link https://spec.filecoin.io/appendix/address/#section-appendix.address.payload|link}.
     */
    protected payload: Buffer;
    /**
     * Allows to create a new instance of bls address
     * @param networkPrefix - indicates which network the address belongs.
     * @param payload - current address payload (buffer)
     */
    constructor(networkPrefix: NetworkPrefix, payload: Buffer);
    /**
     * Allows to get the bytes format of this address
     * @returns bls address in bytes format
     */
    toBytes: () => Buffer;
    /**
     * Allows to get the string format of this address
     * @returns bls address in string format
     */
    toString: () => string;
    /**
     * Allows to create a new AddressBls instance from a string
     * @param address - address in string format
     * @returns a new instance of AddressBls
     */
    static fromString(address: string): AddressBls;
    /**
     * Allows to create a new AddressBls instance from bytes (buffer)
     * @param networkPrefix - indicates which network the address belongs, as the bytes format does not hold the network the address corresponds
     * @param bytes - address to parse in bytes format (buffer)
     * @returns a new instance of AddressBls
     */
    static fromBytes(networkPrefix: NetworkPrefix, bytes: Buffer): AddressBls;
}
/**
 * AddressId is a concrete address type 0 on filecoin blockchain (f0/t0)
 * For more information about bls addresses, please refer to this {@link https://spec.filecoin.io/appendix/address/#section-appendix.address.protocol-0-ids|link}.
 */
export declare class AddressId extends Address {
    /**
     * Contains the id in decimal
     */
    protected id: string;
    /**
     * Contains leb128 encoded id
     * For more information about payloads, please refer to this {@link https://spec.filecoin.io/appendix/address/#section-appendix.address.payload|link}.
     */
    protected payload: Buffer;
    /**
     * Allows to create a new instance of id address
     * @param networkPrefix - indicates which network the address belongs.
     * @param payload - current address payload. It can be string (id in decimal) or buffer (leb128 encoded id)
     */
    constructor(networkPrefix: NetworkPrefix, payload: string | Buffer);
    /**
     * Allows to get the bytes format of this address
     * @returns id address in bytes format
     */
    toBytes: () => Buffer;
    /**
     * Allows to get the string format of this address
     * @returns id address in string format
     */
    toString: () => string;
    /**
     * Getter for actor id
     */
    getId: () => string;
    /**
     * Allows to create a new AddressId instance from a string
     * @param address - address in string format
     * @returns a new instance of AddressId
     */
    static fromString(address: string): AddressId;
    /**
     * Allows to create a new AddressId instance from bytes (buffer)
     * @param networkPrefix - indicates which network the address belongs, as the bytes format does not hold the network the address corresponds
     * @param bytes - address to parse in bytes format (buffer)
     * @returns a new instance of AddressId
     */
    static fromBytes(networkPrefix: NetworkPrefix, bytes: Buffer): AddressId;
    /**
     * Allows to get an ethereum address that holds the actor id
     * @param hexPrefix - add the 0x prefix or not
     * @returns ethereum address
     */
    toEthAddressHex: (hexPrefix?: boolean) => string;
}
/**
 * AddressSecp256k1 is a concrete address type 1 on filecoin blockchain (f1/t1)
 * For more information about secp256k1 addresses, please refer to this {@link https://spec.filecoin.io/appendix/address/#section-appendix.address.protocol-1-libsecpk1-elliptic-curve-public-keys|link}.
 */
export declare class AddressSecp256k1 extends Address {
    /**
     * Contains the Blake2b 160 hash of the uncompressed public key (65 bytes).
     * For more information about payloads, please refer to this {@link https://spec.filecoin.io/appendix/address/#section-appendix.address.payload|link}.
     */
    protected payload: Buffer;
    /**
     * Allows to create a new instance of secp256k1 address
     * @param networkPrefix - indicates which network the address belongs.
     * @param payload - current address payload (buffer)
     */
    constructor(networkPrefix: NetworkPrefix, payload: Buffer);
    /**
     * Allows to get the bytes format of this address
     * @returns secp256k1 address in bytes format
     */
    toBytes: () => Buffer;
    /**
     * Allows to get the string format of this address
     * @returns secp256k1 address in string format
     */
    toString: () => string;
    /**
     * Allows to create a new AddressSecp256k1 instance from a string
     * @param address - address in string format
     * @returns a new instance of AddressSecp256k1
     */
    static fromString(address: string): AddressSecp256k1;
    /**
     * Allows to create a new AddressSecp256k1 instance from bytes (buffer)
     * @param networkPrefix - indicates which network the address belongs, as the bytes format does not hold the network the address corresponds
     * @param bytes - address to parse in bytes format (buffer)
     * @returns a new instance of AddressSecp256k1
     */
    static fromBytes(networkPrefix: NetworkPrefix, bytes: Buffer): AddressSecp256k1;
}
/**
 * AddressActor is a concrete address type 2 on filecoin blockchain (f2/t2)
 * For more information about actor addresses, please refer to this {@link https://spec.filecoin.io/appendix/address/#section-appendix.address.protocol-2-actor|link}.
 */
export declare class AddressActor extends Address {
    /**
     * Contains the SHA256 hash of meaningful data produced as a result of creating the actor
     * For more information about payloads, please refer to this {@link https://spec.filecoin.io/appendix/address/#section-appendix.address.payload|link}.
     */
    protected payload: Buffer;
    /**
     * Allows to create a new instance of actor address
     * @param networkPrefix - indicates which network the address belongs.
     * @param payload - current address payload (buffer)
     */
    constructor(networkPrefix: NetworkPrefix, payload: Buffer);
    /**
     * Allows to get the bytes format of this address
     * @returns actor address in bytes format
     */
    toBytes: () => Buffer;
    /**
     * Allows to get the string format of this address
     * @returns actor address in string format
     */
    toString: () => string;
    /**
     * Allows to create a new AddressActor instance from a string
     * @param address - address in string format
     * @returns a new instance of AddressActor
     */
    static fromString(address: string): AddressActor;
    /**
     * Allows to create a new AddressActor instance from bytes (buffer)
     * @param networkPrefix - indicates which network the address belongs, as the bytes format does not hold the network the address corresponds
     * @param bytes - address to parse in bytes format (buffer)
     * @returns a new instance of AddressActor
     */
    static fromBytes(networkPrefix: NetworkPrefix, bytes: Buffer): AddressActor;
}
/**
 * AddressDelegated is a concrete address type 4 on filecoin blockchain (f4/t4)
 * For more information about delegated addresses, please refer to this {@link https://docs.filecoin.io/developers/smart-contracts/concepts/accounts-and-assets/#extensible-user-defined-actor-addresses-f4|link}.
 * The filecoin improvement proposal (FIP) for this address type is {@link https://github.com/filecoin-project/FIPs/blob/master/FIPS/fip-0048.md|here}
 */
export declare class AddressDelegated extends Address {
    /**
     * Contains the address manager actor id (leb128 encoded) and the subaddress (plain)
     * For more information about payloads, please refer to this {@link https://github.com/filecoin-project/FIPs/blob/master/FIPS/fip-0048.md#the-f4-address-class|link}.
     */
    protected payload: Buffer;
    /**
     * Contains the address manager actor id (decimal)
     */
    protected namespace: string;
    /**
     * Contains the sub address (plain)
     */
    protected subAddress: Buffer;
    /**
     * Allows to create a new instance of delegated address
     * @param networkPrefix - indicates which network the address belongs.
     * @param namespace - account manager actor id
     * @param subAddress - user-defined address the account manager will know and administrate (buffer)
     */
    constructor(networkPrefix: NetworkPrefix, namespace: string, subAddress: Buffer);
    /**
     * Getter for namespace
     */
    getNamespace: () => string;
    /**
     * Getter for sub address
     */
    getSubAddress: () => Buffer;
    /**
     * Allows to get the bytes format of this address
     * @returns delegated address in bytes format
     */
    toBytes: () => Buffer;
    /**
     * Allows to get the string format of this address
     * @returns delegated address in string format
     */
    toString: () => string;
    /**
     * Allows to create a new AddressDelegated instance from a string
     * @param address - address in string format
     * @returns a new instance of AddressDelegated
     */
    static fromString(address: string): AddressDelegated;
    /**
     * Allows to create a new AddressDelegated instance from bytes (buffer)
     * @param networkPrefix - indicates which network the address belongs, as the bytes format does not hold the network the address corresponds
     * @param bytes - address to parse in bytes format (buffer)
     * @returns a new instance of AddressDelegated
     */
    static fromBytes(networkPrefix: NetworkPrefix, bytes: Buffer): AddressDelegated;
}
/**
 * EthereumAddress is a concrete implementation for the ethereum addresses in the filecoin blockchain.
 * For more information about ethereum addresses, please refer to this {@link https://docs.filecoin.io/intro/intro-to-filecoin/blockchain/#addresses|link}.
 */
export declare class FilEthAddress extends AddressDelegated {
    /**
     * Allows to create a new instance of EthereumAddress
     * @param networkPrefix - indicates which network the address belongs.
     * @param ethAddress - valid ethereum address to wrap (as buffer)
     */
    constructor(networkPrefix: NetworkPrefix, ethAddress: Buffer);
    /**
     * Allows to create a new EthereumAddress instance from filecoin address in bytes format (buffer)
     * @example networkPrefix: 'f' - bytesFilAddress: 040a23a7f3c5c663d71151f40c8610c01150c9660795
     * @param networkPrefix - indicates which network the address belongs, as the bytes format does not hold the network the address corresponds
     * @param bytesFilAddress - address to parse in bytes format (buffer)
     * @returns a new instance of EthereumAddress
     */
    static fromBytes(networkPrefix: NetworkPrefix, bytesFilAddress: Buffer): FilEthAddress;
    /**
     * Allows to create a new EthereumAddress instance from filecoin address in string format
     * @param strFilAddress - address to parse in string format (buffer)
     * @example strFilAddress: f410feot7hrogmplrcupubsdbbqarkdewmb4vkwc5qqq
     * @returns a new instance of EthereumAddress
     */
    static fromString(strFilAddress: string): FilEthAddress;
    /**
     * Allows to get the ethereum address in hex format of this address
     * @param hexPrefix - add the 0x prefix or not
     * @returns ethereum address in hex string format
     */
    toEthAddressHex: (hexPrefix?: boolean) => string;
}
