import * as jwt from "jsonwebtoken";

import { Server, Socket } from "socket.io";
import {
  chatUpdateDao,
  coChatUpdateDao,
  createCallSession,
  createSession,
  getAllMessageId,
  getChatHistory,
  getChatSessionIdDao,
  getMessageWebChat,
  sendMessageToCoChat,
  storeCochatDetailsByIDDao,
  storeCustomerDetails,
  storeMessageHistory,
  updateMessage,
} from "../dao/chat.dao";
import { createEmailSessionHistory, deleteImapMail } from "../dao/emailChannel";
import { getBotDetails, getchanneldata } from "../dao/channeldata.dao";
import { mysqlPoolConnection, redisClient } from "../plugins/db";
import { result, update } from "lodash";

import { RedisAdapter } from "socket.io-redis";
import { RedisAdapters } from "../redisAdapters";
import ShortUniqueId from "short-unique-id";
import { agentExtDao } from "../dao/notification.dao";
import axios from "axios";
import bluebird from "bluebird";
import { configs } from "../config/app";
import { getAgentList } from "../dao/callflow.dao";
import { getAgentListByDomianId } from "../dao/dispositionStatus";
import { literal } from "sequelize/types";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

// const { createClient } = require('redis');
export class IOServer {
  private io: any;
  private redisadaptor: RedisAdapters = new RedisAdapters();
  private node: any;
  private edge: any;
  private endPointUrl: any;
  private apiMethod: any;
  private accessToken: any;
  private callflowid: any;
  private pub: any;
  private sub: any;
  private getVariableSign: any;
  private getVariableKey: any;
  private customInputTarget: any;
  private room: any;
  private sessionId: any;
  private coChatSessionId: any;
  private webChatSessionId: any;
  private coChatChannelId: any;
  private apiBody: any;
  private customInputTargetEdge: any;
  private LooptargetEdge: any;
  constructor(httpServer: any) {
    this.io = new Server(httpServer, {
      path: "/ccascall-service",
      cors: {
        origin: "*",
        credentials: true,
      },
      pingInterval: 25000,
      pingTimeout: 60000,
    });

    // const url = 'redis://10.150.0.167:6379';
    // const redis = require('redis');

    // let redisNotReady = true;
    // const redisClients = createClient({
    //   url,
    //   password: ""
    // });
    // const subClient: any = redisClients.duplicate();
    // redisClients.on('error', (err) => {
    //   ;
    // });
    // redisClients.on('connect', (err) => {
    //   ;
    // });
    // redisClients.on('ready', (err) => {
    //   redisNotReady = false;
    //   ;
    // });

    const subClient = redisClient.duplicate();
    subClient.blpop("ccaasairesponse21", 0, (err, reply) => {
      console.log(err, reply);
    });

    this.connectionhandler();
    this.addAdaptor();
    this.addAuthMiddleware();
    bluebird.promisifyAll(redisClient);
  }

  private addAdaptor(): void {
    this.io.adapter(this.redisadaptor.getredisAdapter());
  }

  private addAuthMiddleware(): void {
    this.io.use((socket: any, next: any) => {
      if (!socket?.handshake?.auth?.token) {
        next();
        return;
      }
      const socketData: any = jwt.decode(socket.handshake.auth.token);
      try {
        if (!socketData.sipLoginId || !socketData.domainId || !socketData.deviceId || !socket.handshake.auth.token) {
          const error_report = {
            message: "Unauthorized- Query param missing",
            code: 403,
          };
          next(new Error(JSON.stringify(error_report)));
        } else {
          try {
            const decoded: any = jwt.verify(socket.handshake.auth.token, configs.jwtsecret);
            if (parseInt(decoded.sipLoginId, 10) === parseInt(socketData.sipLoginId, 10)) {
              this.redisadaptor
                .getValuefromredis(`${decoded.sipLoginId}_${decoded.source}`)
                .then((res: string) => {
                  if (res !== null && res !== undefined) {
                    const checkToken = JSON.parse(res ?? "null");
                    if (checkToken?.token === socket.handshake.auth.token) {
                      next();
                    } else {
                      const error_report = {
                        message: "Unauthorized1",
                        code: 403,
                      };
                      next(new Error(JSON.stringify(error_report)));
                    }
                  } else {
                    const error_report = {
                      message: "Unauthorized2",
                      code: 403,
                    };
                    next(new Error(JSON.stringify(error_report)));
                  }
                })
                .catch((err: any) => {
                  const error_report = {
                    message: "Unauthorized - Token not exist",
                    code: 403,
                  };
                  next(new Error(JSON.stringify(error_report)));
                });
            } else {
              const error_report = {
                message: "Unauthorized - sipLoginId mismatch",
                code: 403,
              };
              next(new Error(JSON.stringify(error_report)));
            }
          } catch (e: any) {
            const error_report = {
              message: "Unauthorized - Invalid signature",
              code: 403,
            };
            next(new Error(JSON.stringify(error_report)));
          }
        }
      } catch (e: any) {
        const error_report = {
          message: "Unauthorized",
          code: 403,
        };
        next(new Error(JSON.stringify(error_report)));
      }
    });
  }

