import { SnapsGlobalObject } from "@metamask/snaps-types";
import { heading, panel, text } from "@metamask/snaps-ui";

type ConfirmationDialogContent = {
  prompt: string;
  description?: string;
  textAreaContent?: string;
};

export async function showConfirmationDialog(
  snap: SnapsGlobalObject,
  message: ConfirmationDialogContent
): Promise<boolean> {
  let panels: any = []
  panels.push(heading(`${message.prompt}`))
  if (message.description) {
    panels.push( text(`${message.description}`))
  }
  if (message.textAreaContent) {
    panels.push( text(`${message.textAreaContent}`))
  }
  return (await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel(panels),
    },
  })) as boolean;
}
