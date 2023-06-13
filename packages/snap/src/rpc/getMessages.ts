import { MessageStatus } from "@stfil/metalink-filecoin-types";
import { SnapsGlobalObject } from "@metamask/snaps-types";
import { MetamaskState } from "../interfaces";

export async function getMessages(
  snap: SnapsGlobalObject
): Promise<MessageStatus[]> {
  const state = (await snap.request({
    method: "snap_manageState",
    params: { operation: "get" },
  })) as unknown as MetamaskState;
  return state?.filecoin?.messages;
}
