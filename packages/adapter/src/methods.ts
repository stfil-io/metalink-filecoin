import {
  MessageStatus,
  MetaLinkFilecoinRpcRequest,
  MessageRequest,
  SignedMessage,
  SignMessageResponse,
  SnapConfig,
  MessageGasEstimate,
  SignRawMessageResponse,
} from "@stfil/metalink-filecoin-types";
import { MetaLinkFilecoinSnap } from "./snap";

async function sendSnapMethod<T>(
  request: MetaLinkFilecoinRpcRequest,
  snapId: string
): Promise<T> {
  return await window.ethereum.request({
    method: "wallet_invokeSnap",
    params: {
      request,
      snapId,
    },
  });
}

export async function getAddress(this: MetaLinkFilecoinSnap): Promise<string> {
  return await sendSnapMethod({ method: "fil_getAddress" }, this.snapId);
}

export async function getPublicKey(
  this: MetaLinkFilecoinSnap
): Promise<string> {
  return await sendSnapMethod({ method: "fil_getPublicKey" }, this.snapId);
}

export async function getBalance(this: MetaLinkFilecoinSnap): Promise<string> {
  return await sendSnapMethod({ method: "fil_getBalance" }, this.snapId);
}

export async function exportPrivateKey(
  this: MetaLinkFilecoinSnap
): Promise<string> {
  return await sendSnapMethod({ method: "fil_exportPrivateKey" }, this.snapId);
}

export async function configure(
  this: MetaLinkFilecoinSnap,
  configuration: SnapConfig
): Promise<void> {
  return await sendSnapMethod(
    { method: "fil_configure", params: { configuration: configuration } },
    this.snapId
  );
}

export async function signMessage(
  this: MetaLinkFilecoinSnap,
  message: MessageRequest
): Promise<SignMessageResponse> {
  return await sendSnapMethod(
    { method: "fil_signMessage", params: { message: message } },
    this.snapId
  );
}

export async function signMessageRaw(
  this: MetaLinkFilecoinSnap,
  rawMessage: string
): Promise<SignRawMessageResponse> {
  return await sendSnapMethod(
    { method: "fil_signMessageRaw", params: { message: rawMessage } },
    this.snapId
  );
}

export async function sendMessage(
  this: MetaLinkFilecoinSnap,
  signedMessage: SignedMessage
): Promise<MessageStatus> {
  return await sendSnapMethod(
    { method: "fil_sendMessage", params: { signedMessage: signedMessage } },
    this.snapId
  );
}

export async function getMessages(
  this: MetaLinkFilecoinSnap
): Promise<MessageStatus[]> {
  return await sendSnapMethod({ method: "fil_getMessages" }, this.snapId);
}

export async function calculateGasForMessage(
  this: MetaLinkFilecoinSnap,
  message: MessageRequest,
  maxFee?: string
): Promise<MessageGasEstimate> {
  return await sendSnapMethod(
    {
      method: "fil_getGasForMessage",
      params: { maxFee: maxFee, message: message },
    },
    this.snapId
  );
}
