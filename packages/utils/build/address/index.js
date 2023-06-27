"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilEthAddress = exports.AddressDelegated = exports.AddressActor = exports.AddressSecp256k1 = exports.AddressId = exports.AddressBls = exports.Address = void 0;
const base32_decode_1 = __importDefault(require("base32-decode"));
const leb128_1 = __importDefault(require("leb128"));
const bn_js_1 = __importDefault(require("bn.js"));
const buffer_1 = require("buffer");
const base32_1 = require("../utils/base32");
const address_1 = require("../artifacts/address");
const errors_1 = require("./errors");
const utils_1 = require("./utils");
/**
 * Address is an abstract class that holds fundamental fields that a filecoin address is composed by.
 * Concrete class types will inherit from it, adding specific methods for each type. It will serve as a factory
 * for parsing addresses from string and bytes as well.
 */
class Address {
    /**
     *
     * @param networkPrefix - indicates which network the address belongs.
     * @param protocol - indicates the address types.
     */
    constructor(networkPrefix, protocol) {
        this.networkPrefix = networkPrefix;
        this.protocol = protocol;
        /**
         * Getter for payload
         */
        this.getPayload = () => this.payload;
        /**
         * Getter for network type
         */
        this.getNetworkPrefix = () => this.networkPrefix;
        /**
         * Getter for protocol indicator
         */
        this.getProtocol = () => this.protocol;
        /**
         * Allows to generate the checksum related to the address.
         * For more information about string format, please refer to this {@link https://spec.filecoin.io/appendix/address/#section-appendix.address.checksum|link}.
         * @returns a buffer containing the calculated checksum
         */
        this.getChecksum = () => (0, utils_1.getChecksum)(this.toBytes());
    }
}
exports.Address = Address;
/**
 * Allows to parse any address from string format to its corresponding type
 * @param address - address to parse in string format
 * @returns a new instance of a particular address type.
 */
Address.fromString = (address) => {
    const type = parseInt(address[1]);
    switch (type) {
        case address_1.ProtocolIndicator.ID:
            return AddressId.fromString(address);
        case address_1.ProtocolIndicator.ACTOR:
            return AddressActor.fromString(address);
        case address_1.ProtocolIndicator.SECP256K1:
            return AddressSecp256k1.fromString(address);
        case address_1.ProtocolIndicator.BLS:
            return AddressBls.fromString(address);
        case address_1.ProtocolIndicator.DELEGATED: {
            const addr = AddressDelegated.fromString(address);
            if (Address.isFilEthAddress(addr))
                return new FilEthAddress(addr.getNetworkPrefix(), addr.getSubAddress());
            return addr;
        }
        default:
            throw new errors_1.UnknownProtocolIndicator();
    }
};
/**
 * Allows to parse any address from bytes format to its corresponding type
 * @param networkPrefix - indicates which network the address belongs, as the bytes format does not hold the network the address corresponds
 * @param address - address to parse in bytes format (buffer)
 * @returns a new instance of a particular address type.
 */
Address.fromBytes = (networkPrefix, address) => {
    const type = address[0];
    switch (type) {
        case address_1.ProtocolIndicator.ID:
            return AddressId.fromBytes(networkPrefix, address);
        case address_1.ProtocolIndicator.ACTOR:
            return AddressActor.fromBytes(networkPrefix, address);
        case address_1.ProtocolIndicator.SECP256K1:
            return AddressSecp256k1.fromBytes(networkPrefix, address);
        case address_1.ProtocolIndicator.BLS:
            return AddressBls.fromBytes(networkPrefix, address);
        case address_1.ProtocolIndicator.DELEGATED: {
            const addr = AddressDelegated.fromBytes(networkPrefix, address);
            if (Address.isFilEthAddress(addr))
                return new FilEthAddress(addr.getNetworkPrefix(), addr.getSubAddress());
            return addr;
        }
        default:
            throw new errors_1.UnknownProtocolIndicator();
    }
};
/**
 * Allows to create a new instance of an Address from an ethereum address.
 * It is based on {@link https://github.com/filecoin-project/lotus/blob/80aa6d1d646c9984761c77dcb7cf63be094b9407/chain/types/ethtypes/eth_types.go#L370|this code}
 * @param networkPrefix - indicates which network the address belongs, as the bytes format does not hold the network the address corresponds
 * @param ethAddr - ethereum address to parse (buffer or hex string, with or without prefix)
 * @returns a new instance of a particular address type.
 */
