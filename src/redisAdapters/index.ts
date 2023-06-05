import { ioredisChat, redisClient, redisClientAuth, subscriber, subscriberAuth } from "../plugins/db";

import { ChatFlowAdapters } from "../chatflow";
// import redis  from 'redis';
import _ from "lodash";

// import {IOServer} from '../socketio-redis/socket-pubsub';
// import { redisClient } from '../plugins/db';
// import { createClient } from 'redis';
// import redis, { RedisClient } from 'redis';
// import { json } from 'sequelize/types';
// import { createAdapter, RedisAdapter } from 'socket.io-redis';
const RedisAdapter = require("socket.io-redis");

export class RedisAdapters {
  private adaptor: any;
  private sub: any;
  private pub: any;
  private authpub: any;
  private authsub: any;
  public static sessionInstances: any;

  constructor() {
    // const config: any = { host: '46.43.144.56', port: 6379, no_ready_check: true, auth_pass: 'A9t1QNEMsWL6+msYxhRxL8hFYoA' };

    /*if (process.env.NODE_ENV === "staging") {
      redisConfig.no_ready_check = config.redis_client.no_ready_check;
      redisConfig.auth_pass = config.redis_client.auth_pass;
    }*/

    // const url = `redis://${process.env.REDIS_HOST}:${6379}`;
    // const url = `redis://${configs.redis_client.host}:${6379}`;
    // const pubClient: any = redis.createClient({
    //   url,
    // });

    const pubClient = redisClient;

    const subClient: any = subscriber;
    const pubClientAuth = redisClientAuth;

    // const pubClient: any = pubClient.duplicate();

    subClient.on("error", (er) => {
      console.trace("Here I am");
      console.error(er.stack, "errrrr>>>>>>");
    });

    pubClient.on("error", (err) => {
      console.log(err);
    });
    pubClient.on("message", (err) => {
      console.log(err);
    });
    pubClient.on("message_buffer", (err) => {
      console.log(err);
    });
    pubClient.on("pmessage", (err) => {
      console.log(err);
    });
    pubClient.on("subscribe", (err) => {
      console.log(err);
    });
    pubClient.on("psubscribe", (err) => {
      console.log(err);
    });
    RedisAdapters.sessionInstances = {} as any;
    this.sub = subClient;
    this.pub = pubClient;
    this.authpub = pubClientAuth;

    this.adaptor = RedisAdapter({ pubClient, subClient });
    // this.BLPOPPER();
  }

  public push(channel: any, msg: any): void {
    this.pub.rpush(channel, JSON.stringify({ msg }));
  }

  public createSet(key: any, data: any) {
    this.pub.sadd(key, data);
  }

  public setVariableValue(name: any, keyName: any, keyValue: any) {
    this.pub.hset(name, keyName, keyValue);
  }

  public getapiData() {
    return new Promise((resolve, reject) => {
      try {
        this.pub.hgetall("apiValues", (err, results) => {
          if (results) {
            resolve(results);
          } else {
            reject(err);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  public getValuefromSet(key: any) {
    return new Promise((resolve, reject) => {
      this.pub.smembers(key, (err, data) => {
        resolve(data);
      });
    });
  }

  public getFlow(key: any) {
    return new Promise((resolve, reject) => {
      this.sub.get(key).then((result) => {
        resolve(result);
      });
    });
  }

  public publishMessage(key: any) {
    console.log(key);
    this.pub.publish(process.env.RESPONSECHANNEL, key);
    // this.BLPOP();
  }
  public publishMessageChat(key: any) {
    this.pub.rpush(process.env.REQUESTCHANNEL, key);
    // this.BLPOP();
  }
  public getredisAdapter(): any {
    return this.adaptor;
  }

  public removeValuebyKey(key: any) {
    return new Promise((resolve, reject) => {
      this.pub.del(key, (err: any, reply: any) => {
        resolve(1);
      });
    });
  }

  public async BLPOP(res: any, domainId: any) {
    this.pub.blpop(`${domainId}_${process.env.CHATRESPONSECHANNEL}`, 1, async (err: any, resp: any) => {
      if (resp !== null) {
        console.log(resp, "pop response");
        res.status(200).send({ statusCode: 200, message: "Available agent", Result: resp });
        return;
      }
      this.BLPOP(res, domainId);
    });
  }

  public handleSessionBasedInstances(data: any) {
    const parsedData = JSON.parse(data);
    if (parsedData?.call_state === "init") {
      const newObject = new ChatFlowAdapters(this);
      RedisAdapters.sessionInstances[parsedData?.session_id] = newObject;
      newObject?.ChatFlowHandler(data);
    } else if (parsedData?.disconnectedBy) {
      RedisAdapters.sessionInstances[parsedData?.session_id]?.ChatFlowHandler(data);
      delete RedisAdapters.sessionInstances[parsedData?.session_id];
    } else {
      RedisAdapters.sessionInstances[parsedData?.session_id]?.ChatFlowHandler(data);
    }
  }

  public async BLPOPPER() {
    this.pub?.blpop(`${process.env.CHATRESPONSECHANNEL}1000`, async (data: any) => {
      if (data !== null && data?.length > 1) {
        const resultData = data?.at(1);
        this.handleSessionBasedInstances(resultData);
      }
      this.BLPOPPER();
    });
  }

  public getValuefromredis(key: any) {
    return new Promise((resolve, reject) => {
      this.authpub.get(key, (err: any, data: any) => {
        resolve(data);
      });
    });
  }

  public emailRpush(data: any, sessionId: any) {
    const emailData = {
      domain_id: data.domainId,
      channelType: "Email",
      queueName: data.queueName,
      session_id: sessionId,
    };
    this.pub.rpush(process.env.REQUESTCHANNEL, emailData);
  }

  public emailBlpop(data: any) {
    return new Promise((resolve, reject) => {
      this.pub.blpop("CCAAS_email_response", 1, async (err: any, res: any) => {
        if (res !== null) {
          const agentRes: any = res[0];
          ioredisChat.to(`${data.domainId}_${data.ext}`).emit("email_channel_emit", res);
          return res;
        }
        this.emailBlpop(data);
      });
    });
  }
}
