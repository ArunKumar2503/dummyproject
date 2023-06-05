import { EMAIL_CONSTANT } from '../../../src/helpers/constants';
import {  deleteDefaultEmailHandler, getDefaultEmailHandler, postDefaultEmailHandler, updateEmailPrimaryKeyHandler } from './handler';

export default function emailhandler(server: any, option: any, next: any) {

  server.get(
    EMAIL_CONSTANT.GET_EMAIL_CHANNEL,
    {

      preValidation: [server.validateSession],
      schema: {
        description: 'get Email Channel',
        tags: ['EMAIL']
      }
    },
    getDefaultEmailHandler
  );

  server.post(
    EMAIL_CONSTANT.POST_EMAIL_CHANNEL,
    {
      preValidation: [server.validateSession],
      schema: {
        description: 'post email channel',
        tags: ['EMAIL']
      }
    },
    postDefaultEmailHandler
  );

  server.delete(
    `${EMAIL_CONSTANT.DELETE_EMAIL_LIST}/:uid`,
    {
      preValidation: [server.validateSession],
      schema: {
        description: 'delete Email',
        tags: ['EMAIL']
      }
    },
    deleteDefaultEmailHandler
  );

  server.put(
    `${EMAIL_CONSTANT.UPDATE_EMAIL_PRIMARYKEY}/:uid`,
    {
      preValidation: [server.validateSession],
      schema: {
        description: 'update email primary key',
        tags: ['EMAIL']
      }
    },
    updateEmailPrimaryKeyHandler
  );

  // server.get(
  //   EMAIL_CONSTANT.GET_INBOX_MAIL,
  //   {
  //     preValidation: [server.validateSession],
  //     schema: {
  //       description: 'get inbox mail',
  //       tags: ['EMAIL']
  //     }
  //   },
  //   imapInboxInboxHandler
 // );

  // server.get(
  //   EMAIL_CONSTANT.CREATE_EMAIL_SESSION,
  //   {
  //    // preValidation: [server.validateSession],
  //     schema: {
  //       description: 'get inbox mail',
  //       tags: ['EMAIL']
  //     }
  //   },
  //   createEmailSession
  // );
  next();
}
