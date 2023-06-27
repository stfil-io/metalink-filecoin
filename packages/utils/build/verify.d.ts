import { Message } from "@stfil/metalink-filecoin-types";
import { NetworkPrefix } from './artifacts/address';
export declare function verifyMessage(message: Message | string, signature: string, networkPrefix?: NetworkPrefix): Promise<string>;
