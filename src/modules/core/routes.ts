/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */

import { CORE } from '../../helpers/constants';
import { createInitiateFeedbackHandler, getInitiateFeedbackHandlers } from './handler';
import { createInitiateSchema, getInitiateSchema } from './schema';

export default function coreHandler(server: any, options: any, next: any) {
  // create api for initiate feedback
  server.put(
    CORE.CREATE_INITIATE_FEEDBACK,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'create initiate feedback ',
        description: 'create initiate feedback api',
        tags: ['core'],
        // body: createInitiateSchema.body,
        // response: createInitiateSchema.response,
      },
    },
    createInitiateFeedbackHandler
  );

  // get initiate feedback by id
  server.get(
    `${CORE.GET_INITIATE_FEEDBACK}/:ext`,
    {
      preValidation: [server.validateSession],
      schema: {
        summary: 'Get initiate feedback by id',
        description: 'Get initiate feedback api',
        tags: ['core'],
        params: getInitiateSchema.params,
        response: getInitiateSchema.response,
      },
    },
    getInitiateFeedbackHandlers
  );
  next();
}
