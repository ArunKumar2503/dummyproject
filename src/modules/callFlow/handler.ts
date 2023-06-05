// const minifyXML = require('minify-xml').minify;
import {
  assignCallBack,
  callFlowDetailByCfid,
  callFlowDetails,
  callflowhistory,
  callFlowList,
  getActivityList,
  getAgentCall,
  getAgentChat,
  getAgentList,
  getAllActive,
  getCallBackList,
  getCallFlowNodes,
  getConversationList,
  getRoleIdList,
  getSessionAllList,
  getSessionIdDao,
  getVoiceCallBackExtList,
  getVoiceCallBackList,
  getVoiceCallList,
  roleInfoDao,
  savecallflow,
} from '../../dao/callflow.dao';
import { chatUpdateDao, getChatSessionIdDao, storeCustomerDetails, storeMessageHistory } from '../../dao/chat.dao';
import { ioredisChat, redisClient } from '../../plugins/db';

import _ from 'lodash';
import redis from 'redis';
import { v4 as uuidv4 } from 'uuid';
import { configs } from '../../config/app';
import { RESPONSE } from '../../helpers/constants';

export async function getUpdateIvrHandler(req: any, res: any, done: any) {
  try {
    const data = req.body;
    let requiredXml: any = '';
    data.node.map((eachNode: any) => {
      let targetElement: any = '';

      if (eachNode.type === 'entryPoint') {
        targetElement = getTargetElement(eachNode, data);
        if (targetElement === null) return res.status(500).send({ statusCode: 2001, message: 'No Target Found' });
        requiredXml += `<?xml version='1.0'?>
        <ivrxml roottask='${eachNode.id}'>
        <action name='${eachNode.id}' nextaction ='${targetElement.id}'> </action>`;
      }
      if (eachNode.type === 'playPrompt') {
        targetElement = getTargetElement(eachNode, data);
        if (targetElement === null) return res.status(500).send({ statusCode: 2001, message: 'No Target Found' });
        requiredXml += `<action name='${eachNode.id}' method='playandnextaction' nextaction ='${targetElement.id}'>
        <play src='${eachNode.data.urlPath}' dtmf='yes'/>
        </action>`;
      }
      if (eachNode.type === 'disconnect') {
        requiredXml += ` <action name='${eachNode.id}' method='playanddisconnect'/>`;
      }
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: 'RESPONSE.internal_error' });
  }
}

function getTargetElement(targetElement: any, data: any) {
  const getargetEdge: any = data.edge.find((list: any) => list.source === targetElement.id);

  const requiredNode: any = data.node.find((list: any) => list.id === getargetEdge.target);
  if (requiredNode === undefined) return null;
  return requiredNode;
}

function ivrCase(currentIVR: any) {
  return {
    '@': {
      id: currentIVR.id,
      nextaction: currentIVR.id,
    },
  };
}

function levelOFIVR(rootStep: any, orginalIVRList: any) {
  const mainObject = orginalIVRList.find((steps: any) => steps.id === rootStep);

  return {
    '@': {
      name: mainObject.id,
      method: 'playandwaitinput',
    },
    play: {
      '@': {
        src: mainObject.data.urlPath !== '' ? mainObject.data.urlPath : '/root/wav_files/sounds/vectone/ivr/no_ivr.wav',
        dtmf: 'yes',
      },
    },
    input: { ...defaultIVRInput() },
    switch: {
      case: [],
    },
    // 'error_no_input': rootOptions[mainObject.id].noAction.type === 'Disconnect' ? { ...errorNoInput({ path: '/root/wav_files/sounds/vectone/ivr/no_input.wav' }) } :{ ...errorNoInputOperator( mainObject.id, { path: '/root/wav_files/sounds/vectone/ivr/no_input.wav' }) },
    // 'error_invalid_input': { ...errorInvalidInput({ path: '/root/wav_files/sounds/vectone/ivr/invalid_option.wav' }) }
  };
}

function defaultIVRInput() {
  return {
    '@': {
      dtmf: 'yes',
      mindtmfdigits: '1',
      maxdtmfdigits: '4',
      interdigittimeout: '4',
      validation: 'self',
      retrycount: '3',
      errorexitaction: 'exitivr',
    },
  };
}

