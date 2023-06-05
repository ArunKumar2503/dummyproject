import { getAgentListS, getFiFOQueueS, getQueueSettingS, updateAgentState } from '../../dao/callflow.dao';
import { createInitiateFeedback, getInitiateFeedback, stateUpdateDao } from '../../dao/core';

/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */
import redis from 'redis';
import { v4 as uuidv4 } from 'uuid';
import { configs } from '../../config/app';
import { RESPONSE } from '../../helpers/constants';
import { redisClient } from '../../plugins/db';

/**
 *
 * @param req
 * @param res
 * @param done
 * ccs login api
 */
export async function createInitiateFeedbackHandler(req: any, res: any, done: any) {
  try {
    const auth: any = req.headers;
    const data: any = {
      uuid: uuidv4(),
      ext: auth.ext,
      domainId: auth.domainId,
      companyId: auth.companyId,
      sessionId: req.body.sessionId,
      category: req.body.category ? req.body.category : null,
      disposition: req.body.disposition ? req.body.disposition : null,
      status: req.body.status ? req.body.status : null,
      priority: req.body.priority ? req.body.priority : null,
      summary: req.body.summary ? req.body.summary : null,
      follow_up_action: req.body.follow_up_action ? req.body.follow_up_action : null,
      insertedAt: new Date(),
    };
    const createInitiateRes: any = await createInitiateFeedback(data);
    stateUpdateDao(data);
    const fifoData: any = {
      username: auth.username,
      domainId: auth.domainId,
    };
    const queueData: any = await getFiFOQueueS(fifoData);
    if (queueData?.length) {
      if (queueData[0]?.queueList?.length > 0) {
        const currentqueueSettings: any = await getQueueSettingS(queueData[0].qid, auth.domainId);
        const currentAgentData: any = await getAgentListS(queueData[0].qid, auth.domainId, queueData[0]?.queueList[0]?.ddi);
        if (currentAgentData) {
          const publishChannel = redisClient.duplicate();
          const nextCustomerData: any = {
            queueData,
            session_id: queueData[0].queueList[0].sessionId,
            req_type: 'QUEUE_CONNECT',
            data: {
              queueSettings: currentqueueSettings,
              agentDetials: currentAgentData,
            },
          };
          publishChannel.publish(configs.responseChannel, JSON.stringify(nextCustomerData));
        }
      }
    }
    if (createInitiateRes) {
      res.status(200).send({ statusCode: 200, message: RESPONSE.update_initiate_feedback });
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
