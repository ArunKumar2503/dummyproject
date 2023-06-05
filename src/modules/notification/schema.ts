
// insertGetNotificationSchema
export const insertGetNotificationSchema = {
  body: {
    type: 'object',
    properties: {
      uuid: { type: 'string' },
      toUser: { type: 'number' },
      notificationMsg: { type: 'string' },
      channelType: { type: 'string' },
      type: { type: 'string' },
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

// getNotificationSchema
export const getNotificationSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        result: { type: 'array' }

      },
    },
  },
};

// deleteNotificationSchema
export const deleteNotificationSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' }

      },
    },
  },
};

// updatemarkasReadNotificationSchema
export const updatemarkasReadNotificationSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' }

      },
    },
  },
};
