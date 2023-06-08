import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';
import { EmptyMetamaskState } from './interfaces';
import { getApi } from "./filecoin/api";
import { LotusRpcApi } from './filecoin/types';
import { configure } from './rpc/configure';
import { isValidConfigureRequest, isValidEstimateGasRequest, isValidSendRequest, isValidSignRequest } from './util/params';
import { getAddress } from './rpc/getAddress';
import { getPublicKey } from './rpc/getPublicKey';
import { exportPrivateKey } from './rpc/exportPrivateKey';
import { getBalance } from './rpc/getBalance';
import { getMessages } from './rpc/getMessages';
import { signMessage, signMessageRaw } from './rpc/signMessage';
import { sendMessage } from './rpc/sendMessage';
import { estimateMessageGas } from './rpc/estimateMessageGas';

const apiDependentMethods = [
  "fil_getBalance",
  "fil_signMessage",
  "fil_sendMessage",
  "fil_getGasForMessage",
  "fil_configure",
];
/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
  const state = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  });
  

  if (!state) {
    // initialize state if empty and set default config
    await snap.request({
      method: "snap_manageState",
      params: { newState: EmptyMetamaskState(), operation: "update" },
    });
  }
  
  let api: LotusRpcApi;
  // initialize lotus RPC api if needed
  if (apiDependentMethods.indexOf(request.method) >= 0) {
    api = await getApi(snap);
  }
  switch (request.method) {
    case 'hello':
      return await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Hello, **${origin}**!`),
            text('This custom confirmation is just for display purposes.'),
            text(
              'But you can edit the snap source code to make it do something, if you want to!',
            ),
          ]),
        },
      });
    case "fil_configure": {
      isValidConfigureRequest(request.params);
      const resp = await configure(
        snap,
        request.params.configuration.network,
        request.params.configuration
      );
      api = resp.api;
      return resp.snapConfig;
    }
    case "fil_getAddress":
      return await getAddress(snap);
    case "fil_getPublicKey":
      return await getPublicKey(snap);
    case "fil_exportPrivateKey":
      return exportPrivateKey(snap);
    case "fil_getBalance": {
      const balance = await getBalance(snap, api);
      return balance;
    }
    case "fil_getMessages":
      return getMessages(snap);
    case "fil_signMessage":
      isValidSignRequest(request.params);
      return await signMessage(snap, api, request.params.message);
    case "fil_signMessageRaw":
      if (
        "message" in request.params &&
        typeof request.params.message == "string"
      ) {
        return await signMessageRaw(snap, request.params.message);
      } else {
        throw new Error("Invalid raw message signing request");
      }
    case "fil_sendMessage":
      isValidSendRequest(request.params);
      return await sendMessage(snap, api, request.params.signedMessage);
    case "fil_getGasForMessage":
      console.log("fil_getGasForMessage: ", request.params)
      isValidEstimateGasRequest(request.params);
      return await estimateMessageGas(
        snap,
        api,
        request.params.message,
        request.params.maxFee
      );
    default:
      throw new Error('Method not found.');
  }
};