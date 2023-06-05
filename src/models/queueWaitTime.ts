/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */

import { Document, Schema } from 'mongoose';
import { ccaas } from '../plugins/db';

export interface IQueueWaitSchema extends Document {
  qid: number;
  queueName: string;
  queueType:string;
  domainId: number;
  queueList:any;
  insertedAt: number;
  updatedAt: number;
}

const queueWait = new Schema({
  qid: { type: Number },
  queueName: { type: String },
  queueType: { type: String },
  domainId: { type: Number },
  queueList:{ type:Array },
  insertedAt: { type: Number },
  updatedAt: { type: Number }
});

// Export the model and return your IQueueWaitSchema interface
export const queueWaitTimeModel = ccaas.model<IQueueWaitSchema>('queueWaitTime', queueWait, 'queueWaitTime');
