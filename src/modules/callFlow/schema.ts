export const callflowSchema = {
  body: {
    type: 'object',
    properties: {
      templateName: { type: 'string' },
      nodes: { type: 'array' },
      edges: { type: 'array' },
      status: { type: 'number', enum: [1, 2] },
      cfid: { type: 'string' },
      description: { type: 'string' }
    },
    required: ['templateName', 'nodes', 'edges', 'status'],
  },
  defaultRes: {
    200: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        status: { type: 'string' },
        result: { type: 'object' },
        uuid: { type: 'string' },
        message: { type: 'string' },
      },
    },
  },
};

export const callflowlist = {
  defaultRes: {
    200: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        status: { type: 'string' },
        result: { type: 'array' },
        message: { type: 'string' },
      },
    },
  },
};

export const callflowsdetails = {
  params: {
    type: 'object',
    properties: {
      cfid: { type: 'string' }
    },
    required: ['cfid'],
  },
  defaultRes: {
    200: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        status: { type: 'string' },
        result: { type: 'array' },
        message: { type: 'string' },
      },
    },
  },
};
