
import {  Uploaded } from '../../config/upload';
import { WEBCHAT } from '../../helpers/constants';
import {  chatCustomerFileUpload, getAvailableAgentDetails, storeCustomerCallBackRequest, webChatGetAvailableAgent, webChatValidateCustomer, webChatValidateCustomerWithMailId } from './handlers';

export default function CustomerWebChat(server: any, options: any, next: any) {
  server.post(
    WEBCHAT.CREATE_WEBCHAT,
    {
      schema: {
        description: 'webchat create session and available agent call',
        tags: ['WEBCHAT'],
      },
    },
    webChatGetAvailableAgent,
  );

  server.get(
    `${WEBCHAT.GET_CUSTOMER_HISTORY}/:uuid`,
    {
      schema: {
        description: 'validate Customer Already exists',
        tags: ['WEBCHAT'],
      },
    },
    webChatValidateCustomer,
  );

  server.post(
    `${WEBCHAT.STORE_CUSTOMER_CALL_BACK}`,
    {
      schema: {
        description: 'store the customer callBack request api',
        tags: ['WEBCHAT'],
      },
    },
    storeCustomerCallBackRequest,
  );

  server.post(
    WEBCHAT.CREATE_CUSTOMER_UPLOAD,
    {
      preHandler: Uploaded,
      schema: {
        description: 'create the file path  api',
        tags: ['WEBCHAT'],
      },
    },
    chatCustomerFileUpload,
  );

  server.post(
    WEBCHAT.GET_CUSTOMER_HISTORY_EMAIL_ID,
    {
      schema: {
        description: 'get customer history by email id',
        tags: ['WEBCHAT'],
      },
    },
    webChatValidateCustomerWithMailId,
  );

  server.post(
    WEBCHAT.GET_AGENT_DETAILS,
    {
      schema: {
        description: 'get customer history by email id',
        tags: ['WEBCHAT'],
      },
    },
    getAvailableAgentDetails,
  );
  next();
}
