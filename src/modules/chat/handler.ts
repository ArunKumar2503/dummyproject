import { chatUpdateDao, getCallSessionDao, getChatByEndTimeDao, getChatByNumberDao, getChatSessionDao, getChatSessionIdDao } from '../../dao/chat.dao';

import { map } from 'lodash';
/**
 *  update
 * @param req
 * @param res
 * @param done
 */
export async function updateChat(req: any, res: any, done: any) {
  try {
    const data: any = req.body;

    const userRes: any = await chatUpdateDao(data);

    if (userRes) {
      res.status(200).send({ statusCode: 200, message: 'Updated  successfully' });
    } else {
      res.status(424).send({ statusCode: 424, message: 'failed' });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: 'internal server error' });
  }
}
/**
 * get chatSession details
 * @param req
 * @param res
 * @param done
 */
export async function getChatSession(req: any, res: any, done: any) {
  try {
    const auth: any = req.headers;
    const DaoRes: any = await getChatSessionDao(auth.ext);
    if (DaoRes) {
      const ResultArray: any = [];
      DaoRes?.map((sessionDt: any) => {
        if (sessionDt?.sessionEndTime) {
          ResultArray.push(sessionDt);
        }
      });
      res.status(200).send({ statusCode: 200, message: 'Success', result: ResultArray });
    } else {
      res.status(424).send({ statusCode: 424, message: 'failed' });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: 'internal server error' });
  }
}

/**
 * get chatSession details
 * @param req
 * @param res
 * @param done
 */
export async function getCallSession(req: any, res: any, done: any) {
  try {
    const auth: any = req.headers;
    const DaoRes: any = await getCallSessionDao(auth);
    res.status(200).send({ statusCode: 200, message: 'Success', result: DaoRes });
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: 'internal server error' });
  }
}
/**
 * get chatSession details
 * @param req
 * @param res
 * @param done
 */
export async function getChatSessionId(req: any, res: any, done: any) {
  try {
    const chatSessionId = req.params.chatSessionId;
    const DaoRes: any = await getChatSessionIdDao(chatSessionId);

    if (DaoRes) {
      res.status(200).send({ statusCode: 200, message: 'Success', result: DaoRes });
    } else {
      res.status(424).send({ statusCode: 424, message: 'failed' });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: 'internal server error' });
  }
}
/**
 * get chatSession details
 * @param req
 * @param res
 * @param done
 */
export async function getChatByNumber(req: any, res: any, done: any) {
  try {
    const data: any = req.body;
    const DaoRes: any = await getChatByNumberDao(data.number);
    if (DaoRes) {
      res.status(200).send({ statusCode: 200, message: 'Success', result: DaoRes });
    } else {
      res.status(424).send({ statusCode: 424, message: 'failed' });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: 'internal server error' });
  }
}

/**
 * get chatSession details5
 * @param req
 * @param res
 * @param done
 */
export async function getChatByEndTime(req: any, res: any, done: any) {
  try {
    const auth: any = req.headers;
    const DaoRes: any = await getChatByEndTimeDao(auth.ext);
    if (DaoRes) {
      res.status(200).send({ statusCode: 200, message: 'Success', result: DaoRes });
    } else {
      res.status(424).send({ statusCode: 424, message: 'failed' });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: 'internal server error' });
  }
}
