import { DISPOSITION } from '../../helpers/constants';
import { deleteDispositionStatusHandler, getDispositinStatusHandler, insertDispositionStatusHandler, isValidDispositionNameHandler, updateCalledPersonDetailsCallHandler, updateDispositionHandler, updateDispositionStatusHandler } from './handler';
import { deleteDispositionSchema, getDispositinStatusSchema, insertDispositinStatusSchema, isValidSchema, updateCalledPersonDetailsCallSchema, updateDispositionCallSchema, updateDispositionSchema } from './schema';

export default function dispositionStatusHandler(server: any, options: any, next: any) {
  // insert agent status
  server.post(
    DISPOSITION.INSERT_DISPOSITION_STATUS,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'insert disposition status',
        description: 'insert disposition status api',
        tags: ['disposition'],
        body: insertDispositinStatusSchema.body,
        response: insertDispositinStatusSchema.response,
      },
    },
    insertDispositionStatusHandler
  );

  // get dispositin status
  server.get(
    DISPOSITION.GET_DISPOSITION_STATUS,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'get disposition status',
        description: 'get disposition status api',
        tags: ['disposition'],
        response: getDispositinStatusSchema.response,
      },
    },
    getDispositinStatusHandler
  );

  // update dispositin status
  server.put(
    `${DISPOSITION.UPDATE_DISPOSITION_STATUS}/:did`,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'update disposition status',
        description: 'update disposition status api',
        tags: ['disposition'],
        params: updateDispositionSchema.params,
        body: updateDispositionSchema.body,
        response: updateDispositionSchema.response,
      },
    },
    updateDispositionStatusHandler
  );

  // delete disposition status
  server.delete(
    `${DISPOSITION.DELETE_DISPOSITION_STATUS}/:did`,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'delete disposition status',
        description: 'delete disposition status api',
        tags: ['disposition'],
        // params: deleteDispositionSchema.params,
        // response: deleteDispositionSchema.response,
      },
    },
    deleteDispositionStatusHandler
  );

  // is valid disposition name
  server.post(
    DISPOSITION.IS_VALID_DISPOSITION_NAME,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'valid disposition',
        description: ' valid disposition api',
        tags: ['disposition'],
        body: isValidSchema.body,
        response: isValidSchema.response,
      },
    },
    isValidDispositionNameHandler
  );
  // update dispositin status
  server.put(
    `${DISPOSITION.UPDATE_DISPOSITION}/:sessionId`,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'update disposition ',
        description: 'update disposition  api',
        tags: ['disposition'],
        params: updateDispositionCallSchema.params,
        body: updateDispositionCallSchema.body,
        response: updateDispositionCallSchema.response,
      },
    },
    updateDispositionHandler
  );

  // update calledPersonDetails
  server.put(
    `${DISPOSITION.UPDATE_CALLED_PERSON_DETAILS}/:sessionId`,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'update calledPersonDetails ',
        description: 'update calledPersonDetails  api',
        tags: ['disposition'],
        params: updateCalledPersonDetailsCallSchema.params,
        body: updateCalledPersonDetailsCallSchema.body,
        response: updateCalledPersonDetailsCallSchema.response,
      },
    },
    updateCalledPersonDetailsCallHandler
  );
  next();
}