Address.fromEthAddress = (networkPrefix, ethAddr) => {
    if (typeof ethAddr === 'string') {
        const tmp = ethAddr.startsWith('0x') ? ethAddr.substring(2) : ethAddr;
        ethAddr = buffer_1.Buffer.from(tmp, 'hex');
    }
    const idMask = buffer_1.Buffer.alloc(12);
    idMask[0] = address_1.ACTOR_ID_ETHEREUM_MASK;
    if (idMask.compare(ethAddr, 0, 12) == 0) {
        let i = 12;
        while (ethAddr[i] == 0)
            i += 1;
        return new AddressId(networkPrefix, ethAddr.subarray(i));
    }
    return new FilEthAddress(networkPrefix, ethAddr);
};
/**
 * Allows to check if true value of an address instance is AddressId
 * @param address - instance to check its actual type
 * @returns whether the instance is AddressId or not
 */
Address.isAddressId = (address) => address.protocol == address_1.ProtocolIndicator.ID;
/**
 * Allows to check if true value of an address instance is AddressBls
 * @param address - instance to check its actual type
 * @returns whether the instance is AddressId or not
 */
Address.isAddressBls = (address) => address.protocol == address_1.ProtocolIndicator.BLS;
/**
 * Allows to check if true value of an address instance is AddressSecp256k1
 * @param address - instance to check its actual type
 * @returns whether the instance is AddressSecp256k1 or not
 */
Address.isAddressSecp256k1 = (address) => address.protocol == address_1.ProtocolIndicator.SECP256K1;
/**
 * Allows to check if true value of an address instance is AddressDelegated
 * @param address - instance to check its actual type
 * @returns whether the instance is AddressDelegated or not
 */
Address.isAddressDelegated = (address) => address.protocol == address_1.ProtocolIndicator.DELEGATED;
/**
 * Allows to check if true value of an address instance is FilEthAddress
 * @param address - instance to check its actual type
 * @returns whether the instance is FilEthAddress or not
 */
Address.isFilEthAddress = (address) => address.protocol == address_1.ProtocolIndicator.DELEGATED && 'namespace' in address && address.namespace == address_1.DelegatedNamespace.ETH;
/**
 * Allows to check if true value of an address instance is AddressActor
 * @param address - instance to check its actual type
 * @returns whether the instance is AddressActor or not
 */
Address.isAddressActor = (address) => address.protocol == address_1.ProtocolIndicator.ACTOR;
/**
 * AddressBls is a concrete address type 3 on filecoin blockchain (f3/t3)
 * For more information about bls addresses, please refer to this {@link https://spec.filecoin.io/appendix/address/#section-appendix.address.protocol-3-bls|link}.
 */
class AddressBls extends Address {
    /**
     * Allows to create a new instance of bls address
     * @param networkPrefix - indicates which network the address belongs.
     * @param payload - current address payload (buffer)
     */
    constructor(networkPrefix, payload) {
        super(networkPrefix, address_1.ProtocolIndicator.BLS);
        /**
         * Allows to get the bytes format of this address
         * @returns bls address in bytes format
         */
        this.toBytes = () => buffer_1.Buffer.concat([buffer_1.Buffer.from(`0${this.protocol}`, 'hex'), this.payload]);
        /**
         * Allows to get the string format of this address
         * @returns bls address in string format
         */
        this.toString = () => {
            const checksum = this.getChecksum();
            return (this.networkPrefix +
                this.protocol.toString() +
                (0, base32_1.encode)(buffer_1.Buffer.concat([this.payload, checksum]), 'RFC4648', {
                    padding: false,
                }).toLowerCase());
        };
        if (payload.byteLength !== address_1.BLS_PAYLOAD_LEN)
            throw new errors_1.InvalidPayloadLength();
        this.payload = payload;
    }
    /**
     * Allows to create a new AddressBls instance from a string
     * @param address - address in string format
     * @returns a new instance of AddressBls
     */
    static fromString(address) {
        const networkPrefix = address[0];
        const protocolIndicator = address[1];
        if (!(0, utils_1.validateNetworkPrefix)(networkPrefix))
            throw new errors_1.InvalidNetwork();
        if (parseInt(protocolIndicator) != address_1.ProtocolIndicator.BLS)
            throw new errors_1.InvalidProtocolIndicator();
        const decodedData = buffer_1.Buffer.from((0, base32_decode_1.default)(address.substring(2).toUpperCase(), 'RFC4648'));
        const payload = decodedData.subarray(0, -4);
        const checksum = decodedData.subarray(-4);
        const newAddress = new AddressBls(networkPrefix, payload);
        if (newAddress.getChecksum().toString('hex') !== checksum.toString('hex'))
            throw new errors_1.InvalidChecksumAddress();
        return newAddress;
    }
    /**
     * Allows to create a new AddressBls instance from bytes (buffer)
     * @param networkPrefix - indicates which network the address belongs, as the bytes format does not hold the network the address corresponds
     * @param bytes - address to parse in bytes format (buffer)
     * @returns a new instance of AddressBls
     */
    static fromBytes(networkPrefix, bytes) {
        if (bytes[0] != address_1.ProtocolIndicator.BLS)
            throw new errors_1.InvalidProtocolIndicator();
        const payload = buffer_1.Buffer.from(bytes.subarray(1));
        return new AddressBls(networkPrefix, payload);
    }
}
exports.AddressBls = AddressBls;
/**
 * AddressId is a concrete address type 0 on filecoin blockchain (f0/t0)
 * For more information about bls addresses, please refer to this {@link https://spec.filecoin.io/appendix/address/#section-appendix.address.protocol-0-ids|link}.
 */
