/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */

// createQueueWaitSchema
export const createQueueWaitSchema = {
  body: {
    type: 'object',
    properties: {
      qid: { type: 'number' },
      queueName: { type: 'string' },
      queueType: { type: 'string' },
      domainId: { type: 'number' },
      queueList: { type: 'array' }
    },
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

// createUpdateQueueSchema
export const createUpdateQueueSchema = {
  params: {
    type: 'object',
    properties: {
      uuid: { type: 'number' },
    },
  },
  body: {
    type: 'object',
    properties: {
      qid: { type: 'number' },
      queueName: { type: 'string' },
      queueType: { type: 'string' },
      domainId: { type: 'string' },
      from: { type: 'string' },
      duration: { type: 'string' }
    },
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

// deleteQueueWaitTimeSchema
export const deleteQueueWaitTimeSchema = {
  params: {
    type: 'object',
    properties: {
      uuid: { type: 'string' },
    },
    required: ['uuid'],
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

// getWaitTimeSchema
export const getWaitTimeSchema = {
  params: {
    type: 'object',
    properties: {
      qid: { type: 'number' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        getQueueWaitTimeList: {
          type: 'array',
          properties: {
            _id: { type: 'string' },
            qid: { type: 'number' },
            queueName: { type: 'string' },
            queueType: { type: 'string' },
            domainId: { type: 'number' },
            queueList: { type: 'array' },
            insertedAt: { type: 'number' },
            updatedAt: { type: 'number' }
          },

        },
      },
    },
  },
};
