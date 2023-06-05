/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */

import { QUEUE } from '../../helpers/constants';
import { createQueueWaitTimeHandler, deleteQueueWaitTimeHandler, getAllQueueWaitTimeHandlers, getQueueWaitTimeHandlers, updateQueueWatiTimeHandler } from './handler';
import { createQueueWaitSchema, createUpdateQueueSchema, deleteQueueWaitTimeSchema, getWaitTimeSchema } from './schema';

export default function queueWaitTimeHandler(server: any, options: any, next: any) {

  // create api for queue wait
  server.post(
    QUEUE.CREATE_QUEUE_WAIT_TIME,
    {
      // preValidation: [server.validateSession],
      schema: {
        summary: 'create queue wait time',
        description: 'create queue wait time api',
        tags: ['queue'],
        body: createQueueWaitSchema.body,
        response: createQueueWaitSchema.response,
      },
    },
    createQueueWaitTimeHandler
  );

  // update api for wait time
  server.put(
    `${QUEUE.UPDATE_QUEUE_WAIT_TIME}/:uuid`,
    {
      // preValidation: [server.validateSession],
      schema: {
        summary: 'update wait time',
        description: 'update wait time api',
        tags: ['queue'],
        body: createUpdateQueueSchema.body,
        response: createUpdateQueueSchema.response,
      },
    },
    updateQueueWatiTimeHandler
  );

  // delete queue wait timeS
  server.post(
    QUEUE.DELETE_QUEUE_WAIT_TIME,
    {
      // preValidation: [server.validateSession],
      schema: {
        summary: 'delete queue wait time',
        description: 'delete queue wait time api',
        tags: ['queue'],
        // params: deleteQueueWaitTimeSchema.params,
        // response: deleteQueueWaitTimeSchema.response,
      },
    },
    deleteQueueWaitTimeHandler
  );

  // get queue wait time by id
  server.get(
    `${QUEUE.GET_QUEUE_WAIT_TIME}/:qid`,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'Get queue wait time by id',
        description: 'Get queue wait time api',
        tags: ['queue'],
        // params: getWaitTimeSchema.params,
        // response: getWaitTimeSchema.response,
      },
    },
    getQueueWaitTimeHandlers
  );

  // get queue wait time by id
  server.get(
    QUEUE.GET_ALL_QUEUE_WAIT_TIME,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'Get queue wait time by id',
        description: 'Get queue wait time api',
        tags: ['queue'],
        // params: getWaitTimeSchema.params,
        // response: getWaitTimeSchema.response,
      },
    },
    getAllQueueWaitTimeHandlers
  );
  next();
}
