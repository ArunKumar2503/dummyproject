/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */

import { CALL } from '../../helpers/constants';
import {
  assignCallBackHandlers,
  getActivityListHandlers,
  getAgentCallList,
  getAgentChatList,
  getAllActiveList,
  getCallBackListHandler,
  getCallFlowDetail,
  getCallFlowDetailByCfid,
  getCallFlowList,
  getConversationListHandler,
  getSessionAllListHandler,
  getSessionIdList,
  getUpdateIvrHandler,
  getVoiceCallBackListHandler,
  getVoiceCallListHandlers,
  getwebbook,
  saveCallFlowData,
  updateCallFlowDataForPublish
} from './handler';

import {
  callflowlist,
  callflowSchema,
  callflowsdetails
} from './schema';

export default function callFlowhandler(server: any, options: any, next: any) {
  // get api for role
  server.post(
    CALL.UPDATE_IVR,
    {
      // preValidation: [server.validateSession],
      schema: {
        summary: 'update ivr ',
        description: 'update ivr api',
        tags: ['IVR'],
        // response: getRoleSchema.response,
      },
    },
    getUpdateIvrHandler
  );

  // Save abd publish callflow
  server.post(
    CALL.SAVE_CALL_FLOW,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'Save and Publish',
        description: 'Save or Publish call flow',
        tags: ['IVR'],
        body: callflowSchema.body,
        // response: callflowSchema.defaultRes,
      },
    },
    saveCallFlowData
  );

  // update callflow for publish

  server.put(
    CALL.UPDATE_CALL_FLOW,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'Save and Publish',
        description: 'Save or Publish call flow',
        tags: ['IVR'],
        body: callflowSchema.body,
        // response: callflowSchema.defaultRes,
      },
    },
    updateCallFlowDataForPublish
  );

  // Get callflow list
  server.get(
    CALL.GET_CALL_FLOW_LIST,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'CallFlow List',
        description: 'Get Call flow List',
        tags: ['IVR'],
        response: callflowlist.defaultRes
      },
    },
    getCallFlowList
  );

  // Get callflow list
  server.get(
    CALL.GET_CALL_FLOW_DETAILS,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'Call flow details',
        description: 'Get Call flow details',
        tags: ['IVR'],
        response: callflowsdetails.defaultRes
      },
    },
    getCallFlowDetail
  );

  // Get callflow details
  server.post(
    CALL.GET_CALL_FLOW_DETAILS_BY_CFID,
    {
      // preValidation: [server.validateSession],
      schema: {
        summary: 'Call flow details',
        description: 'Get Call flow details',
        tags: ['IVR'],
        // response: callflowsdetails.defaultRes
      },
    },
    getCallFlowDetailByCfid
  );

  // Get callflow list
  server.post(
    CALL.WEBHOOK,
    {
      // preValidation: [server.validateSession],
      schema: {
        summary: 'Webhook',
        description: 'Webhook',
        tags: ['IVR']
      },
    },
    getwebbook
  );

  // Get agent  call
  server.post(
    CALL.GET_ALL_ACTIVE,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'get agent call list',
        description: 'get agent call list api',
        tags: ['IVR'],
      },
    },
    getAllActiveList
  );

  // Get agent  call
  server.post(
    CALL.GET_AGENT_CALL_LIST,
    {
      // preValidation: [server.validateSession],
      schema: {
        summary: 'get agent call list',
        description: 'get agent call list api',
        tags: ['IVR'],
      },
    },
    getAgentCallList
  );

  // Get agent chat
  server.post(
    CALL.GET_AGENT_CHAT_LIST,
    {
      // preValidation: [server.validateSession],
      schema: {
        summary: 'get agent chat list',
        description: 'get agent chat list api',
        tags: ['IVR'],
      },
    },
    getAgentChatList
  );

  // Get sessionId list
  server.get(
    `${CALL.GET_SESSIONID_LIST}/:sessionId`,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'get sessionid list',
        description: 'get sessionid list api',
        tags: ['IVR'],
      },
    },
    getSessionIdList
  );

  // Get call back list
  server.post(
    CALL.GET_CALLBACK_LIST,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'get call back list',
        description: 'get callback list api',
        tags: ['IVR'],
      },
    },
    getCallBackListHandler
  );

  // Get voice call list
  server.post(
    CALL.GET_VOICE_CALL_LIST,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'get voice call list',
        description: 'get voice call list api',
        tags: ['IVR'],
      },
    },
    getVoiceCallListHandlers
  );

  // assign callback
  server.post(
    CALL.ASSIGN_CALLBACK,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'update assign callback',
        description: 'update assign callback api',
        tags: ['IVR'],
      },
    },
    assignCallBackHandlers
  );

  // Get activity list
  server.post(
    CALL.GET_ACTIVITY_LIST,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'get activity list',
        description: 'get activity list api',
        tags: ['IVR'],
      },
    },
    getActivityListHandlers
  );

  // Get voice call back list
  server.post(
    CALL.GET_VOICE_CALLBACK_LIST,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'get voice call back list',
        description: 'get voice callback list api',
        tags: ['IVR'],
      },
    },
    getVoiceCallBackListHandler
  );

  // Get sessionId all details
  server.get(
    `${CALL.GET_SESSION_ALL_LIST}/:phoneNumber`,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'get session all list',
        description: 'get session all list api',
        tags: ['IVR'],
      },
    },
    getSessionAllListHandler
  );

  // Get conversation History
  server.get(
    `${CALL.GET_CONVERSATION_LIST}/:sessionId`,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'get conversation list',
        description: 'get conversation list api',
        tags: ['IVR'],
      },
    },
    getConversationListHandler
  );
  next();
}
