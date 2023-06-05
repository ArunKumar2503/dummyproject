/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */

// createStateSchema
export const createStateSchema = {
  body: {
    type: 'object',
    properties: {
      state: { type: 'string' },
      timestamp: { type: 'number' }
    },
    required: ['state', 'timestamp'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        statusCode: { type: 'string' },
        message: { type: 'string' },
      },
    },
  },
};

// getStateListById
export const getStateListById = {
  params: {
    type: 'object',
    properties: {
      ext: { type: 'number' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        getStateListRes: {
          type: 'array',
          items: {
            properties: {
              stid: { type: 'number' },
              state: { type: 'number' },
              ext: { type: 'number' },
              domainId: { type: 'number' },
              duration: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
      },
    },
  },
};
