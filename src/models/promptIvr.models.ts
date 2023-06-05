/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */

import { Document, Schema } from 'mongoose';
import { ccaas } from '../plugins/db';

export interface IAudioPlayPrompt extends Document {
  fieldname: string;
  encoding: string;
  mimetype: string;
  filename: string;
  path: string;
  size: number;
  url: string;
  uuid: string;
  name: string;
  domain: string;
  message: string;
}

const prompt = new Schema({
  fieldname: { type: String },
  encoding: { type: String },
  mimetype: { type: String },
  filename: { type: String },
  path: { type: String, required: true },
  size: { type: Number },
  url: { type: String, required: true },
  uuid: { type: String, require: true },
  name: { type: String, required: true },
  domain: { type: String, required: true },
  message: { type: String }
});

// Export the model and return your IUser interface
export const AudioPlayPrompt = ccaas.model<IAudioPlayPrompt>('prompt_autio', prompt, 'prompt_autio');

export interface IAudioDefault extends Document {
  fieldname: string;
  encoding: string;
  mimetype: string;
  filename: string;
  path: string;
  size: number;
  url: string;
  uuid: string;
  name: string;
  domain: string;
  message: string;
}

const defaultAu = new Schema({
  fieldname: { type: String },
  encoding: { type: String },
  mimetype: { type: String },
  filename: { type: String },
  path: { type: String, required: true },
  size: { type: Number },
  url: { type: String, required: true },
  uuid: { type: String, require: true },
  name: { type: String, required: true },
  domain: { type: String, required: true },
  message: { type: String }
});

// Export the model and return your IUser interface
export const defaultAudioRes = ccaas.model<IAudioDefault>('defaultAudio', defaultAu, 'defaultAudio');

export interface IAudioDefault extends Document {
  message: string;
  path: string;
  url: string;
  fileName: string;
  domainId: string;
  name: string;
  type: string;
  description: string;
  fieldname: string;
  encoding: string;
  mimetype: string;
  filename: string;
  size: number;
  uuid: string;
  companyId: number;
  createdAt: Date;
  promptType: string;
}

const text = new Schema({
  message: { type: String },
  path: { type: String },
  type: { type: String },
  url: { type: String },
  fileName: { type: String },
  domainId: { type: String },
  name: { type: String },
  description: { type: String },
  fieldname: { type: String },
  encoding: { type: String },
  mimetype: { type: String },
  filename: { type: String },
  size: { type: Number },
  uuid: { type: String },
  companyId: { type: Number },
  createdat: {
    type: Date,
    default: Date.now,
  },
  promptType: { type: String }

});

// Export the model and return your IUser interface
export const textToAudio = ccaas.model<IAudioDefault>('textToSpeech', text, 'textToSpeech');

export interface IAudioDefaultPro extends Document {
  fieldname: string;
  encoding: string;
  mimetype: string;
  filename: string;
  path: string;
  size: number;
  url: string;
  uuid: string;
  name: string;
  domain: number;
  message: string;
}

const defaultAutio = new Schema({
  fieldname: { type: String },
  encoding: { type: String },
  mimetype: { type: String },
  filename: { type: String },
  path: { type: String, required: true },
  size: { type: Number },
  url: { type: String, required: true },
  uuid: { type: String, require: true },
  name: { type: String, required: true },
  domain: { type: Number, required: true },
  message: { type: String }
});

// Export the model and return your IUser interface
export const defaultAudio = ccaas.model<IAudioDefaultPro>('defaultAudioPrompt', defaultAutio, 'defaultAudioPrompt');
