"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidPrivateKeyFormat = exports.InvalidChecksumAddress = exports.ProtocolNotSupported = exports.InvalidSubAddress = exports.InvalidNetwork = exports.InvalidNamespace = exports.InvalidPayloadLength = exports.UnknownProtocolIndicator = exports.InvalidProtocolIndicator = void 0;
class InvalidProtocolIndicator extends Error {
    constructor() {
        super();
        this.message = 'Invalid protocol indicator byte.';
    }
}
exports.InvalidProtocolIndicator = InvalidProtocolIndicator;
class UnknownProtocolIndicator extends Error {
    constructor() {
        super();
        this.message = 'Unknown protocol indicator byte.';
    }
}
exports.UnknownProtocolIndicator = UnknownProtocolIndicator;
class InvalidPayloadLength extends Error {
    constructor() {
        super();
        this.message = 'Invalid payload length.';
    }
}
exports.InvalidPayloadLength = InvalidPayloadLength;
class InvalidNamespace extends Error {
    constructor() {
        super();
        this.message = 'Invalid namespace.';
    }
}
exports.InvalidNamespace = InvalidNamespace;
class InvalidNetwork extends Error {
    constructor() {
        super();
        this.message = 'Invalid network';
    }
}
exports.InvalidNetwork = InvalidNetwork;
class InvalidSubAddress extends Error {
    constructor() {
        super();
        this.message = 'Invalid subAddress.';
    }
}
exports.InvalidSubAddress = InvalidSubAddress;
class ProtocolNotSupported extends Error {
    constructor(protocolName) {
        super();
        this.message = `${protocolName} protocol not supported.`;
    }
}
exports.ProtocolNotSupported = ProtocolNotSupported;
class InvalidChecksumAddress extends Error {
    constructor() {
        super();
        this.message = `Invalid address (checksum not matching the payload).`;
    }
}
exports.InvalidChecksumAddress = InvalidChecksumAddress;
class InvalidPrivateKeyFormat extends Error {
    constructor() {
        super();
        this.message = 'Private key need to be an instance of Buffer or a base64 string.';
    }
}
exports.InvalidPrivateKeyFormat = InvalidPrivateKeyFormat;
//# sourceMappingURL=errors.js.map