export async function saveCallFlowData(req: any, res: any, done: any) {
  try {
    const auth = req.headers;
    const reqData = req.body;
    const d = new Date();
    const datestring = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
    const version = req?.body?.status === 2 ? `Version ${datestring} : Published` : `Version ${datestring} : Save`;
    const cfid = req.body.cfid === '' || req.body.cfid === undefined ? uuidv4() : req.body.cfid;
    reqData.version = version;
    reqData.type = req?.body?.type ?? 'Custom';
    reqData.createDate = Date.now();
    reqData.lastModifiedDate = Date.now();
    reqData.uuid = uuidv4();
    reqData.status = req.body.status;
    reqData.companyId = auth.companyId;
    reqData.domainId = auth.domainId;
    reqData.description = req.body.description;
    reqData.cfid = cfid;
    const publishedData: any = [];
    publishedData.push(reqData);
    reqData.publishedDataArr = JSON.stringify(publishedData);
    const nodeData: any = {};
    nodeData.node = JSON.stringify(reqData?.nodes);
    nodeData.edge = JSON.stringify(reqData?.edges);

    callflowhistory(reqData, nodeData);
    reqData.callFlowStatus = req.body.status;
    if (req.body.status === 2) {
      const node = await redisClient.set(`${cfid}nodes`, JSON.stringify(req.body.nodes));
      const edge = await redisClient.set(`${cfid}edges`, JSON.stringify(req.body.edges));
    }
    const saveResult = await savecallflow(reqData, nodeData);
    res.send({
      statusCode: 200,
      status: 'OK',
      uuid: reqData.cfid,
      message: saveResult[0][0].errmsg,
      getSaveCallflowList: reqData ?? {},
    });
  } catch (err) {
    req.log.error(err);
    res.send({ statusCode: 500, result: {}, message: 'internal server error' });
  }
}

export async function updateCallFlowDataForPublish(req: any, res: any, done: any) {
  try {
    const auth = req.headers;
    const reqData = req.body;
    const d = new Date();
    const datestring = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
    const version = req?.body?.status === 2 ? `Version ${datestring} : Published` : `Version ${datestring} : Save`;
    const cfid = req.body.cfid;
    reqData.version = version;
    reqData.type = req?.body?.type ?? 'Custom';
    reqData.lastModifiedDate = Date.now();
    reqData.uuid = uuidv4();
    reqData.status = req.body.status;
    reqData.description = req.body.description;
    reqData.cfid = cfid;
    reqData.callFlowStatus = req.body.status;
    const getCallFlow: any = await getCallFlowNodes(reqData);
    const nodeData: any = {};
    nodeData.node = JSON.stringify(reqData?.nodes);
    nodeData.edge = JSON.stringify(reqData?.edges);
    const publishedData: any = reqData;
    const resultData = JSON.parse(getCallFlow[0].publishData ?? 'null');
    resultData.push(publishedData);
    reqData.publishedDataArr = JSON.stringify(resultData);

    callflowhistory(reqData, nodeData);
    if (req.body.status === 2) {
      const node = await redisClient.set(`${cfid}nodes`, JSON.stringify(req.body.nodes));
      const edge = await redisClient.set(`${cfid}edges`, JSON.stringify(req.body.edges));
    }
    const saveResult = await savecallflow(reqData, nodeData);
    res.send({
      statusCode: 200,
      status: 'OK',
      uuid: reqData.cfid,
      message: saveResult[0][0].errmsg,
      getPublishCallflowList: reqData ?? {},
    });
  } catch (err) {
    req.log.error(err);
    res.send({ statusCode: 500, result: {}, message: 'internal server error' });
  }
}

