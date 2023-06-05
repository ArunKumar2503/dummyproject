/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */

import { Emitter } from '@socket.io/redis-emitter';
import * as Redis from 'ioredis';
import mongoose from 'mongoose';
import mysql from 'mysql';
// import { createClient } from 'redis';
import redis from 'redis';
// import { RedisClient } from 'redis';
import { configs } from '../config/app';
import { RedisAdapters } from '../redisAdapters';

// const redis = require('redis');

// const url = `redis://${configs.redis_client.host}:${configs.redis_client.port}`;
// export const redisClient = redis.createClient({
//   url,
// });

const nodes1 = [
  { port: 6380, host: '10.171.3.42' },
  { port: 6380, host: '10.171.3.43' },
  { port: 6380, host: '10.171.3.44' },
  { port: 6380, host: '10.171.3.45' },
  { port: 6380, host: '10.171.3.46' },
  { port: 6380, host: '10.171.3.47' },
  { port: 6380, host: '10.150.3.171' },
  { port: 6380, host: '10.150.3.172' },
  { port: 6380, host: '10.150.3.173' },
  { port: 6380, host: '10.150.3.175' },
  { port: 6380, host: '10.171.1.174' },
  { port: 6380, host: '10.150.3.176' },
];

// const nodes = [
//   { host: '10.150.0.167', port: 6379 },
//   { host: '10.150.0.167', port: 6380 },
//   { host: '10.150.0.167', port: 6381 },
//   { host: '10.150.0.167', port: 6382 },
//   { host: '10.150.0.167', port: 6383 },
//   { host: '10.150.0.167', port: 6384 },
// ];

function _retryStrategy(times) {
  let retry;

  if (times === 1) {
    retry = 1;  // immediate retry
  } else {
    retry = Math.min((times - 1) * 2000, 20000);
  }
  return retry;
}

const options: any = {
  // Cluster-level options
  // Override ioredis defaults.
  clusterRetryStrategy: _retryStrategy,
  enableOfflineQueue: false,                     // ioredis default is true
  scaleReads: 'all',                     // ioredis default is 'master'

  // ioredis defaults - explicitly set for clarity.
  enableReadyCheck: true,
  maxRedirections: 16,
  retryDelayOnFailover: 100,
  retryDelayOnClusterDown: 100,
  retryDelayOnTryAgain: 100,

  // Per Server options
  redisOptions: {
    // Override ioredis defaults.
    enableOfflineQueue: false,           // ioredis default is true   !!! THIS IS THE PROBLEM !!!
    connectTimeout: 2000,            // ioredis default is 10000
    autoResendUnfulfilledCommands: false,           // ioredis default is true
    retryStrategy: _retryStrategy,
    readOnly: true,            // ioredis default is false

    // ioredis defaults - explicitly set for clarity.
    family: 4,
    path: null,
    keepAlive: 0,
    noDelay: true,
    db: 0,
    dropBufferSupport: false,
    enableReadyCheck: true,
    autoResubscribe: true,
    lazyConnect: false,
    keyPrefix: '',
    stringNumbers: false
  }
};
const nodes = [
  { host: '10.171.3.42', port: 6381 },
  { host: '10.171.3.43', port: 6381 },
  { host: '10.171.3.44', port: 6381 },
  // { host: "10.171.3.45", port: 6381 },
  // { host: "10.171.3.46", port: 6381 },
  // { host: "10.171.3.47", port: 6381 },
];

export const redisClient = new Redis.Cluster(nodes);
export const subscriber = redisClient.duplicate();
export const ioredisChat = new Emitter(subscriber);
export const redisClientAuth = new Redis.Cluster(nodes1);
export const subscriberAuth = redisClient.duplicate();

// redisClient
//   .connect()
//   .then((result) => {
//     ;
//   })
//   .catch(() => {
//     ;
//   });
// export const pubClient = new RedisClient({
//   host: configs.redis_client.host,
//   port: configs.redis_client.port,
//   no_ready_check: true,
//   auth_pass: ''
// });

// export const redisClient = subscriber.duplicate();
/**
 * Mssql pool connection
 */
export const mysqlPoolConnection = mysql.createPool(configs.sqlCcaasDB);
// export const ioredis = new Emitter(redisClient);

export const ccaas = mongoose.createConnection(configs.mongouri.ccaas ? configs.mongouri.ccaas : '', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: true,
});
ccaas.then(() => {
  console.info('ccaas: Database Connected successfully!');
});
ccaas.catch(() => {
  console.info('ccaas: Database Connection failed!');
  process.exit(0);
});

export const notificationMessages = (data: any, ext: any) => {
  ioredisChat.to(ext.toString()).emit('notification', data);
};