class AddressId extends Address {
    /**
     * Allows to create a new instance of id address
     * @param networkPrefix - indicates which network the address belongs.
     * @param payload - current address payload. It can be string (id in decimal) or buffer (leb128 encoded id)
     */
    constructor(networkPrefix, payload) {
        super(networkPrefix, address_1.ProtocolIndicator.ID);
        /**
         * Allows to get the bytes format of this address
         * @returns id address in bytes format
         */
        this.toBytes = () => buffer_1.Buffer.concat([buffer_1.Buffer.from(`0${this.protocol}`, 'hex'), this.payload]);
        /**
         * Allows to get the string format of this address
         * @returns id address in string format
         */
        this.toString = () => this.networkPrefix + this.protocol.toString() + leb128_1.default.unsigned.decode(this.payload);
        /**
         * Getter for actor id
         */
        this.getId = () => this.id;
        /**
         * Allows to get an ethereum address that holds the actor id
         * @param hexPrefix - add the 0x prefix or not
         * @returns ethereum address
         */
        this.toEthAddressHex = (hexPrefix = false) => {
            const buf = buffer_1.Buffer.alloc(address_1.ETH_ADDRESS_LEN);
            buf[0] = address_1.ACTOR_ID_ETHEREUM_MASK;
            buf.set(this.payload, address_1.ETH_ADDRESS_LEN - this.payload.length);
            return `${hexPrefix ? '0x' : ''}${buf.toString('hex')}`;
        };
        const payloadBuff = typeof payload === 'string' ? leb128_1.default.unsigned.encode(payload) : payload;
        if (payloadBuff.length > address_1.ID_PAYLOAD_MAX_LEN)
            throw new errors_1.InvalidPayloadLength();
        this.payload = payloadBuff;
        this.id = this.toString().substring(2);
    }
    /**
     * Allows to create a new AddressId instance from a string
     * @param address - address in string format
     * @returns a new instance of AddressId
     */
    static fromString(address) {
        const networkPrefix = address[0];
        const protocolIndicator = address[1];
        if (!(0, utils_1.validateNetworkPrefix)(networkPrefix))
            throw new errors_1.InvalidNetwork();
        if (parseInt(protocolIndicator) != address_1.ProtocolIndicator.ID)
            throw new errors_1.InvalidProtocolIndicator();
        const payload = leb128_1.default.unsigned.encode(address.substring(2));
        return new AddressId(networkPrefix, payload);
    }
    /**
     * Allows to create a new AddressId instance from bytes (buffer)
     * @param networkPrefix - indicates which network the address belongs, as the bytes format does not hold the network the address corresponds
     * @param bytes - address to parse in bytes format (buffer)
     * @returns a new instance of AddressId
     */
    static fromBytes(networkPrefix, bytes) {
        if (bytes[0] != address_1.ProtocolIndicator.ID)
            throw new errors_1.InvalidProtocolIndicator();
        const payload = bytes.subarray(1);
        return new AddressId(networkPrefix, payload);
    }
}
exports.AddressId = AddressId;
/**
 * AddressSecp256k1 is a concrete address type 1 on filecoin blockchain (f1/t1)
 * For more information about secp256k1 addresses, please refer to this {@link https://spec.filecoin.io/appendix/address/#section-appendix.address.protocol-1-libsecpk1-elliptic-curve-public-keys|link}.
 */