export async function getwebbook(req: any, res: any, done: any) {
  try {
    const node = []; // await redisClient.getAsync(`${req.body.user.callflowid}nodes`);
    const edge: any = []; // await redisClient.getAsync(`${req.body.user.callflowid}edges`);
    // node = JSON.parse(node);
    // edge = JSON.parse(edge);

    if (req.body.user.channel === 'Chat') {
      const messageDetails = JSON.parse(req.body.user.messageData ?? 'null');
      const member = `${req.body.user.call_session_id}${req.body.user.phone_number}${messageDetails.sessionId}`;
      const sendmsg = {
        sendmsg: {
          message: req?.body?.message?.text,
          time: `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`,
        },
      };

      const updateCustomerNumber: any = {};
      if (req.body.user.isCustomerNumber) {
        updateCustomerNumber.sessionId = messageDetails.sessionId;
        updateCustomerNumber.customerDetails = req.body.user.customerNumber;
        await storeCustomerDetails(messageDetails.sessionId, req.body.user.customerNumber);
      }
      await chatUpdateDao(updateCustomerNumber);
      const nodeId = JSON.parse(req.body.user.nodeData ?? 'null');
      // );
      const nodeData = JSON.parse(req.body.user.nodeData ?? 'null');

      const messageData: any = {
        message: req?.body?.message?.text,
        sessionId: messageDetails.sessionId,
        id: uuidv4(),
        messageType: 'text',
        isBot: true,
        from: 'VectoneBot',
        to: messageDetails.from,
        timeStamp: new Date().getTime(),
        companyId: messageDetails.companyId,
        domainId: messageDetails.domainId,
        isDelivered: true,
        sendmsg: {
          message: req?.body?.message?.text,
          time: `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`,
          botResponse: req.body,
        },
      };
      ioredisChat.to(member).emit('typing', false);

      storeMessageHistory(messageData);
      ioredisChat.to(member).emit('send-message', messageData);
      const targetedge = gettargetedges(nodeId.id, edge);
      const nodeintents = nodeData.data.intendVal;

      const intentfound = nodeintents.filter((list: any) => {
        if (list.value === req.body.user.skill_name) {
          return list;
        }
      });

      if (intentfound.length > 0) {
        const getEdge = targetedge.filter((list: any) => {
          if (list.source === nodeId.id && list.sourceHandle === req.body.user.skill_name) {
            return list;
          }
        });
        const getNode = node.filter((nodes: any) => {
          if (nodes.id === getEdge[0].target) {
            return nodes;
          }
        });
        if (getNode[0].type === 'customInput') {
          const aaa: any = getAgentList(getNode[0].data.setQueue);
          //
        }
        if (getNode[0].type === 'playPrompt') {
          //  ;

          const nexttargetedge = gettargetedges(getNode[0].id, edge);
          const nextnode = gettargetnodes(nexttargetedge[0].target, node);
          // ;

          const targetNode: any = await getAgentList(nextnode[0].data.setQueue);

          const prop = req.body.user.custom_properties;
          const sessionData = await getChatSessionIdDao(messageDetails.sessionId);
          const rdata = {
            roomname: `${prop.call_session_id}${prop.phone_number}${messageDetails.sessionId}`,
            sessionId: messageDetails.sessionId,
            sessionDetails: sessionData,
          };

          const updateData: any = {
            sessionId: messageDetails.sessionId,
            isBot: false,
            botEndTime: new Date().getTime() / 1000,
          };
          await chatUpdateDao(updateData);
          ioredisChat.to(targetNode[0].ext.toString()).emit('agentConnect', rdata);
        }

        if (getNode[0].type === 'setWorkingQueue') {
          const targetNode: any = await getAgentList(getNode[0].data.setQueue);
          const prop = req.body.user.custom_properties;
          const sessionData = await getChatSessionIdDao(messageDetails.sessionId);
          const rdata = {
            roomname: `${prop.call_session_id}${prop.phone_number}${messageDetails.sessionId}`,
            sessionId: messageDetails.sessionId,
            sessionDetails: sessionData,
          };
          const updateData: any = {
            sessionId: messageDetails.sessionId,
            isBot: false,
            botEndTime: new Date().getTime() / 1000,
          };
          await chatUpdateDao(updateData);
          ioredisChat.to(targetNode[0].ext.toString()).emit('agentConnect', rdata);
        }
      }
    } else {
      const response: any = req.body;
      const subscriber = redisClient.duplicate();
      if (req.body.sender === 'BOT') {
        const nodeId = JSON.parse(req?.body?.user?.nodeData ?? 'null');
        const targetedge = await gettargetedges(nodeId, edge);
        const nodeData = await gettargetnodes(nodeId, node);
        const nodeintents = nodeData[0].data.intendVal;
        const intentfound = nodeintents.filter((list: any) => {
          if (list.value === req.body.user.skill_name) {
            return list;
          }
        });

        if (intentfound.length > 0) {
          const getEdge = targetedge.filter((list: any) => {
            if (list.source === nodeId && list.sourceHandle === req.body.user.skill_name) {
              return list;
            }
          });
          const getNode = node.filter((reqnode: any) => {
            if (reqnode.id === getEdge[0].target) {
              return reqnode;
            }
          });
          if (getNode[0].type === 'customInput') {
            const updateData: any = {
              sessionId: req.body?.user?.call_session_id,
              isBot: false,
            };
            await chatUpdateDao(updateData);
            const aaa: any = getAgentList(getNode[0].data.setQueue);
            const publisher = redisClient.duplicate();
            const customInputRes: any = {};
            customInputRes.data = response;
            customInputRes.type = 0;
            customInputRes.session_id = req.body?.user.call_session_id;
            customInputRes.req_type = 'BOT';
            publisher.publish(configs.responseChannel, JSON.stringify(customInputRes));
          }
          if (getNode[0].type === 'playPrompt') {
            const updateData: any = {
              sessionId: req.body?.user?.call_session_id,
              isBot: false,
            };
            await chatUpdateDao(updateData);
            const nexttargetedge = gettargetedges(getNode[0].id, edge);
            const nextnode = gettargetnodes(nexttargetedge[0].target, node);
            const targetNode: any = await getAgentList(nextnode[0].data.setQueue);
            const publisher = redisClient.duplicate();
            const propRes: any = {};
            propRes.data = response;
            propRes.type = 0;
            propRes.session_id = req.body?.user.call_session_id;
            propRes.req_type = 'BOT';
            propRes.block_id = getNode[0].id;
            publisher.publish(configs.responseChannel, JSON.stringify(propRes));
          }

          if (getNode[0].type === 'setWorkingQueue') {
            const updateData: any = {
              sessionId: req.body?.user?.call_session_id,
              isBot: false,
            };
            await chatUpdateDao(updateData);
            const targetNode: any = await getAgentList(157);
            const publisher = redisClient.duplicate();
            const WorkingQueueRes: any = {};
            WorkingQueueRes.data = response;
            WorkingQueueRes.type = 0;
            WorkingQueueRes.session_id = req.body?.user.call_session_id;
            WorkingQueueRes.req_type = 'BOT';
            publisher.publish(configs.responseChannel, JSON.stringify(WorkingQueueRes));
            const agentResponse: any = {};
            agentResponse.data = response;
            agentResponse.type = 1;
            agentResponse.session_id = req.body?.user.call_session_id;
            agentResponse.req_type = 'BOT';
            agentResponse.routingto = 'AGENT';
            agentResponse.block_id = getNode[0].id;
            publisher.publish(configs.responseChannel, JSON.stringify(agentResponse));
          }
        } else {
          const publisher = redisClient.duplicate();
          const publishRes: any = {};
          publishRes.data = response;
          publishRes.type = 0;
          publishRes.session_id = req.body?.user.call_session_id;
          publishRes.req_type = 'BOT';
          publisher.publish(configs.responseChannel, JSON.stringify(publishRes));
        }
      }
    }

    res.send({
      statusCode: 200,
      result: [],
      status: 'Ok',
      message: '',
    });
  } catch (err) {
    res.send({ statusCode: 500, result: [], message: 'internal server error' });
  }
}

