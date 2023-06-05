/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */

import { Document, Schema } from 'mongoose';
import { ccaas } from '../plugins/db';

export interface IChatSessionHistorychema extends Document {
  sessionId: string;
  sessionStartTime: number;
  sessionEndTime: number;
  botStartTime: number;
  botEndTime: number;
  agentConnectTime: number;
  agentDisconnectTime: number;
  ipAddress: string;
  source: string;
  lastMessage: string;
  botDetails: object;
  category: string;
  isBot: boolean;
  agentComments: string;
  agentDetails: number;
  customerDetails: string;
  browser: string;
  OS: string;
  onlineStatus: boolean;
  skillsIdentify: string;
  callFlowSourceId: string;
  channelType: string;
  location: string;
  deviceType: string;
  customerData: object;
  domainId: number;
  companyId: number;
  disposition: string;
  status: string;
  priority: string;
  summary: string;
  follow_up_action: string;
  recordingUrl: string;
  callType: string;
  queue: string;
  wrapTime: number;
  botDuration: string;
  agentDuration: string;
  agentRecordingUrl: string;
  disconnectedBy: string;
  qid: string;
  assigned: boolean;
  assignedTo: string;
  assignedBy: string;
}

const SessionHistoryy = new Schema({
  sessionId: { type: String },
  sessionStartTime: { type: Number },
  sessionEndTime: { type: Number },
  botStartTime: { type: Number },
  botEndTime: { type: Number },
  agentConnectTime: { type: Number },
  agentDisconnectTime: { type: Number },
  ipAddress: { type: String },
  source: { type: String },
  lastMessage: { type: String },
  botDetails: { type: Object },
  category: { type: String },
  isBot: { type: Boolean },
  agentComments: { type: String },
  agentDetails: { type: Number },
  customerDetails: { type: String },
  browser: { type: String },
  OS: { type: String },
  onlineStatus: { type: Boolean },
  skillsIdentify: { type: String },
  callFlowSourceId: { type: String },
  channelType: { type: String },
  customerData: { type: Object },
  location: { type: String },
  deviceType: { type: String },
  domainId: { type: Number },
  companyId: { type: Number },
  disposition: { type: String },
  status: { type: String },
  priority: { type: String },
  summary: { type: String },
  dispositionName: { type: String },
  follow_up_action: { type: String },
  recordingUrl: { type: String },
  callType: { type: String },
  queue: { type: String },
  wrapTime: { type: Number },
  botDuration: { type: String },
  agentDuration: { type: String },
  agentRecordingUrl: { type: String },
  disconnectedBy: { type: String },
  qid: { type: String },
  assigned: { type: Boolean },
  assignedTo: { type: String },
  assignedBy: { type: String }
});

// Export the model and return your chatHistory interface
export const sessionHistoryModel = ccaas.model<IChatSessionHistorychema>('SessionHistory', SessionHistoryy, 'SessionHistory');
