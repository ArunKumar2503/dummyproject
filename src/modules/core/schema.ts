/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */

// createInitiateSchema
export const createInitiateSchema = {
  body: {
    type: 'object',
    properties: {
      sessionId: { type: 'string' },
      category: { type: 'string' },
      disposition: { type: 'string' },
      status: { type: 'string' },
      priority: { type: 'string' },
      summary: { type: 'string' },
      follow_up_action: { type: 'string' }
    },
    required: ['sessionId', 'category', 'disposition', 'status', 'priority', 'follow_up_action'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
      },
    },
  },
};

// getInitiateSchema
export const getInitiateSchema = {
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
        getInitiateRes: {
          type: 'array',
          items: {
            properties: {
              _id: { type: 'string' },
              uuid: { type: 'string' },
              ext: { type: 'number' },
              domainId: { type: 'number' },
              companyId: { type: 'number' },
              category: { type: 'string' },
              disposition: { type: 'string' },
              status: { type: 'string' },
              priority: { type: 'string' },
              summary: { type: 'string' },
              follow_up_action: { type: 'string' },
              insertedAt: { type: 'number' }
            },
          },
        },
      },
    },
  },
};