  private connectionhandler(): void {
    this.io.on("connection", async (socket: Socket) => {
      const uid = new ShortUniqueId({ length: 22 });

      // *** For WebChat Connection ***//
      socket.on("joinWebChat", async (room: any) => {
        socket.join(`${room.webChatSessionId}`);
        socket.join(`${room.domainId}_${room.ext}`);
        const data: any = { agentDetails: JSON.stringify(room) };
        data.agentDetails = room.ext;
        createSession(data, room.webChatSessionId);
        this.io
          .of("/")
          .to([`${room.webChatSessionId}`, `${room.domainId}_${room.ext}`])
          .emit("webChatConnected", {
            agentId: `${room.domainId}_${room.ext}`,
            userId: `${room.webChatSessionId} `,
            sender: room?.sender,
            status: "Connection establish sucessfully",
          });
      });
      socket.on("OneToOneChatSend", async (msg: any) => {
        let messages: any;
        const messageList: any = { message: msg };
        if (msg?.isCustomer === true) {
          messages = { userText: messageList };
        } else if (msg?.isagentname === true) {
          messages = { agentNameVisible: messageList };
        } else if (msg?.TimeOutStatus === true) {
          messages = { timeOutVisible: messageList };
        } else {
          messages = { agentText: messageList };
        }
        const getMessage: any = await getMessageWebChat(msg?.sessionId);
        let newMessage: any;
        if (!getMessage[0]?.message) {
          newMessage = [messages];
        } else {
          const parsedMessage = getMessage[0]?.message ? JSON.parse(getMessage[0]?.message ?? "null") : [];
          if (Array.isArray(parsedMessage)) {
            parsedMessage?.push(messages);
            newMessage = parsedMessage;
          }
        }
        const stringifiedMessage = { message: newMessage[0] };
        createSession(stringifiedMessage, msg?.sessionId);
        this.io.of("/").to(msg?.to).emit("OneToOneChatReceive", msg);
      });
      socket.on("typingText", async (data) => {
        this.io.of("/").to(`${data.domainId}_${data.ext}`).emit("customerTyping", data);
      });

      socket.on("markAsSeen", async (data) => {
        this.io.of("/").to(`${data.domainId}_${data.ext}`).emit("markAsSeen", data);
      });

      socket.on("agentDeclineRequest", async (data) => {
        this.io.of("/").to(data?.to).emit("requestDecline", data);
      });
      socket.on("agentAcceptRequest", async (data) => {
        const agentConnectedTime = { agentConnectTime: Date.now() };
        createSession(agentConnectedTime, data?.to);
        this.io.of("/").to(data?.to).emit("requestAccept", data);
      });
      socket.on("updateDispostionStatus", async (data) => {
        let messages: any;
        data.TimeOutMessage = "------This Session is Closed------";
        data.sessionClosedTime = Date.now();
        const messageList: any = { message: data };
        messages = { timeOutVisible: messageList };
        const getMessage: any = await getMessageWebChat(data?.sessionId);
        let newMessage: any;
        if (!getMessage[0]?.message) {
          newMessage = [messages];
        } else {
          const parsedMessage = JSON.parse(getMessage[0]?.message ?? "null") ?? [];
          parsedMessage.push(messages);
          newMessage = parsedMessage;
        }
        const stringifiedMessage = { message: newMessage, chatSession: 1, sessionEndTime: Date.now(), agentDisconnectTime: Date.now() };
        createSession(stringifiedMessage, data?.sessionId);
      });
      socket.on("sessionTimeOut", async (data) => {
        let messages: any;
        const messageList: any = { message: data };
        messages = { timeOutVisible: messageList };
        const getMessage: any = await getMessageWebChat(data?.sessionId);
        let newMessage: any;
        if (!getMessage[0]?.message) {
          newMessage = [messages];
        } else {
          const parsedMessage = JSON.parse(getMessage[0]?.message ?? "null") ?? [];
          parsedMessage.push(messages);
          newMessage = parsedMessage;
        }
        const stringifiedMessage = { message: newMessage, chatSession: 1, sessionEndTime: Date.now(), agentDisconnectTime: Date.now() };
        createSession(stringifiedMessage, data?.sessionId);
      });
      socket.on("updateChatSession", async (data) => {
        const chatSessionStatus = { chatSession: 0 };
        createSession(chatSessionStatus, data?.sessionId);
      });
      // *** End of WebChat Connection ***/

      // *** For Email Channel*/
      socket.on("acceptEmailNotify", async (data) => {
        await createEmailSessionHistory(data, data.sessionId);
        await deleteImapMail(data);
      });
      // **End Email Channel */
      socket.on("markAsReadRequest", async (data: any) => {
        const emitterMessage = { markAsRead: data.markAsRead };
        createSession(emitterMessage, data?.sessionId);
      });

      socket.join(socket.handshake.auth.id);

      socket.on("joinCoChat", async (room) => {
        const SessionId: any = uid();
        this.coChatChannelId = room.channelId;
        socket.join(`${this.coChatChannelId}`);
        createSession(room, SessionId);
        this.io.of("/").to(`${this.coChatChannelId}`).emit("Connected", { SessionId, status: "Connection establish sucessfully" });
        // this.room = `${room.ipAddress}${room.channelId}${coChatSessionId}`;
      });

      socket.on("addUserToCoChat", async (data: any) => {
        socket.join(data.room);
        const broadCastDetails: any = {
          messageType: "Broadcast",
          message: `${data.user.addedBy} added ${data.user.newUser} to this chat.`,
          details: data.details,
        };
        const updateData: any = {
          coChatSessionId: data.coChatSessionId,
          details: data.details,
          userConnectTime: new Date().getTime() / 1000,
          channelId: this.room.channelId,
        };
        await coChatUpdateDao(updateData, { channelId: this.coChatChannelId });
        const allCoChatMessage: any = await getAllMessageId(this.coChatChannelId, socket.handshake.auth.domainId);
        this.io.of("/").to(data.room).emit("allCoChatMessage", allCoChatMessage);
        this.io.to(data.room).emit("broadcastMessage", broadCastDetails);
        this.io.of("/").to(data.room).emit("userConnected", data.room);
      });

      socket.on("sendMessageToCoChat", async (msg: any) => {
        if (msg?.message?.trim()?.length) {
          await storeCochatDetailsByIDDao(msg);
          this.io.of("/").to(msg?.room).emit("onMessageToCoChat", { msg });
        }
      });
      // socket.join(socket.handshake.auth.id);
      const contype = "";
      // socket.join(socket.handshake.query.sip_id);
      socket.on("join-room", async (room: any) => {
        const sessionId: any = uid();
        this.sessionId = sessionId;
        socket.join(`${room.ipAddress}${room.webChatId}${sessionId}`);
        createSession(room, sessionId);
        this.io.of("/").to(`${room.ipAddress}${room.webChatId}${sessionId}`).emit("Connected", { sessionId, status: "Connection establish sucessfully" });
        this.room = `${room.ipAddress}${room.webChatId}${sessionId}`;
        const callflowconfig = "XjNS7YHvF";
        const channeldata: any = await getchanneldata(callflowconfig);
        this.callflowid = channeldata[0]?.callFlowId;
        this.node = await redisClient.get(`${this.callflowid}nodes`);
        this.edge = await redisClient.get(`${this.callflowid}edges`);

        // this.node = await redisClient.get(`${this.callflowid}nodes`);
        // this.edge = await redisClient.get(`${this.callflowid}edges`);
        this.node = JSON.parse(this.node);
        this.edge = JSON.parse(this.edge);
        const entrynode: any = this.node[0];
        const nodeid: any = entrynode.id;
        const targetedge = gettargetedges(nodeid, this.edge);
        // await storeCustomerDetails(sessionId, room?.userDetails.phoneNumber);
        initstep(this.io, this.node, this.edge, targetedge[0].target, room, this.callflowid, this.sessionId);
      });

      socket.on("registerToRoom", (roomValue: any) => {
        socket.join(roomValue);
      });

      socket.on("assignActivityEmitter", async (data: any) => {
        const agentExt = data.assignedTo[0];
        this.io.of("/").to(`${data?.domainId}_${agentExt?.ext}`).emit("assignActivityListener", { data });
      });

      socket.on("init_transfer", (event: any) => {
        this.redisadaptor.publishMessage(JSON.stringify(event));
        //  this.io.to(event.ext.toString()).emit("init_transfer", "Returned");
      });

      socket.on("call_merge", (event: any) => {
        if (event?.ext) {
          this.io.to(event?.ext?.toString()).emit("callMerged", event);
        }
      });

      socket.on("leave_call_primary", (event: any) => {
        if (event?.ext) {
          this.io.to(event?.ext?.toString())?.emit("leave_call", event);
        }
      });

      socket.on("biometricsEnroll", (event: any) => {
        this.redisadaptor.publishMessage(JSON.stringify(event));
      });

      socket.on("bwl_switch", (event: any) => {
        this.redisadaptor.publishMessage(JSON.stringify(event));
      });

      socket.on("updatedstatuslist", async (event: any) => {
        const results: any = await getAgentListByDomianId(event);
        const extractedData = results?.map((data: any) => `${data?.domainId}_${data?.ext}`);
        this.io.to(extractedData)?.emit("updatedstatuslist", event);
      });

      socket.on("send-message", async (msg: any) => {
        if (msg?.message?.trim() !== "") {
          storeMessageHistory(msg);
          this.io.of("/").to(msg.room).emit("send-message", { msg });
          if (this.getVariableSign) {
            this.redisadaptor.setVariableValue("apiValues", this.getVariableKey, msg?.message);
            this.getVariableKey = "";
            this.getVariableSign = false;
            initstep(this.io, this.node, this.edge, this.customInputTarget, this.room, this.callflowid, this.sessionId);
          }
        }
      });

      socket.on("updateLoginStatus", async (data: any) => {
        this.io.of("/").to(`${data?.domainId}_${data.ext}`).emit("newLoginUpdate", data);
      });

      socket.on("updatestate_backend", async (data: any) => {
        console.log("EMITTING EVENT FOR STATE UPDATE: ", data);
        try {
          const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
          const updateq =
            "UPDATE user SET updatedAt = ?, isVoice = ?, isVoiceCallTransfer = ?, isChat = ?, isChatTransfer = ?, isEmail = ?, isEmailTransfer = ?, stateTimer = ?, statusName = ? WHERE ext = ? AND domainId = ? ";
          const params = [
            updatedAt,
            data?.isVoice ?? 0,
            data?.isVoiceCallTransfer ?? 0,
            data?.isChat ?? 0,
            data?.isChatTransfer ?? 0,
            data?.isEmail ?? 0,
            data?.isEmailTransfer ?? 0,
            data?.stateTime ?? Math.floor(Date.now() / 1000),
            data?.statusName ?? "Offline",
            data?.ext ?? "",
            data?.domainId ?? 0,
          ];
          mysqlPoolConnection.query(updateq, params, (err: any, _: any) => {
            if (err) {
              console.log({ "ERROR OCCURRED": err });
            } else {
              this.io.of("/").to(`${data?.domainId}_${data.ext}`).emit("updatedstatus", data);
              const userQuery = `SELECT * FROM user WHERE ext = ${data?.ext ?? null} AND domainId = ${data?.domainId ?? null}`;
              mysqlPoolConnection.query(userQuery, (error: any, response: any) => {
                if (response && response.length > 0) {
                  const results = response[0];
                  this.io.of("/").emit("userStatusUpdated", { email: results?.emailId ?? "", status: data?.userstatedata?.statusName ?? "Offline" });
                  if (["Ready"].includes(data?.statusName)) {
                    this.redisadaptor.push(`${data?.domainId}_${process.env.AGENTTRACKERCHANNEL}`, {
                      domainId: data?.domainId,
                      email: results?.emailId ?? "",
                      status: results?.statusName,
                      routingProfile: results?.routing_profile,
                      channelType: data?.channelType ?? "Call",
                    });
                  }
                }
              });
            }
          });
        } catch (error: any) {
          console.log(error);
        }
      });

      // socket.on("updatestate", async (data: any) => {
      //   try {
      //     const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      //     const updateq =
      //       "UPDATE user SET domainId = ?, updatedAt = ?, isVoice = ?, isVoiceCallTransfer = ?, isChat = ?, isChatTransfer = ?, isEmail = ?, isEmailTransfer = ?,stateTimer = ?, statusName = ? WHERE emailId = ? ";
      //     const params = [
      //       data?.userstatedata?.domainId ?? 0,
      //       updatedAt,
      //       data?.userstatedata?.isVoice ?? 0,
      //       data?.userstatedata?.isVoiceCallTransfer ?? 0,
      //       data?.userstatedata?.isChat ?? 0,
      //       data?.userstatedata?.isChatTransfer ?? 0,
      //       data?.userstatedata?.isEmail ?? 0,
      //       data?.userstatedata?.isEmailTransfer ?? 0,
      //       data?.userstatedata?.stateTime ?? null,
      //       data?.userstatedata?.statusName ?? "Offline",
      //       data?.email ?? "",
      //     ];
      //     mysqlPoolConnection.query(updateq, params, (err, response) => {
      //       if (err) {
      //         console.log({ err });
      //       } else {
      //         this.io.of("/").to(`${data?.userstatedata?.domainId}_${data.ext}`).emit("updatedstatus", data.userstatedata.statusName);
      //         this.io.of("/").emit("userStatusUpdated", { user: data?.email ?? "", status: data?.userstatedata?.statusName ?? "Offline" });
      //         this.redisadaptor.push(process.env.AGENTTRACKERCHANNEL, {
      //           domainId: data?.userstatedata?.domainId,
      //           email: data?.email,
      //           status: data?.userstatedata?.statusName,
      //         });
      //       }
      //     });
      //   } catch (error) {
      //     console.log(error);
      //   }
      // });

      socket.on("waitingQueueUpdate", (data: any) => {
        this.io.of("/").emit("waitingQueueUpdate", data);
      });

      // update table user columns domainId, updatedAt, isVoice, isVoiceCallTransfer, isChat, isChatTransfer, isEmail, isEmailTransfer, stateTimer, statusName, WHERE emailId with data object

      socket.on("dtmfResponse", (values: any) => {
        const filteredEdgeObj = this?.edge?.filter((value: any) => {
          if (value.sourceHandle === values.name) {
            return values;
          }
        });
        // playprompt(this.io, filteredNodeObj,  this.node, this.edge, values.roomId, values.sessionId);
        // doSendDtmfResponse(this.io, filteredNodeObj,  this.node, this.edge, values.roomId, values.sessionId);
        initstep(this.io, this.node, this.edge, filteredEdgeObj[0].target, values.roomId, this.callflowid, values.sessionId);
      });
      const doCallgetApi = async () => {
        this.apiBody = await this.redisadaptor.getapiData();
        const request = require("request");
        if (this.apiMethod === "post") {
          const options = {
            method: this.apiMethod,
            url: `${this.endPointUrl}`,
            body: this.apiBody,
            headers: {
              Authorization: this.accessToken,
            },
            json: true,
          };
          request(options, (error, response) => {
            if (error) {
              throw new Error(error);
            }
          });
        }
      };

      socket.on("updateOnlineStatus", async (msg: any) => {
        const updateData: any = {
          sessionId: msg.sessionId,
          onlineStatus: msg.onlineStatus,
        };
        await chatUpdateDao(updateData);
        this.io.of("/").to(msg.room).emit("updateOnlineStatus", { msg });
      });

      socket.on("getMessageList", async (message: any) => {
        const messageHistory: any = await getChatHistory(message.sessionId);
        this.io.of("/").to(message.room).emit("messageHistory", messageHistory);
      });

      socket.on("getMessageListChatBot", async (message: any) => {
        const messageHistory: any = await getChatHistory(message.sessionId);
        this.io.of("/").to(message.uuid).emit("messageHistory", messageHistory);
      });

      socket.on("reconnect", (message: any) => {
        socket.join(message);
      });
      socket.on("agentmessage", (message: any) => {
        storeMessageHistory(message);
        this.io.to(message.room).emit("recievemessage", { message });
      });

      socket.on("readStatus", async (message: any) => {
        const UpdateData: any = {
          id: message.Id,
        };
        if (message.from === "agent") {
          UpdateData.agentState = 2;
          message.agentState = 2;
        } else {
          UpdateData.customerState = 2;
          message.customerState = 2;
        }
        await updateMessage(UpdateData);
        this.io.to(message.room).emit("readStatus", { message });
      });

      socket.on("deliveryStatus", async (message: any) => {
        const UpdateData: any = {
          id: message.Id,
        };
        if (message.from === "agent") {
          UpdateData.agentState = 1;
          message.agentState = 1;
        } else {
          UpdateData.customerState = 1;
          message.customerState = 1;
        }
        await updateMessage(UpdateData);
        this.io.to(message.room).emit("deliveryStatus", { message });
      });

      socket.on("joinagent", async (data: any) => {
        socket.join(data.room);
        const broadCastDetials: any = {
          messageType: "Broadcast",
          message: `You are connected with ${data.agentDetails.caller_id} `,
          agentDetails: data.agentDetails,
        };
        const updateData: any = {
          sessionId: data.sessionId,
          agentDetails: data.agentDetails.ext,
          agentConnectTime: new Date().getTime() / 1000,
        };
        await chatUpdateDao(updateData);
        const messageHistory: any = await getChatHistory(data.sessionId);
        this.io.of("/").to(data.room).emit("messageHistory", messageHistory);
        this.io.to(data.room).emit("broadcastMessage", broadCastDetials);
        this.io.of("/").to(data.room).emit("agentconnected", data.room);
      });

      socket.on("joinCall", async (data: any) => {
        socket.join(data.sessionId);
        const messageHistory: any = await getChatHistory(data.sessionId);
        this.io.of("/").to(data.sessionId).emit("messageHistory", messageHistory);
      });

      socket.on("dtmfTimeoutError", (value: any) => {
        const targetEdgeFromResponse: any = this.customInputTargetEdge.filter((targetEdge: any) => {
          if (targetEdge.sourceHandle === value) {
            return targetEdge;
          }
          this.customInputTargetEdge = "";
        });
        initstep(this.io, this.node, this.edge, targetEdgeFromResponse[0].target, this.room, this.callflowid, this.sessionId);
      });

      socket.on("dtmfTimeOutCompelete", (value: any) => {
        const targetEdgeFromLoopResp: any = this.LooptargetEdge.filter((targetEdge: any) => {
          if (targetEdge.sourceHandle === value) {
            return targetEdge;
          }
          this.LooptargetEdge = "";
        });
        initstep(this.io, this.node, this.edge, targetEdgeFromLoopResp[0].target, this.room, this.callflowid, this.sessionId);
      });

      const gettargetedges = (edgeid, edge) => {
        return edge.filter((list: any) => {
          if (list.source === edgeid) {
            return list;
          }
        });
      };

      const initstep = async (io, node, edge, targetedge, room, callflowid, sessionId) => {
        //  for (let f = 0; f < targetedge.length; f++) {
        const targetnode = gettargetnodes(targetedge, node);
        if (targetnode[0].type === "playPrompt") {
          playprompt(this.io, targetnode[0], node, edge, room, sessionId);
          const targetEdge = gettargetedges(targetnode[0].id, edge);
          if (targetEdge[0]) {
            initstep(io, node, edge, targetEdge[0]?.target, room, callflowid, sessionId);
          }
        }
        if (targetnode[0].type === "makeApiCall") {
          (this.endPointUrl = targetnode[0].data.endPointUrl), (this.apiMethod = targetnode[0].data.getMethodApi);
          this.accessToken = targetnode[0].data.apiHeaders[0].value;
          const targetEdge = gettargetedges(targetnode[0].id, edge);
          doCallgetApi();
          initstep(io, node, edge, targetEdge[0].target, room, callflowid, sessionId);
        }
        if (targetnode[0].type === "customInput") {
          playprompt(this.io, targetnode[0], node, edge, room, this.sessionId);
          const targetEdge = gettargetedges(targetnode[0].id, edge);
          this.customInputTargetEdge = targetEdge;
          if (targetEdge[0].sourceHandle === "getVariable") {
            this.getVariableSign = true;
            this.getVariableKey = targetnode[0].data.keyVariable;
            this.customInputTarget = targetEdge[0].target;

            // initstep(io, node, edge, targetEdge[0].target, room, callflowid, sessionId);
          }
          if (targetnode[0].data.inputType === 2) {
            // connectbot(this.io, targetnode[0], room, callflowid, sessionId);
            connectToBot(this.io, targetnode[0], room, callflowid, sessionId);
          }
        }

        if (targetnode[0].type === "transferToQueue") {
          const targetNode: any = await getAgentList(targetnode[0].data.transferTo);
          const sessionData = await getChatSessionIdDao(sessionId);
          const sesId: any = sessionId;
          const rdata = {
            roomname: `${room.ipAddress}${room.webChatId}${sessionId}`,
            sessionId: sesId,
            sessionDetails: sessionData,
          };
          const updateData: any = {
            sessionId,
            isBot: false,
            botEndTime: new Date().getTime() / 1000,
          };
          await chatUpdateDao(updateData);
          if (targetNode.length) {
            io.to(targetNode[0]?.ext?.toString()).emit("agentConnect", rdata);
          }
        }
        if (targetnode[0].type === "loop") {
          socket.emit("loopData", targetnode[0].data);
          const targetEdge = gettargetedges(targetnode[0].id, edge);
          this.LooptargetEdge = targetEdge;
          const loopTargetEdge: any = targetEdge.filter((list: any) => {
            return list.sourceHandle === targetnode[0].type;
          });
          initstep(io, node, edge, loopTargetEdge[0]?.target, this.room, callflowid, sessionId);
        }
      };

      const connectToBot = (io, bt, room, callflowid, sessionId) => {
        const channelDetails = bt.data.botDetails.channelList.filter((list: any) => {
          return list.channelType === "WEB";
        });
        const sendDataToBot = {
          channel_id: channelDetails[0].channelId,
          speaker: "",
          text: "hi pershiba",
          Type: "WEBCHAT",
          session_id: sessionId,
          agent_id: channelDetails[0].agentId,
          status: "on_call",
        };

        redisClient.rpush("ccaasai21", JSON.stringify(sendDataToBot), (err, reply) => {
          console.log(err, reply);
        });
        // redisClient.RPUSH('ccaasai21', JSON.stringify(sendDataToBot));
      };

      const connectbot = async (io, bt, room, callflowid, sessionId) => {
        const botData: any = await getBotDetails(bt.data.botChannelId);
        const updateData: any = {
          sessionId,
          botDetails: botData,
          botStartTime: new Date().getTime() / 1000,
        };
        await chatUpdateDao(updateData);
        socket.on("send-message", async (msg: any) => {
          // storeMessageHistory(msg);

          const updateCustomerNumber: any = {};
          if (msg.isCustomerDetails) {
            (updateCustomerNumber.sessionId = sessionId), (updateCustomerNumber.customerDetails = msg.userDetails.phoneNumber);
            await storeCustomerDetails(sessionId, msg.userDetails.phoneNumber);
          }
          await chatUpdateDao(updateCustomerNumber);
          const requestbody = {
            channel_uuid: bt.data.botChannelId,
            user: {
              uuid: room.ipAddress,
              custom_properties: {
                callflowid,
                phone_number: room.webChatId,
                channel: "Chat",
                uuid: bt.data.botChannelId,
                call_session_id: room.ipAddress,
                nodeData: JSON.stringify(bt),
                messageData: JSON.stringify(msg),
                formData: JSON.stringify(msg.userDetails),
                skill_name: "",
              },
            },
            message: {
              text: msg?.message,
            },
          };
          this.io.of("/").to(`${room.ipAddress}${room.webChatId}${sessionId}`).emit("typing", true);
          axios
            .post(`https://ai.unifiedring.co.uk/bot_connector_webhooks/${bt.data.botChannelUrlId}/message.json`, requestbody)
            .then(async (res) => {
              // getbotreponse();
            })
            .catch((e) => {
              console.log(e);
            });
        });
      };

      const gettargetnodes = (nodeid, node) => {
        return node.filter((list: any) => {
          if (list.id === nodeid) {
            return list;
          }
        });
      };

      const playprompt = (io, targetnode, node, edge, room, sessionId) => {
        const sendmsg = {
          sessionId,
          time: `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`,
          timeStamp: new Date().getTime() / 1000,
          from: "Vectone Bot",
          to: "customerDetails",
          companyId: "23334",
          domainId: "4323",
          id: uuidv4(),
          isBot: true,
          message: targetnode.data.chatMessage ? targetnode.data.chatMessage : targetnode?.data?.message,
          nodeData: targetnode,
          type: targetnode.type,
        };
        io.of("/").to(this.room).emit("send-message", { sendmsg });

        // io.of('/').to(room).emit('send-message', { sendmsg });
      };
      const doSendDtmfResponse = (io, targetnode, node, edge, room, sessionId) => {
        const sendmsg = {
          sessionId,
          time: `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`,
          timeStamp: new Date().getTime() / 1000,
          from: "Vectone Bot",
          to: "customerDetails",
          companyId: "23334",
          domainId: "4323",
          id: uuidv4(),
          isBot: true,
          message: targetnode[0].data.chatMessage ? targetnode[0].data.chatMessage : targetnode[0]?.data?.message,
          nodeData: targetnode,
          type: targetnode.type,
        };
        io.of("/").to(room).emit("send-message", { sendmsg });
      };

      const getnextnode = (nodeid, node) => {
        return node.filter((list: any) => {
          if (list.id === nodeid) {
            return list;
          }
        });
      };
    });

    /* private callflowhandler(): void {
      const url = `redis://${configs.redis_client.host}:${configs.redis_client.port}`;
      const redisClient = redis.createClient({
        url
      });

      const subscriber = redisClient.duplicate();
      subscriber.on('message', async (req: any, channel: any) => {
        ;
        const channelId = JSON.parse(channel);
        const channeldata: any = await getchanneldata(channelId.ddi);
        const callflowid = channeldata[0]?.callFlowId;
        let node = await redisClient.getAsync(`${callflowid}nodes`);
        let edge: any = await redisClient.getAsync(`${callflowid}edges`);
        node = JSON.parse(node);
        edge = JSON.parse(edge);
        const entrynode: any = node[0];
        const nodeid: any = entrynode?.id;

        if (channelId.type !== 'disconnect' && channelId.req_type === 'ACD') {
          if (channelId?.response === 'success') {
            ;
            const targetedge = await gettargetedges(channelId.id, edge);
            const targetnode = await gettargetnodes(targetedge[0].target, node);
            const currentNodeData: any = targetnode[0].data;
            if (channelId.type === 'customInput') {
              const currentNode: any = gettargetnodes(channelId.id, node);
              if (currentNode[0].data.inputType === '1') {
                const customInputmMessage: any = {
                  sessionId: channelId.session_id,
                  to: 'BOT',
                  from: channelId.cli,
                  message: channelId.value,
                  messageType: 'TEXT',
                  domainId: channelId.domain_id,
                  timeStamp: new Date().getTime() / 1000,
                  id: uuidv4()
                };
                storeCallHistory(customInputmMessage);
                const edgeData = await getCustomInputResponse(targetedge, channelId);
                const targetnodes = await gettargetnodes(edgeData[0].target, node);
                const publisher = redisClient.duplicate();
                targetnodes[0].session_id = channelId.session_id;
                if (targetnodes[0].type === 'setWorkingQueue') {
                  const agentDetials: any = await getAgentList(targetnode[0].data.setQueue);
                  targetnodes[0].data.agentDetials = agentDetials[0];
                  publisher.publish('CCAAS_calls_response', JSON.stringify(targetnodes[0]));
                }else {
                  const message:any = {
                    sessionId: channelId.session_id,
                    from: 'BOT',
                    to: channelId.cli,
                    message: targetnode[0].data.message,
                    messageType: 'TEXT',
                    domainId: channelId.domain_id,
                    timeStamp: new Date().getTime() / 1000,
                    id: uuidv4()
                  };
                  storeCallHistory(message);
                  publisher.publish('CCAAS_calls_response', JSON.stringify(targetnodes[0]));
                }
              }
              if (currentNode[0].data.inputType === '2' && channelId.req_type === 'BOT') {
                targetnode[0].session_id = channelId.session_id;
                connectBot(currentNode[0], channelId, callflowid);
              }
            } else {
              const message: any = {
                sessionId: channelId.session_id,
                from: 'BOT',
                to: channelId.cli,
                message: targetnode[0].data.message,
                messageType: 'TEXT',
                domainId: channelId.domain_id,
                timeStamp: new Date().getTime() / 1000,
                id: uuidv4()
              };
              storeCallHistory(message);
              const publisher = redisClient.duplicate();
              targetnode[0].session_id = channelId.session_id;
              publisher.publish('CCAAS_calls_response', JSON.stringify(targetnode[0]));
            }
          } else {
            await createCallSession(channelId, channelId.ddi);
            const targetedge = await gettargetedges(nodeid, edge);
            const targetnode = await gettargetnodes(targetedge[0].target, node);
            const publisher = redisClient.duplicate();
            targetnode[0].session_id = channelId.session_id;
            ;
            if (targetnode[0].type === 'playPrompt' || targetnode[0].type === 'customInput') {
              const message: any = {
                sessionId: channelId.session_id,
                from: 'BOT',
                to: channelId.cli,
                message: targetnode[0].data.message,
                messageType: 'TEXT',
                domainId: channelId.domain_id,
                timeStamp: new Date().getTime() / 1000,
                id: uuidv4()
              };
              storeCallHistory(message);
            }
            publisher.publish('CCAAS_calls_response', JSON.stringify(targetnode[0]));
          }
        }
        if (channelId.type !== 'disconnect' && channelId.req_type === 'BOT') {
          const currentNodeData: any = gettargetnodes(channelId.block_id, node);
          if (currentNodeData[0].data.inputType === '2' && channelId.req_type === 'BOT') {
            ;
            connectBot(currentNodeData[0], channelId, callflowid);
          }
        }
        if (channelId.type !== 'disconnect' && channelId.req_type === 'BOT_TRANSFER') {
          const publisher = redisClient.duplicate();
          const targetnodebottransfer = await gettargetnodes(channelId.id, node);
          ;
          if (targetnodebottransfer[0].type === 'setWorkingQueue') {
            const agentDetials: any = await getAgentList(targetnodebottransfer[0].data.setQueue);
            targetnodebottransfer[0].data.agentDetials = { ext:203 };
            targetnodebottransfer[0].session_id = channelId.session_id;
            publisher.publish('CCAAS_calls_response', JSON.stringify(targetnodebottransfer[0]));
          }

        }
      }

      );
      subscriber.subscribe('CCAAS_calls_request');

      const connectBot = async (Node: any, responseData: any, callflowid: any) => {
        ;
        const botData: any = await getBotDetails(Node.data.botChannelId);
        ;
        const updateData: any = {
          sessionId: responseData.session_id,
          botDetails: botData,
          botStartTime: new Date().getTime() / 1000
        };
        await chatUpdateDao(updateData);
        const message: any = {
          sessionId: responseData.session_id,
          to: botData[0].botName,
          from: responseData.callerid,
          messageType: 'TEXT',
          timeStamp: new Date().getTime() / 1000,
          id: uuidv4(),
          message: responseData.text.text
        };
        storeCallHistory(message);

        const requestbody = {
          channel_uuid: Node.data.botChannelId,
          user: {

            uuid: Node.data.botChannelId,
            custom_properties: {
              callflowid,
              channel: 'IVR',
              uuid: Node.data.botChannelId,
              nodeData: JSON.stringify(Node.id),
              responseData: JSON.stringify(responseData),
              call_session_id: responseData.session_id,
              customerDetails: '447550581888'
            },
          },
          message: {
            text: responseData.text.text,
          },
        };
         ;
          ;
        axios
          .post(
            `https://ai.unifiedring.co.uk/bot_connector_webhooks/${Node.data.botChannelUrlId}/message.json`, requestbody
          )
          .then(async (res) => {
            ;
            // getbotreponse();

          })
          .catch((e) => {
            ;
          });
      };
      const getCustomInputResponse = (nexttargetedge, msg) => {
        return nexttargetedge.filter((list: any) => {
          if (list.sourceHandle === msg.value) {
            return list;
          }
        });
      };

      const gettargetnodes = (nodeid, node) => {
        return node?.filter((list: any) => {
          if (list.id === nodeid) {
            return list;
          }
        });
      };

      const gettargetedges = (edgeid, edge) => {
        return edge?.filter((list: any) => {
          ;
          if (list.source === edgeid) {
            return list;
          }
        });
      };

    } */
  }
}
