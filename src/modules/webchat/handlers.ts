import { createCustomerFilepath, getCustomerChatHistory, getCustomerChatHistoryByEmailId } from '../../dao/callflow.dao';
import { availableAgentData, createSession } from '../../dao/chat.dao';

import { v4 as uuidv4 } from 'uuid';
import { configs } from '../../config/app';
import { RedisAdapters } from '../../redisAdapters';

/**
 *
 * @param req
 * @param res
 * @param done
 * @description Web Chat
 */

export const webChatGetAvailableAgent = async (req: any, res: any) => {
  try {
    const data: any = {
      session_id: req.body.sessionId,
      domain_id: req.body.domainId,
      type: 'playPrompt',
      response: 'success',
      channelType: 'Chat',
      call_state: 'init',
      customerData: req.body.customerData,
      sessionStartTime: Math.floor(Date.now()),
      ipAddress: req?.body?.ipAddress ?? '192.168.1.1',
      callFlowId: req?.body?.callFlowId,
      browser: req.body?.browser,
      OS: req.body?.OS,
    };
    await createSession(data, data?.session_id);
    res.status(200).send({ statusCode: 200, message: 'Insert successfully' });
  } catch (err) {
    console.log(err?.message);
  }
};

export const webChatValidateCustomer = async (req: any, res: any) => {
  try {
    const data = req.params.uuid.trim();
    const responseData: any = await getCustomerChatHistory(data);
    const messageArr: any = [];
    JSON.parse(responseData[0]?.message ?? 'null')?.map((msg: any) => {
      messageArr.push(msg);
    });
    if (responseData.length > 0) {
      res.status(200).send({ statusCode: 200, message: 'Customer history Data', customerValidateData: responseData, messageList: messageArr });
    } else {
      res.status(200).send({ statusCode: 404, message: 'No Data Found', customerValidateData: null });
    }
  } catch (err) {
    console.log(err?.message);
  }
};

export const storeCustomerCallBackRequest = async (req: any, res: any) => {
  try {
    const data: any = {};
    data.session_id = req.body.sessionId;
    data.domain_id = req.body.domainId;
    data.callBackRequest = req.body?.callBackData;
    await createSession(data, data.session_id);
    res.status(200).send({ statusCode: 200, message: 'Customer callback request insert' });
  } catch (err) {
    console.log(err.message);
  }
};

export const chatCustomerFileUpload = async (req: any, res: any, done: any) => {
  try {
    const filesarry: any = req.files?.doc;
    const session_id = req.body?.sessionId;
    // const domainId = req.body?.domainId;
    const uuid = uuidv4();
    let url: any = '';
    for (const chat of filesarry) {
      url = `${configs.chat_path.fileGetUrl}${chat.originalname}`;
      chat.uuid = uuid;
      chat.url = url;
      chat.sessionId = session_id;
      chat.name = `${chat.originalname}`;
      // chat.domainId = domainId;
      chat.message = chat?.message ?? null;
      delete chat.destination;
      delete chat.originalname;
      await createCustomerFilepath(chat);
    }
    res.send({ statusCode: 200, errCode: -1, message: 'success', fileList: filesarry });
  } catch (err) {
    console.log(err);

    res.send({ statusCode: 500, errCode: 1, message: 'internal server error' });
  }
};

export const webChatValidateCustomerWithMailId = async (req: any, res: any) => {
  try {
    const data: any = {
      customerData: req.body.customerData,
      domainId: req.body.domainId,
    };
    const responseData: any = await getCustomerChatHistoryByEmailId(data);
    const messageArr: any = [];
    responseData?.map((list: any) => {
      JSON.parse(list.message ?? 'null')?.map((msg: any) => {
        messageArr.push(msg);
      });
    });
    if (responseData.length > 0) {
      res.status(200).send({ statusCode: 200, message: 'Customer history Data', customerValidateData: messageArr });
    } else {
      res.status(200).send({ statusCode: 404, message: 'No Data Found', customerValidateData: [] });
    }
  } catch (err) {
    console.log(err.message);
  }
};

export const getAvailableAgentDetails = async (req: any, res: any) => {
  try {
    const redisadaptor: RedisAdapters = new RedisAdapters();
    const data: any = {
      session_id: req.body.sessionId,
      domain_id: req.body.domainId,
      type: 'playPrompt',
      response: 'success',
      channelType: 'Chat',
      call_state: 'init',
      callFlowId: req?.body?.callFlowId,
      call_type: 'inbound',
      transferCallCount: req.body?.transferCallCount,
    };
    if (data.transferCallCount === 1) {
      data.status = 'dialTimeout';
    }
    redisadaptor.publishMessageChat(JSON.stringify(data));
    redisadaptor.BLPOP(res, data.domain_id);
  } catch (err) {
    console.log("shdhdshfds");
    console.log(err);
  }
};

export const resultData =(req: any, res: any) =>{
  const data: any = {};
  data.domainId = req.body.domainId;
  data.callFlowId = req.body
}