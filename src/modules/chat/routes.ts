/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */

import { CHAT } from '../../helpers/constants';
import { getCallSession, getChatByEndTime, getChatByNumber, getChatSession, getChatSessionId, updateChat } from './handler';

export default function chatHandler(server: any, options: any, next: any) {
  server.put(
    CHAT.UPDATE_CHAT,
    {
      preValidation: [server.validateSession],

      schema: {
        summary: 'update chat session',
        description: 'Update chat session ',
        tags: ['chat'],
        // response: fileUploadRes,
      },
    },
    updateChat,
  );
  server.get(
    CHAT.GET_CHAT,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'Get chat session',
        description: 'Get chat session List',
        tags: ['chat'],
      },
    },
    getChatSession
  );
  server.get(
    CHAT.GET_CALL,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'Get call session',
        description: 'Get call session List',
        tags: ['chat'],
      },
    },
    getCallSession
  );
  server.get(
    `${CHAT.GET_SESSION_ID}/:chatSessionId`,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'Get chat session id',
        description: 'Get chat session List',
        tags: ['chat'],

      },
    },
    getChatSessionId
  );
  server.post(
    CHAT.GET_CHAT_BY_NUMBER,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'Get chat session',
        description: 'Get chat session List',
        tags: ['chat'],
      },
    },
    getChatByNumber
  );
  server.get(
    CHAT.GET_SESSION_BY_ENDTIME,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'Get chat session by endTime',
        description: 'Get chat session by endTimeList',
        tags: ['chat'],

      },
    },
    getChatByEndTime
  );
  next();
}
