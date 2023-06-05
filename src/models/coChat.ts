/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */

import { Document, Schema } from 'mongoose';
import { ccaas } from '../plugins/db';

export interface ICoChatschema extends Document {
  channelId: string;
  channelName: string;
  subscribedUsers: [];
  channelIcon: string;
  domainId: number;
  lastMessageInfo: {};
  unseenCount: number;
  allSeenStatus: number;
  uid: string;
  isChannelMuted: number;
  createdAt: Date;
  messages: [];
}

const coChat = new Schema({
  channelId: { type: String },
  channelName: { type: String },
  subscribedUsers: { type: Array },
  channelIcon: { type: String },
  domainId: { type: Number },
  lastMessageInfo: { type: Object },
  unseenCount: { type: Number },
  allSeenStatus: { type: Number },
  isChannelMuted: { type: Number },
  uid: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  messages: { type: Array }
});

// Export the model and return your ICoChatschema interface
export const coChatModel = ccaas.model<ICoChatschema>('coChat', coChat, 'coChat');
