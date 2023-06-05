import { ioredisChat } from "./plugins/db";

export class ChatFlowAdapters {
  public chatAdapter: any;
  public channelInformation: any;
  constructor(adapter: any) {
    this.chatAdapter = adapter;
    this.channelInformation = null;
  }

  public async ChatFlowHandler(channel: any) {
    if (channel && JSON.stringify(this.channelInformation) !== JSON.stringify(channel) && !JSON.parse(channel ?? "null")?.queueUpdate) {
      this.channelInformation = JSON.parse(channel ?? "null") ?? "";
    }
    console.log(this.channelInformation);
    const io = ioredisChat;
    const channelId = JSON.parse(channel ?? "null");
    // await ChatFlowChatStateHandler(channelId, this.chatAdapter);
    const callflowid = channelId?.callFlowId;
    if (callflowid) {
      let node: any = await this.chatAdapter.getFlow(`${callflowid}nodes`);
      let edge: any = await this.chatAdapter.getFlow(`${callflowid}edges`);
      node = JSON.parse(node);
      edge = JSON.parse(edge);
    }
  }
}
