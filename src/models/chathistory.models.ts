/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */

import { Document, Schema } from 'mongoose';
import { ccaas } from '../plugins/db';

export interface IChatHistorychema extends Document {
  sessionId: string;
  from: string;
  to: string;
  messageType: string;
  message: string;
  id: string;
  timeStamp: string;
  isDelivered: string;
  isSeen: string;
  botDetails: string;
  domainId: string;
  companyId: string;
  isBot: boolean;
}

const chatHistory = new Schema({
  sessionId: { type: String },
  from: { type: String },
  to: { type: String },
  messageType: { type: String },
  message: { type: String },
  id: { type: String },
  timeStamp: { type: String },
  agentState: { type: String },
  customerState: { type: String },
  botDetails: { type: String },
  companyId: { type: String },
  domainId: { type: String },
  isBot: { type: Boolean }
});

// Export the model and return your chatHistory interface
export const chatHistoryModel = ccaas.model<IChatHistorychema>('chatHistory', chatHistory, 'chatHistory');
