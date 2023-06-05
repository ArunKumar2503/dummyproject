/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */

import { Document, Schema } from 'mongoose';
import { ccaas } from '../plugins/db';

export interface IConversationHistorySchema extends Document {
  sessionId: string;
  from: string;
  to: string;
  messageType: string;
  message: any;
  id: string;
  timeStamp: number;
  agentState: string;
  customerState: string;
  botDetails: string;
  domainId: number;
  companyId: number;
  isBot: boolean;
}

const conversationHistory = new Schema({
  sessionId: { type: String },
  from: { type: String },
  to: { type: String },
  messageType: { type: String },
  message: { type: Array },
  id: { type: String },
  timeStamp: { type: Number },
  agentState: { type: String },
  customerState: { type: String },
  botDetails: { type: String },
  companyId: { type: Number },
  domainId: { type: Number },
  isBot: { type: Boolean }
});

// Export the model and return your chatHistory interface
export const conversationHistoryModel = ccaas.model<IConversationHistorySchema>('conversationHistory', conversationHistory, 'conversationHistory');
