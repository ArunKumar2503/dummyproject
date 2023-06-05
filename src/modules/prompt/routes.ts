/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */

import { cpUpload, cpUploaded } from '../../config/upload';
import { PROMPT } from '../../helpers/constants';
import {
  chatFileUpload,
  chatUploadFile,
  createPromptHandler,
  deletePromptAudioHandler,
  getAudioPrompt,
  getAudioPromptHandler,
  getDefaultAudio,
  getPromptAudioHandler,
  insertAudioPromptHandler,
  insertPromptAudioHandler,
  isValidPromptNameHandler,
  previewTextToSpeechHandler,
  textToSpeechHandler,
  updatePromptAudioHandler
} from './handler';
import { isValidSchema } from './schema';

export default function prompthandler(server: any, options: any, next: any) {
  server.post(
    PROMPT.FILEUPLOAD,
    {
      preValidation: [server.validateSession],
      preHandler: cpUpload,
      schema: {
        description: 'file upload',
        tags: ['PROMPT'],
        // response: fileUploadRes,
      },
    },
    chatFileUpload,
  );
  server.post(
    PROMPT.UPLOADFILE,
    {
      preValidation: [server.validateSession],
      preHandler: cpUploaded,
      schema: {
        description: 'file upload',
        tags: ['PROMPT'],
        // response: fileUploadRes,
      },
    },
    chatUploadFile,
  );

  server.get(
    PROMPT.GETAUDIOPROMPT,
    {
      preValidation: [server.validateSession],
      schema: {
        description: 'Get Audio prompt',
        tags: ['PROMPT'],

      },
    },
    getAudioPrompt,
  );

  server.get(
    PROMPT.GET_DEFAULT_AUDIO,
    {
      // preValidation: [server.validateSession],
      schema: {
        description: '',
        tags: ['PROMPT'],

      },
    },
    getDefaultAudio,
  );

  // text to speech
  server.post(
    PROMPT.TEXT_TO_SPEECH,
    {
      preValidation: [server.validateSession],
      schema: {
        description: 'text to speech',
        tags: ['PROMPT'],
        // body:textToSpeechReq.body,
        // response: textToSpeechRes
      },
    },
    textToSpeechHandler,
  );

  // insertPromptAudio
  server.post(
    PROMPT.INSERT_PROMPT_AUDIO,
    {
      preValidation: [server.validateSession],
      preHandler: cpUpload,
      schema: {
        description: 'text to speech',
        tags: ['PROMPT'],
      }
    },
    insertPromptAudioHandler,
  );

  // getPromptAudioLibrary
  server.get(
    PROMPT.GET_PROMPT_LIBRARY,
    {
      preValidation: [server.validateSession],
      schema: {
        description: 'get prompt audio library',
        tags: ['PROMPT'],
      }
    },
    getPromptAudioHandler,
  );

  // getPromptAudioLibrary
  server.post(
    PROMPT.CREATE_PROMPT,
    {
      preValidation: [server.validateSession],
      schema: {
        description: 'create prompt audio library',
        tags: ['PROMPT'],
      }
    },
    createPromptHandler,
  );
  // insert Prompt Audio
  server.post(
    PROMPT.INSERT_AUDIO_PROMPT,
    {
      preValidation: [server.validateSession],
      preHandler: cpUploaded,
      schema: {
        description: 'text to speech',
        tags: ['PROMPT'],
      },
    },
    insertAudioPromptHandler
  );

  // get Prompt Audio Library
  server.get(
    PROMPT.GET_PROMPT_LIBRAR,
    {
      preValidation: [server.validateSession],
      schema: {
        description: 'get prompt audio library',
        tags: ['PROMPT'],
      },
    },
    getAudioPromptHandler
  );

  // update Prompt Audio Library
  server.put(
    `${PROMPT.UPDATE_PROMPT_AUDIO}/:uuid`,
    {
      preValidation: [server.validateSession],
      preHandler: cpUpload,
      schema: {
        description: 'update prompt audio library',
        tags: ['PROMPT'],
      },
    },
    updatePromptAudioHandler
  );
  // delete prompt audio library
  server.delete(
    `${PROMPT.DELETE_PROMPT_AUDIO}/:uuid`,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'delete prompt',
        description: 'delete prompt api',
        tags: ['PROMPT']
      }
    },
    deletePromptAudioHandler
  );

  // is valid prompt name
  server.post(
    PROMPT.IS_VALID_PROMPT_NAME,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'valid prompt ',
        description: ' valid prompt api',
        tags: ['PROMPT'],
        body: isValidSchema.body,
        response: isValidSchema.response,
      },
    },
    isValidPromptNameHandler
  );

  server.post(
    PROMPT.GET_PREVIEW_AUDIO,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'preview audio',
        description: 'get preview audio',
        tags: ['PROMPT'],
      },
    },
    previewTextToSpeechHandler
  );

  next();
}
