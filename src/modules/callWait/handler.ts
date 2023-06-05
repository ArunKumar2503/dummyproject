import { createInitiateFeedback, getInitiateFeedback } from '../../dao/core';
import { createQueueWaitTime, deleteQueueWaitTime, getAllQueueWaitTime, getQueueWaitTime, getWaitTimeData, updateQueueWatiTime } from '../../dao/queueWaitTime.dao';

/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */
import { v4 as uuidv4 } from 'uuid';
import { RESPONSE } from '../../helpers/constants';

/**
 *
 * @param req
 * @param res
 * @param done
 * create queue wait
 */
export async function createQueueWaitTimeHandler(req: any, res: any, done: any) {
  try {
    const getwaitTime: any = await getWaitTimeData(req.body.domainId);
    const queueList = req.body.queueList.map((queue: any) => {
      const name = getwaitTime.find((mapdata: any) => mapdata.phoneNumber === queue.ddi);
      return { ...queue, customerName: name?.firstName ?? '' };
    });
    const data: any = {
      queueList,
      qid: req.body.qid,
      queueName: req.body.queueName,
      queueType: req.body.queueType,
      domainId: req.body.domainId,
      insertedAt: new Date(),
    };
    const createqueueRes: any = await createQueueWaitTime(data);
    if (createqueueRes.ok === 1) {
      res.status(200).send({ statusCode: 200, message: RESPONSE.update_queue_waitTime });
    } else {
      res.status(200).send({ statusCode: 200, message: RESPONSE.create_queue_waitTime });
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
export async function getInitiateFeedbackHandlers(req: any, res: any, done: any) {
  try {
    const ext = req.params.ext;
    if (ext !== '') {
      const getInitiateList: any = await getInitiateFeedback(ext);
      if (Array.isArray(getInitiateList) && getInitiateList.length > 0) {
        res.status(200).send({ statusCode: 200, message: RESPONSE.success_message, getInitiateRes: getInitiateList });
      } else {
        res.status(200).send({ statusCode: 404, message: RESPONSE.not_found, getInitiateRes: [] });
      }
    } else {
      res.status(200).send({ statusCode: 424, message: 'ext no should not be empty' });
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
 * ccs login api
 */
export async function updateQueueWatiTimeHandler(req: any, res: any, done: any) {
  try {
    const auth: any = req.headers;
    const uuid = req.params.uuid;
    const data: any = {
      qid: req.body.qid,
      queueName: req.body.queueName,
      queueType: req.body.queueType,
      domainId: req.body.domainId,
      from: req.body.from,
      duration: req.body.duration ? req.body.duration : null,
      updatedAt: new Date(),
    };
    const queueRes: any = await updateQueueWatiTime(data, uuid);
    if (queueRes) {
      res.status(200).send({ statusCode: 200, message: RESPONSE.update_queue_waitTime });
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
export async function deleteQueueWaitTimeHandler(req: any, res: any, done: any) {
  try {
    const data: any = {
      qid: req.body.qid,
      queueName: req.body.queueName,
      queueType: req.body.queueType,
      domainId: req.body.domainId,
      sessionId: req.body.sessionId,
    };
    const deleteBotRes: any = await deleteQueueWaitTime(data);
    if (deleteBotRes) {
      res.status(200).send({ statusCode: 200, message: RESPONSE.deleted_queue_waitTime_successfully });
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
export async function getQueueWaitTimeHandlers(req: any, res: any, done: any) {
  try {
    const auth: any = req.headers;
    const data: any = {
      qid: req.params.qid,
      domainId: auth.domainId,
    };
    if (data.qid !== '') {
      const getQueuList: any = await getQueueWaitTime(data);
      if (getQueuList) {
        res.status(200).send({ statusCode: 200, message: RESPONSE.success_message, getQueueWaitTimeList: getQueuList });
      } else {
        res.status(200).send({ statusCode: 404, message: RESPONSE.not_found, getQueueWaitTimeList: [] });
      }
    } else {
      res.status(200).send({ statusCode: 424, message: 'qid no should not be empty' });
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
export async function getAllQueueWaitTimeHandlers(req: any, res: any, done: any) {
  try {
    const auth: any = req.headers;
    const data: any = {
      domainId: auth.domainId,
    };
    const getAllQueue: any = await getAllQueueWaitTime(data);
    if (Array.isArray(getAllQueue) && getAllQueue.length > 0) {
      res.status(200).send({
        statusCode: 200,
        message: RESPONSE.success_message,
        getAllQueueList: getAllQueue,
      });
    } else {
      res.status(200).send({
        statusCode: 404,
        message: RESPONSE.not_found,
        getAllQueueList: [],
      });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}
