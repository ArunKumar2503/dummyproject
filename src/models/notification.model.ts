import { Document, Schema } from 'mongoose';
import { ccaas } from '../plugins/db';

export interface INotificationschema extends Document {
  uuid: string;
  domainId: number;
 // fromExt: string;
  toExt: number;
  notificationMsg : string;
  channelType : string;
  markAsRead :  number;
  timeStamp: number;
  type: string;
}

const Notification = new Schema({
  uuid: { type: String, required: true },
  domainId: { type: Number, required: true },
 // fromExt : { type: Number, required: true },
  toExt: { type: Number, required: true },
  notificationMsg: { type: String, required: true },
  channelType: { type: String, required: true  },
  markAsRead : { type: Number, required: true },
  timeStamp: { type: Number, required: true },
  type :  { type: String, required: true  },
  expireAt:{ type: Date, default: new Date().getTime() + 12096e5 }
});

// Export the model and return your notification interface
// Notification.index({createdAt : 1}, {expireAfterSeconds: 1000
Notification.index({ expireAt:1 }, { expireAfterSeconds:0 });
export const notificationModel = ccaas.model<INotificationschema>('notification', Notification, 'notification');
