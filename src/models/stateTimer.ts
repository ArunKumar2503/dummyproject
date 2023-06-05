/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */

import { Document, Schema } from 'mongoose';
import { ccaas } from '../plugins/db';

export interface IStateTimerSchema extends Document {
  ext: number;
  domainId: number;
  state: string;
  timestamp: number;
  uuid: string;
  createdAt: Date;
}

const stateTimer = new Schema({
  ext: { type: Number },
  domainId: { type: Number },
  timestamp: { type: Number },
  state: { type: String, required: true },
  uuid: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model and return your callflow interface
export const stateTimerModel = ccaas.model<IStateTimerSchema>('stateTimer', stateTimer, 'stateTimer');
