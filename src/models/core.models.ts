/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */

import { Document, Schema } from 'mongoose';
import { ccaas } from '../plugins/db';

export interface ICoreschema extends Document {
  ext: number;
  domainId: number;
  companyId: number;
  category: string;
  disposition: string;
  status: string;
  priority: string;
  summary: string;
  follow_up_action: string;
  uuid: string;
  insertedAt: number;
}

const coreFlow = new Schema({
  ext: { type: Number },
  domainId: { type: Number },
  companyId: { type: Number },
  category: { type: String },
  disposition: { type: String },
  status: { type: String },
  priority: { type: String },
  summary: { type: String },
  follow_up_action: { type: String },
  uuid: { type: String },
  insertedAt: { type: Number }
});

// Export the model and return your callflow interface
export const coreModel = ccaas.model<ICoreschema>('core', coreFlow, 'core');
