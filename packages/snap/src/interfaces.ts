import {
  MessageStatus,
  MetamaskFilecoinRpcRequest,
  SnapConfig,
} from "@stfil/metalink-filecoin-types";
import { defaultConfiguration } from "./configuration/predefined";

export type FMethodCallback = (
  originString: string,
  requestObject: MetamaskFilecoinRpcRequest
) => Promise<unknown>;

export type MetamaskState = {
  filecoin: {
    config: SnapConfig;
    messages: MessageStatus[];
  };
};

export const EmptyMetamaskState: () => MetamaskState = () => ({
  filecoin: { config: defaultConfiguration, messages: [] },
});
