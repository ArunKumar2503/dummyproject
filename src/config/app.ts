/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */

import { IncomingMessage, Server, ServerResponse } from 'http';

import { config } from 'dotenv';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

config();
export interface IConfig {
  apiurl: string | undefined;
  mongouri: {
    ccaas: string | undefined;
  };
  paths: {
    upload_destination: string;
    upload_destination_temp: string;
    fileGetUrl: string;
  };
  chat_path: {
    upload_destination: string;
    fileGetUrl: string;
  };
  readSpeaker: {
    host: string;
    prefix: string;
  };
  redisCluster: {
    nodes: any;
  };

  voiceEngineBaseUrl: string;
  sqlCcaasDB: {
    user: string | undefined;
    host: string | undefined;
    password: string | undefined;
    database: string | undefined;
    port: number | undefined;
    options: {
      encrypt: boolean;
    };
  };
  jwtsecret: string;
  appname: string | undefined;
  appversion: string | undefined;
  serverport: string | undefined;
  servicepath: string | undefined;
  requestChannel: string;
  responseChannel: string;
}

export const configs: IConfig = {
  apiurl: (() => {
    return process.env.API_URL;
  })(),
  mongouri: (() => {
    return {
      ccaas: process.env.MONGO_CCAAS_URL,
    };
  })(),
  paths: (() => {
    return {
      upload_destination: process.env.UPLOAD_DESINATION_PATH,
      upload_destination_temp: process.env.UPLOAD_DESINATION_TEMP_PATH,
      fileGetUrl: process.env.FILEGETURL_PATH,
    };
  })(),
  chat_path: (() => {
    return {
      upload_destination: process.env.UPLOAD_DESINATION_CHAT,
      fileGetUrl: process.env.FILEGETURL_CHAT,
    };
  })(),
  readSpeaker: (() => {
    return {
      host: '10.22.3.70',
      prefix: '/rest/vtspeech',
    };
  })(),
  voiceEngineBaseUrl: 'http://staging.voiceengine.unifiedring.co.uk:5001/api',
  sqlCcaasDB: (() => {
    return {
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      port: process.env.MYSQL_PORT,
      insecureAuth: true,
      options: {
        encrypt: false,
      },
    } as any;
  })(),
  redisCluster: (() => {
    return {
      // nodes: [
      //   {
      //     port: 6380,
      //     host: '10.150.3.171',
      //   },
      //   {
      //     port: 6380,
      //     host: '10.150.3.172',
      //   }, {
      //     port: 6380,
      //     host: '10.150.3.173',
      //   },
      //   {
      //     port: 6380,
      //     host: '10.150.3.175',
      //   },
      //   {
      //     port: 6380,
      //     host: '10.171.3.47',
      //   },
      //   {
      //     port: 6380,
      //     host: '10.171.3.45',
      //   },
      //   {
      //     port: 6380,
      //     host: '10.171.1.174',
      //   },
      //   {
      //     port: 6380,
      //     host: '10.171.3.42',
      //   },
      //   {
      //     port: 6380,
      //     host: '10.171.3.43',
      //   },
      //   {
      //     port: 6380,
      //     host: '10.171.3.44',
      //   },
      //   {
      //     port: 6380,
      //     host: '10.150.3.176',
      //   },
      //   {
      //     port: 6380,
      //     host: '10.171.3.46',
      //   },
      // ]
      // nodes: [
      //   { host: '10.150.0.167', port: 6379 },
      //   { host: '10.150.0.167', port: 6380 },
      //   { host: '10.150.0.167', port: 6381 },
      //   { host: '10.150.0.167', port: 6382 },
      //   { host: '10.150.0.167', port: 6383 },
      //   { host: '10.150.0.167', port: 6384 },
      // ]
      nodes: [
        { host: '10.171.3.42', port: 6381 },
        { host: '10.171.3.43', port: 6381 },
        { host: '10.171.3.44', port: 6381 },
        // { host: "10.171.3.45", port: 6381 },
        // { host: "10.171.3.46", port: 6381 },
        // { host: "10.171.3.47", port: 6381 },
      ],
    };
  })(),
  appname: process.env.APPLICATION_NAME,
  appversion: process.env.APP_VERSION,
  serverport: process.env.SERVER_PORT,
  servicepath: process.env.SERVICE_PATH,
  requestChannel: process.env.REQUESTCHANNEL,
  responseChannel: process.env.RESPONSECHANNEL,
  jwtsecret: 'sscret',
};
export const SWAGGER_OPTS = {
  routePrefix: 'call/docs',
  exposeRoute: true,
  swagger: {
    info: {
      title: 'call Service',
      description: ' call Service api documentation',
      version: '0.1.0',
    },
    servers: [
      {
        url: 'https://stageccaasapi.unifiedring.co.uk/',
        description: 'staging',
      },
      {
        url: 'http://localhost:5007',
        description: 'development',
      },
      {
        url: 'https://ccaasapi.unifiedring.co.uk/',
        description: 'production',
      },
    ],
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [],
    securityDefinitions: {
      apiKey: {
        description: 'Standard Authorization header using the Key and Value scheme. Example: "key" : "authorization", "value" : "{token}"',
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
  },
};

export const CORS_OPTIONS = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: false,
  exposedHeaders: null,
  allowedHeaders: null,
  maxAge: null,
  preflight: true,
  hideOptionsRoute: true,
};

export default fp((app: FastifyInstance<Server, IncomingMessage, ServerResponse>, opts: {}, done: (err?: Error) => void) => {
  app.decorate('config', configs);
  done();
});