const gettargetedges = (edgeid, edge) => {
  return edge.filter((list: any) => {
    if (list.source === edgeid) {
      return list;
    }
  });
};

const gettargetnodes = (nodeid, node) => {
  return node.filter((list: any) => {
    if (list.id === nodeid) {
      return list;
    }
  });
};

export async function getCallFlowList(req: any, res: any, done: any) {
  try {
    const auth = req.headers;
    const data: any = {};
    data.domainId = auth.domainId;
    callFlowList(data)
      .then((callList: any) => {
        res.send({
          statusCode: 200,
          result: callList,
          status: 'Ok',
          message: '',
        });
      })
      .catch((err: any) => {
        res.send({
          statusCode: 200,
          result: [],
          status: 'Failure',
          message: 'Call Flow not found!',
        });
      });
  } catch (err) {
    res.send({ statusCode: 500, result: [], message: 'internal server error' });
  }
}

/**
 *
 * @param req
 * @param res
 * @param done
 */
export async function getCallFlowDetail(req: any, res: any, done: any) {
  try {
    const auth = req.headers;
    const data: any = {};
    data.cfid = req?.params?.cfid;
    data.domainId = auth.domainId;
    callFlowDetails(data)
      .then((callDetails: any) => {
        res.send({
          statusCode: 200,
          result: callDetails,
          status: 'Ok',
          message: '',
        });
      })
      .catch((err: any) => {
        res.send({
          statusCode: 200,
          result: [],
          status: 'Failure',
          message: 'Call Flow not found!',
        });
      });
  } catch (err) {
    res.send({ statusCode: 500, result: [], message: 'internal server error' });
  }
}