class AddressSecp256k1 extends Address {
    /**
     * Allows to create a new instance of secp256k1 address
     * @param networkPrefix - indicates which network the address belongs.
     * @param payload - current address payload (buffer)
     */
    constructor(networkPrefix, payload) {
        super(networkPrefix, address_1.ProtocolIndicator.SECP256K1);
        /**
         * Allows to get the bytes format of this address
         * @returns secp256k1 address in bytes format
         */
        this.toBytes = () => buffer_1.Buffer.concat([buffer_1.Buffer.from(`0${this.protocol}`, 'hex'), this.payload]);
        /**
         * Allows to get the string format of this address
         * @returns secp256k1 address in string format
         */
        this.toString = () => {
            const checksum = this.getChecksum();
            return (this.networkPrefix +
                this.protocol.toString() +
                (0, base32_1.encode)(buffer_1.Buffer.concat([this.payload, checksum]), 'RFC4648', {
                    padding: false,
                }).toLowerCase());
        };
        if (payload.byteLength !== address_1.SECP256K1_PAYLOAD_LEN)
            throw new errors_1.InvalidPayloadLength();
        this.payload = payload;
    }
    /**
     * Allows to create a new AddressSecp256k1 instance from a string
     * @param address - address in string format
     * @returns a new instance of AddressSecp256k1
     */
    static fromString(address) {
        const networkPrefix = address[0];
        const protocolIndicator = address[1];
        if (!(0, utils_1.validateNetworkPrefix)(networkPrefix))
            throw new errors_1.InvalidNetwork();
        if (parseInt(protocolIndicator) != address_1.ProtocolIndicator.SECP256K1)
            throw new errors_1.InvalidProtocolIndicator();
        const decodedData = buffer_1.Buffer.from((0, base32_decode_1.default)(address.substring(2).toUpperCase(), 'RFC4648'));
        const payload = decodedData.subarray(0, -4);
        const checksum = decodedData.subarray(-4);
        const newAddress = new AddressSecp256k1(networkPrefix, payload);
        if (newAddress.getChecksum().toString('hex') !== checksum.toString('hex'))
            throw new errors_1.InvalidChecksumAddress();
        return newAddress;
    }
    /**
     * Allows to create a new AddressSecp256k1 instance from bytes (buffer)
     * @param networkPrefix - indicates which network the address belongs, as the bytes format does not hold the network the address corresponds
     * @param bytes - address to parse in bytes format (buffer)
     * @returns a new instance of AddressSecp256k1
     */
    static fromBytes(networkPrefix, bytes) {
        if (bytes[0] != address_1.ProtocolIndicator.SECP256K1)
            throw new errors_1.InvalidProtocolIndicator();
        const payload = buffer_1.Buffer.from(bytes.subarray(1));
        return new AddressSecp256k1(networkPrefix, payload);
    }
}
exports.AddressSecp256k1 = AddressSecp256k1;
/**
 * AddressActor is a concrete address type 2 on filecoin blockchain (f2/t2)
 * For more information about actor addresses, please refer to this {@link https://spec.filecoin.io/appendix/address/#section-appendix.address.protocol-2-actor|link}.
 */
