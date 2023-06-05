/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */

import { Document, Schema } from 'mongoose';
import { ccaas } from '../plugins/db';

export interface ICallflowschema extends Document {
  templateName: string;
  nodes: [];
  edges: [];
  version: string;
  type: number;
  createDate: number;
  lastModifiedDate: number;
  uuid: string;
  status: number;
  cfid: string;
  companyId: number;
  domainId: number;
  callFlowStatus: number;
  description: string;
}

const callflow = new Schema({
  templateName: { type: String, required: true },
  nodes: { type: Array, required: true },
  edges: { type: Array, required: true },
  version: { type: String, required: true },
  type: { type: Number },
  createDate: { type: String, required: true },
  lastModifiedDate: { type: String, required: true },
  uuid: { type: String, required: true },
  status: { type: Number, required: true, default: 1 },
  cfid: { type: String },
  companyId: { type: Number },
  domainId: { type: Number },
  callFlowStatus: { type: Number },
  description: { type: String }
});

// Export the model and return your callflow interface
export const callflowModel = ccaas.model<ICallflowschema>('callflow', callflow, 'callflow');