/**
 *
 * @param req
 * @param res
 * @param done
 */
export async function getCallFlowDetailByCfid(req: any, res: any, done: any) {
  try {
    const data: any = {};
    data.cfid = req?.body?.callFlowId;
    data.domainId = req?.body?.domainId;
    const getCallDetails = await callFlowDetailByCfid(data);
    if (Array.isArray(getCallDetails) && getCallDetails.length > 0) {
      res.status(200).send({
        statusCode: 200,
        message: RESPONSE.success_message,
        CallFlowDetailByCfidRes: getCallDetails,
      });
    } else {
      res.status(200).send({
        statusCode: 404,
        message: RESPONSE.not_found,
        CallFlowDetailByCfidRes: [],
      });
    }
  } catch (err) {
    res.send({ statusCode: 500, result: [], message: 'internal server error' });
  }
}

/**
 *
 * @param req
 * @param res
 * @param done
 */
export async function getAllActiveList(req: any, res: any, done: any) {
  try {
    const auth = req.headers;
    const data: any = {
      domainId: auth.domainId,
      ext: auth.ext,
      emailId: auth.username,
      channelType: req.body.channelType,
      search: req.body.search,
      fromDate: req.body.fromDate,
      toDate: req.body.toDate,
      offset: req.body.offset,
      limit: req.body.limit,
    };
    const roleInfo: any = await roleInfoDao(data);
    data.ccas_role_info = roleInfo?.roleid.toString();
    if (data.ccas_role_info.split(',')[0] === '2') {
      const ext = [];
      const getRoleId: any = await getRoleIdList(data);
      for (const result of getRoleId) {
        ext.push(result.ext);
      }
      data.ext = ext;
      const getAativity: any = await getAllActive(data);
      // const getAallListCountRes: any = await getAllActivityCount(data);
      if (Array.isArray(getAativity) && getAativity.length > 0) {
        res.status(200).send({
          statusCode: 200,
          message: RESPONSE.success_message,
          // getAllAtivityListCount: getAallListCountRes,
          getAllAtivityListRes: getAativity,
        });
      } else {
        res.status(200).send({
          statusCode: 404,
          message: RESPONSE.not_found,
          getAllAtivityListCount: [],
          getAllAtivityListRes: [],
        });
      }
    } else if (data.ccas_role_info.split(',')[0] === '3') {
      const getAativity: any = await getAllActive(data);
      // const getAallListCountRes: any = await getAllActivityCount(data);
      if (Array.isArray(getAativity) && getAativity.length > 0) {
        res.status(200).send({
          statusCode: 200,
          message: RESPONSE.success_message,
          // getAllAtivityListCount: getAallListCountRes,
          getAllAtivityListRes: getAativity,
        });
      } else {
        res.status(200).send({
          statusCode: 404,
          message: RESPONSE.not_found,
          getAllAtivityListCount: [],
          getAllAtivityListRes: [],
        });
      }
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}

/**
 *
 * @param req
 * @param res
 * @param done
 */
export async function getAgentCallList(req: any, res: any, done: any) {
  try {
    const data: any = req.body;
    if (data.length === 0) {
      res.status(200).send({
        statusCode: 404,
        message: RESPONSE.empty_data,
      });
    } else {
      const getCallList: any = await getAgentCall(data);
      if (Array.isArray(getCallList) && getCallList.length > 0) {
        res.status(200).send({
          statusCode: 200,
          message: RESPONSE.success_message,
          getAgentCallList: getCallList,
        });
      } else {
        res.status(200).send({
          statusCode: 404,
          message: RESPONSE.not_found,
          getAgentCallList: [],
        });
      }
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}

/**
 *
 * @param req
 * @param res
 * @param done
 */
export async function getAgentChatList(req: any, res: any, done: any) {
  try {
    const data: any = req.body;
    if (data.length === 0) {
      res.status(200).send({
        statusCode: 404,
        message: RESPONSE.empty_data,
      });
    } else {
      const getChatList: any = await getAgentChat(data);
      if (Array.isArray(getChatList) && getChatList.length > 0) {
        res.status(200).send({
          statusCode: 200,
          message: RESPONSE.success_message,
          getAgentChatList: getChatList,
        });
      } else {
        res.status(200).send({
          statusCode: 404,
          message: RESPONSE.not_found,
          getAgentChatList: [],
        });
      }
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}

/**
 *
 * @param req
 * @param res
 * @param done
 */
export async function getSessionIdList(req: any, res: any, done: any) {
  try {
    const sessionId = req.params.sessionId;
    const getSessionId: any = await getSessionIdDao(sessionId);
    if (getSessionId) {
      res.status(200).send({
        statusCode: 200,
        message: RESPONSE.success_message,
        getSessionIdListRes: getSessionId,
      });
    } else {
      res.status(200).send({
        statusCode: 404,
        message: RESPONSE.not_found,
        getSessionIdListRes: [],
      });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}

/**
 *
 * @param req
 * @param res
 * @param done
 */
export async function getCallBackListHandler(req: any, res: any, done: any) {
  try {
    const auth = req.headers;
    const data: any = {
      domainId: auth.domainId,
      ext: auth.ext,
      emailId: auth.username,
      channelType: req.body.channelType,
      search: req.body.search,
      fromDate: req.body.fromDate,
      toDate: req.body.toDate,
      offset: req.body.offset,
      limit: req.body.limit,
    };
    const roleInfo: any = await roleInfoDao(data);
    data.ccas_role_info = roleInfo.roleid.toString();

    if (data.ccas_role_info.split(',')[0] === '2') {
      const ext = [];
      const getRoleId: any = await getRoleIdList(data);
      for (const result of getRoleId) {
        ext.push(result.ext);
      }
      // data.ext = ext;
      data.resultExt = ext.toString();
      const getCallBack: any = await getCallBackList(data);
      if (Array.isArray(getCallBack) && getCallBack.length > 0) {
        res.status(200).send({
          statusCode: 200,
          message: RESPONSE.success_message,
          getCallBackListRes: getCallBack,
        });
      } else {
        res.status(200).send({
          statusCode: 404,
          message: RESPONSE.not_found,
          getCallBackListRes: [],
        });
      }
    } else if (data.ccas_role_info.split(',')[0] === '3') {
      data.assigned_ext = data.ext;
      const getCallBack: any = await getCallBackList(data);
      if (Array.isArray(getCallBack) && getCallBack.length > 0) {
        res.status(200).send({
          statusCode: 200,
          message: RESPONSE.success_message,
          getCallBackListRes: getCallBack,
        });
      } else {
        res.status(200).send({
          statusCode: 404,
          message: RESPONSE.not_found,
          getCallBackListRes: [],
        });
      }
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}

/**
 *
 * @param req
 * @param res
 * @param done
 */
export async function getVoiceCallListHandlers(req: any, res: any, done: any) {
  try {
    const auth: any = req.headers;
    const data: any = {
      domainId: auth.domainId,
      ext: auth.ext,
      emailId: auth.username,
      channelType: req.body.channelType,
      search: req.body.search,
      fromDate: req.body.fromDate,
      toDate: req.body.toDate,
      offset: req.body.offset,
      limit: req.body.limit,
    };
    const roleInfo: any = await roleInfoDao(data);
    data.ccas_role_info = roleInfo?.roleid.toString();
    if (data.ccas_role_info.split(',')[0] === '2') {
      const ext = [];
      const getRoleId: any = await getRoleIdList(data);
      for (const resu of getRoleId) {
        ext.push(resu.ext);
      }
      data.ext = ext;
      const getVoiceListRes: any = await getVoiceCallList(data);
      // const getVoiceListCountRes: any = await getVoiceListCount(data);
      if (Array.isArray(getVoiceListRes) && getVoiceListRes.length > 0) {
        res.status(200).send({
          statusCode: 200,
          message: RESPONSE.success_message,
          // totalVoiceCallCount: getVoiceListCountRes,
          getVoiceCallListRes: getVoiceListRes,
        });
      } else {
        res.status(200).send({
          statusCode: 404,
          message: RESPONSE.not_found,
          // totalVoiceCallCount: [],
          getAgentCallList: [],
        });
      }
    } else if (data.ccas_role_info.split(',')[0] === '3') {
      const getVoiceListRes: any = await getVoiceCallList(data);
      // const getVoiceListCountRes: any = await getVoiceListCount(data);
      if (Array.isArray(getVoiceListRes) && getVoiceListRes.length > 0) {
        res.status(200).send({
          statusCode: 200,
          message: RESPONSE.success_message,
          // totalVoiceCallCount: getVoiceListCountRes,
          getVoiceCallListRes: getVoiceListRes,
        });
      } else {
        res.status(200).send({
          statusCode: 404,
          message: RESPONSE.not_found,
          // totalVoiceCallCount: [],
          getAgentCallList: [],
        });
      }
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}

/**
 *
 * @param req
 * @param res
 * @param done
 * ccs assign call back api
 */
export async function assignCallBackHandlers(req: any, res: any, done: any) {
  try {
    const auth: any = req.headers;
    const data: any = {
      session_id: req.body.sessionId,
      ext: req.body.ext,
      domainId: auth.domainId,
      assignedTo: req?.body?.assignedTo ?? null,
      assignedBy: req?.body?.assignedBy ?? null,
      channelType: req?.body?.channelType ?? null,
      assignedOn: Date.now(),
      markAsRead: req.body?.markAsRead ?? null,
    };
    const assignRes: any = await assignCallBack(data);
    if (assignRes) {
      res.status(200).send({ statusCode: 200, message: RESPONSE.update_asssign });
    } else {
      res.status(200).send({ statusCode: 404, message: RESPONSE.not_found });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}

/**
 *
 * @param req
 * @param res
 * @param done
 */
export async function getActivityListHandlers(req: any, res: any, done: any) {
  try {
    const auth: any = req.headers;
    const data: any = {
      domainId: auth.domainId,
      ext: auth.ext,
      emailId: auth.username,
      channelType: req.body.channelType,
      disposition: req.body.disposition,
      callType: req.body.direction,
      fromDate: req.body.fromDate,
      toDate: req.body.toDate,
      offset: req.body.offset,
      limit: req.body.limit,
      search: req.body.search,
    };
    const roleInfo: any = await roleInfoDao(data);
    data.ccas_role_info = roleInfo?.roleid.toString();
    if (data?.ccas_role_info.split(',')[0] === '2') {
      const ext = [];
      const getRoleId: any = await getRoleIdList(data);
      for (const resu of getRoleId) {
        ext.push(resu.ext);
      }
      data.ext = ext;
      const getVoiceListRes: any = await getActivityList(data);
      if (Array.isArray(getVoiceListRes) && getVoiceListRes.length > 0) {
        res.status(200).send({
          statusCode: 200,
          message: RESPONSE.success_message,
          getVoiceCallListRes: getVoiceListRes,
        });
      } else {
        res.status(200).send({
          statusCode: 404,
          message: RESPONSE.not_found,
          getVoiceCallListRes: [],
        });
      }
    } else if (data.ccas_role_info.split(',')[0] === '3') {
      const getVoiceListRes: any = await getActivityList(data);
      // const getVoiceListCountRes: any = await getVoiceListCount(data);
      if (Array.isArray(getVoiceListRes) && getVoiceListRes.length > 0) {
        res.status(200).send({
          statusCode: 200,
          message: RESPONSE.success_message,
          getVoiceCallListRes: getVoiceListRes,
        });
      } else {
        res.status(200).send({
          statusCode: 404,
          message: RESPONSE.not_found,
          getVoiceCallListRes: [],
        });
      }
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}

/**
 *
 * @param req
 * @param res
 * @param done
 */
export async function getVoiceCallBackListHandler(req: any, res: any, done: any) {
  try {
    const auth = req.headers;
    const data: any = {
      domainId: auth.domainId,
      ext: auth.ext,
      emailId: auth.username,
      fromDate: req.body.fromDate,
      toDate: req.body.toDate,
      offset: req.body.offset,
      limit: req.body.limit,
    };
    const roleInfo: any = await roleInfoDao(data);
    data.ccas_role_info = roleInfo?.roleid.toString();
    if (data.ccas_role_info.split(',')[0] === '2') {
      await getRoleIdList(data);
      const getCallBack: any = await getVoiceCallBackList(data);
      // const getCallListCountRes: any = await getCallBackCount(data);
      if (Array.isArray(getCallBack) && getCallBack.length > 0) {
        res.status(200).send({
          statusCode: 200,
          message: RESPONSE.success_message,
          // getCallBackListCount: getCallListCountRes,
          getCallBackListRes: getCallBack,
        });
      } else {
        res.status(200).send({
          statusCode: 404,
          message: RESPONSE.not_found,
          // getCallBackListCount: [],
          getCallBackListRes: [],
        });
      }
    } else if (data.ccas_role_info.split(',')[0] === '3') {
      const getCallBack: any = await getVoiceCallBackExtList(data);
      // const getCallListCountRes: any = await getCallBackExtCount(data);
      if (Array.isArray(getCallBack) && getCallBack.length > 0) {
        res.status(200).send({
          statusCode: 200,
          message: RESPONSE.success_message,
          //   getCallBackListCount: getCallListCountRes,
          getCallBackListRes: getCallBack,
        });
      } else {
        res.status(200).send({
          statusCode: 404,
          message: RESPONSE.not_found,
          getCallBackListRes: [],
        });
      }
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}

/**
 *
 * @param req
 * @param res
 * @param done
 */
export async function getSessionAllListHandler(req: any, res: any, done: any) {
  try {
    const auth = req.headers;
    const dataq = req.params.phoneNumber;
    const data: any = {};
    data.domainId = auth.domainId;
    const customerPhoneNumber: any = await getSessionAllList(dataq, data);
    if (customerPhoneNumber) {
      res.status(200).send({
        statusCode: 200,
        message: RESPONSE.success_message,
        getSessionListRes: customerPhoneNumber,
      });
    } else {
      res.status(200).send({
        statusCode: 404,
        message: RESPONSE.not_found,
        getSessionListRes: [],
      });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}

/**
 *
 * @param req
 * @param res
 * @param done
 */
export async function getConversationListHandler(req: any, res: any, done: any) {
  try {
    const auth = req.headers;
    const sessionId = req.params.sessionId;
    const data: any = {};
    data.domainId = auth.domainId;
    const conversationRes: any = await getConversationList(sessionId, data);
    if (conversationRes) {
      res.status(200).send({
        statusCode: 200,
        message: RESPONSE.success_message,
        getConversationResListRes: conversationRes,
      });
    } else {
      res.status(200).send({
        statusCode: 404,
        message: RESPONSE.not_found,
        getSessionListRes: [],
      });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}
