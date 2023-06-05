/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */

// insertDispositinStatusSchema
export const insertDispositinStatusSchema = {
  body: {
    type: 'object',
    properties: {
      dispositionName: { type: 'string' },
      description: { type: 'string' },
      status: { type: 'number' },
      colorCode: { type: 'string' }
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        insertStatusList: {
          type: 'object',
          properties: {
            did: { type: 'number' },
            dispositionName: { type: 'string' },
            type: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'number' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
            domainId: { type: 'number' },
            colorCode: { type: 'string' }
          },
        },
      },
    },
  },
};

// getDispositinStatusSchema
export const getDispositinStatusSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        getDispositinListRes: {
          type: 'array',
          items: {
            properties: {
              did: { type: 'number' },
              dispositionName: { type: 'string' },
              type: { type: 'string' },
              description: { type: 'string' },
              status: { type: 'number' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
              domainId: { type: 'number' },
              colorCode: { type: 'string' }
            },
          },
        },
      },
    },
  },
};

// updateDispositionSchema
export const updateDispositionSchema = {
  params: {
    type: 'object',
    properties: {
      did: { type: 'number' },
    },
  },
  body: {
    type: 'object',
    properties: {
      dispositionName: { type: 'string' },
      description: { type: 'string' },
      status: { type: 'number' },
      colorCode: { type: 'string' }
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

// deleteDispositionSchema
export const deleteDispositionSchema = {
  params: {
    type: 'object',
    properties: {
      did: { type: 'number' },
    },
    required: ['did'],
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

// isValidSchema
export const isValidSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        flag: { type: 'number' }
      },
    },
  },
};
// updateCalledPersonDetailsCallSchema
export const updateCalledPersonDetailsCallSchema = {
  params: {
    type: 'object',
    properties: {
      sessionId: { type: 'string' },
    },
  },
  body: {
    type: 'object',
    properties: {
      calledPersonDetails: { type: 'object' }
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

// updateDispositionCallSchema
export const updateDispositionCallSchema = {
  params: {
    type: 'object',
    properties: {
      sessionId: { type: 'string' },
    },
  },
  body: {
    type: 'object',
    properties: {
      summary: { type: 'string' },
      disposition: { type: 'object' },
      dispositionName: { type: 'string' },
      afterCallWorkTime: { type: 'number' },
      calledPersonDetails: { type: 'object' },
      subject: { type: 'string' },
    },
    required: ['summary', 'subject', 'disposition'],
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