class AddressActor extends Address {
    /**
     * Allows to create a new instance of actor address
     * @param networkPrefix - indicates which network the address belongs.
     * @param payload - current address payload (buffer)
     */
    constructor(networkPrefix, payload) {
        super(networkPrefix, address_1.ProtocolIndicator.ACTOR);
        /**
         * Allows to get the bytes format of this address
         * @returns actor address in bytes format
         */
        this.toBytes = () => buffer_1.Buffer.concat([buffer_1.Buffer.from(`0${this.protocol}`, 'hex'), this.payload]);
        /**
         * Allows to get the string format of this address
         * @returns actor address in string format
         */
        this.toString = () => {
            const checksum = this.getChecksum();
            return (this.networkPrefix +
                this.protocol.toString() +
                (0, base32_1.encode)(buffer_1.Buffer.concat([this.payload, checksum]), 'RFC4648', {
                    padding: false,
                }).toLowerCase());
        };
        if (payload.byteLength !== address_1.ACTOR_PAYLOAD_LEN)
            throw new errors_1.InvalidPayloadLength();
        this.payload = payload;
    }
    /**
     * Allows to create a new AddressActor instance from a string
     * @param address - address in string format
     * @returns a new instance of AddressActor
     */
    static fromString(address) {
        const networkPrefix = address[0];
        const protocolIndicator = address[1];
        if (!(0, utils_1.validateNetworkPrefix)(networkPrefix))
            throw new errors_1.InvalidNetwork();
        if (parseInt(protocolIndicator) != address_1.ProtocolIndicator.ACTOR)
            throw new errors_1.InvalidProtocolIndicator();
        const decodedData = buffer_1.Buffer.from((0, base32_decode_1.default)(address.substring(2).toUpperCase(), 'RFC4648'));
        const payload = decodedData.subarray(0, -4);
        const checksum = decodedData.subarray(-4);
        const newAddress = new AddressActor(networkPrefix, payload);
        if (newAddress.getChecksum().toString('hex') !== checksum.toString('hex'))
            throw new errors_1.InvalidChecksumAddress();
        return newAddress;
    }
    /**
     * Allows to create a new AddressActor instance from bytes (buffer)
     * @param networkPrefix - indicates which network the address belongs, as the bytes format does not hold the network the address corresponds
     * @param bytes - address to parse in bytes format (buffer)
     * @returns a new instance of AddressActor
     */
    static fromBytes(networkPrefix, bytes) {
        if (bytes[0] != address_1.ProtocolIndicator.ACTOR)
            throw new errors_1.InvalidProtocolIndicator();
        const payload = buffer_1.Buffer.from(bytes.subarray(1));
        return new AddressActor(networkPrefix, payload);
    }
}
exports.AddressActor = AddressActor;
/**
 * AddressDelegated is a concrete address type 4 on filecoin blockchain (f4/t4)
 * For more information about delegated addresses, please refer to this {@link https://docs.filecoin.io/developers/smart-contracts/concepts/accounts-and-assets/#extensible-user-defined-actor-addresses-f4|link}.
 * The filecoin improvement proposal (FIP) for this address type is {@link https://github.com/filecoin-project/FIPs/blob/master/FIPS/fip-0048.md|here}
 */
class AddressDelegated extends Address {
    /**
     * Allows to create a new instance of delegated address
     * @param networkPrefix - indicates which network the address belongs.
     * @param namespace - account manager actor id
     * @param subAddress - user-defined address the account manager will know and administrate (buffer)
     */
    constructor(networkPrefix, namespace, subAddress) {
        super(networkPrefix, address_1.ProtocolIndicator.DELEGATED);
        /**
         * Getter for namespace
         */
        this.getNamespace = () => this.namespace;
        /**
         * Getter for sub address
         */
        this.getSubAddress = () => this.subAddress;
        /**
         * Allows to get the bytes format of this address
         * @returns delegated address in bytes format
         */
        this.toBytes = () => {
            const namespaceBytes = buffer_1.Buffer.from(leb128_1.default.unsigned.encode(this.namespace));
            const protocolBytes = buffer_1.Buffer.from(leb128_1.default.unsigned.encode(this.protocol));
            return buffer_1.Buffer.concat([protocolBytes, namespaceBytes, this.subAddress]);
        };
        /**
         * Allows to get the string format of this address
         * @returns delegated address in string format
         */
        this.toString = () => {
            const checksum = this.getChecksum();
            return (this.networkPrefix +
                this.protocol.toString() +
                this.namespace +
                'f' +
                (0, base32_1.encode)(buffer_1.Buffer.concat([this.subAddress, checksum]), 'RFC4648', {
                    padding: false,
                }).toLowerCase());
        };
        if (new bn_js_1.default(namespace).gt(address_1.ID_PAYLOAD_MAX_NUM))
            throw new errors_1.InvalidNamespace();
        if (subAddress.length === 0 || subAddress.length > address_1.SUB_ADDRESS_MAX_LEN)
            throw new errors_1.InvalidSubAddress();
        this.namespace = namespace;
        this.subAddress = subAddress;
        this.payload = this.toBytes().subarray(1);
    }
    /**
     * Allows to create a new AddressDelegated instance from a string
     * @param address - address in string format
     * @returns a new instance of AddressDelegated
     */
    static fromString(address) {
        const networkPrefix = address[0];
        const protocolIndicator = address[1];
        if (!(0, utils_1.validateNetworkPrefix)(networkPrefix))
            throw new errors_1.InvalidNetwork();
        if (parseInt(protocolIndicator) != address_1.ProtocolIndicator.DELEGATED)
            throw new errors_1.InvalidProtocolIndicator();
        const namespace = address.substring(2, address.indexOf('f', 2));
        const dataEncoded = address.substring(address.indexOf('f', 2) + 1);
        const dataDecoded = buffer_1.Buffer.from((0, base32_decode_1.default)(dataEncoded.toUpperCase(), 'RFC4648'));
        const subAddress = buffer_1.Buffer.from(dataDecoded.subarray(0, -4));
        const checksum = buffer_1.Buffer.from(dataDecoded.subarray(-4));
        const newAddress = new AddressDelegated(networkPrefix, namespace, subAddress);
        if (newAddress.getChecksum().toString('hex') !== checksum.toString('hex'))
            throw new errors_1.InvalidChecksumAddress();
        return newAddress;
    }
    /**
     * Allows to create a new AddressDelegated instance from bytes (buffer)
     * @param networkPrefix - indicates which network the address belongs, as the bytes format does not hold the network the address corresponds
     * @param bytes - address to parse in bytes format (buffer)
     * @returns a new instance of AddressDelegated
     */
    static fromBytes(networkPrefix, bytes) {
        if (bytes[0] != address_1.ProtocolIndicator.DELEGATED)
            throw new errors_1.InvalidProtocolIndicator();
        const namespaceLength = (0, utils_1.getLeb128Length)(bytes.subarray(1));
        const namespace = leb128_1.default.unsigned.decode(bytes.subarray(1, 1 + namespaceLength));
        const subAddress = bytes.subarray(namespaceLength + 1);
        return new AddressDelegated(networkPrefix, namespace, subAddress);
    }
}
exports.AddressDelegated = AddressDelegated;
/**
 * EthereumAddress is a concrete implementation for the ethereum addresses in the filecoin blockchain.
 * For more information about ethereum addresses, please refer to this {@link https://docs.filecoin.io/intro/intro-to-filecoin/blockchain/#addresses|link}.
 */
