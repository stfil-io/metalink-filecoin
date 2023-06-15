import { MessageStatus, MessageRequest, SignedMessage, SignMessageResponse, SnapConfig, MessageGasEstimate, SignRawMessageResponse } from "@stfil/metalink-filecoin-types";
import { MetaLinkFilecoinSnap } from "./snap";
export declare function getAddress(this: MetaLinkFilecoinSnap): Promise<string>;
export declare function getPublicKey(this: MetaLinkFilecoinSnap): Promise<string>;
export declare function getBalance(this: MetaLinkFilecoinSnap): Promise<string>;
export declare function exportPrivateKey(this: MetaLinkFilecoinSnap): Promise<string>;
export declare function configure(this: MetaLinkFilecoinSnap, configuration: SnapConfig): Promise<void>;
export declare function signMessage(this: MetaLinkFilecoinSnap, message: MessageRequest): Promise<SignMessageResponse>;
export declare function signMessageRaw(this: MetaLinkFilecoinSnap, rawMessage: string): Promise<SignRawMessageResponse>;
export declare function sendMessage(this: MetaLinkFilecoinSnap, signedMessage: SignedMessage): Promise<MessageStatus>;
export declare function getMessages(this: MetaLinkFilecoinSnap): Promise<MessageStatus[]>;
export declare function calculateGasForMessage(this: MetaLinkFilecoinSnap, message: MessageRequest, maxFee?: string): Promise<MessageGasEstimate>;