class FilEthAddress extends AddressDelegated {
    /**
     * Allows to create a new instance of EthereumAddress
     * @param networkPrefix - indicates which network the address belongs.
     * @param ethAddress - valid ethereum address to wrap (as buffer)
     */
    constructor(networkPrefix, ethAddress) {
        super(networkPrefix, address_1.DelegatedNamespace.ETH, ethAddress);
        /**
         * Allows to get the ethereum address in hex format of this address
         * @param hexPrefix - add the 0x prefix or not
         * @returns ethereum address in hex string format
         */
        this.toEthAddressHex = (hexPrefix = false) => `${hexPrefix ? '0x' : ''}${this.subAddress.toString('hex')}`;
        if (ethAddress.length !== address_1.ETH_ADDRESS_LEN)
            throw new Error('invalid ethereum address: length should be 32 bytes');
    }
    /**
     * Allows to create a new EthereumAddress instance from filecoin address in bytes format (buffer)
     * @example networkPrefix: 'f' - bytesFilAddress: 040a23a7f3c5c663d71151f40c8610c01150c9660795
     * @param networkPrefix - indicates which network the address belongs, as the bytes format does not hold the network the address corresponds
     * @param bytesFilAddress - address to parse in bytes format (buffer)
     * @returns a new instance of EthereumAddress
     */
    static fromBytes(networkPrefix, bytesFilAddress) {
        const addr = AddressDelegated.fromBytes(networkPrefix, bytesFilAddress);
        if (addr.getNamespace() !== address_1.DelegatedNamespace.ETH)
            throw new Error('invalid filecoin address for ethereum space');
        return new FilEthAddress(addr.getNetworkPrefix(), addr.getSubAddress());
    }
    /**
     * Allows to create a new EthereumAddress instance from filecoin address in string format
     * @param strFilAddress - address to parse in string format (buffer)
     * @example strFilAddress: f410feot7hrogmplrcupubsdbbqarkdewmb4vkwc5qqq
     * @returns a new instance of EthereumAddress
     */
    static fromString(strFilAddress) {
        const addr = AddressDelegated.fromString(strFilAddress);
        if (addr.getNamespace() !== address_1.DelegatedNamespace.ETH)
            throw new Error('invalid filecoin address for ethereum space');
        return new FilEthAddress(addr.getNetworkPrefix(), addr.getSubAddress());
    }
}
exports.FilEthAddress = FilEthAddress;
//# sourceMappingURL=index.js.map