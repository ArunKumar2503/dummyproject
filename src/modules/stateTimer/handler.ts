import { getAgentListS, getFiFOQueueS, getQueueSettingS, updateAgentState } from '../../dao/callflow.dao';
import { createState, getStateListBy, updateUserState } from '../../dao/state';

/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */
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
export async function createStateHandler(req: any, res: any, done: any) {
  try {
    const auth: any = req.headers;
    const data: any = {
      ext: auth.ext,
      domainId: auth.domainId,
      timestamp: req?.body?.timestamp ?? 0,
      state: req?.body?.state ?? null,
      uuid: uuidv4(),
    };
    const createStateRes: any = await createState(data);
    if (createStateRes) {
      res.status(200).send({ statusCode: 200, message: RESPONSE.create_State });
    } else {
      res.status(200).send({ statusCode: 404, message: RESPONSE.not_found });
    }
  } catch (err) {
    req.log.error(err);
    console.log(err);

    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}

/**
 *
 * @param req
 * @param res
 * @param done
 */
export async function getStateListByHandlers(req: any, res: any, done: any) {
  try {
    const ext = req.params.ext;
    if (ext !== '') {
      const getStateList: any = await getStateListBy(ext);
      if (Array.isArray(getStateList) && getStateList.length > 0) {
        res.status(200).send({ statusCode: 200, message: RESPONSE.success_message, getStateListRes: getStateList });
      } else {
        res.status(200).send({ statusCode: 404, message: RESPONSE.not_found, getStateListRes: [] });
      }
    } else {
      res.status(200).send({ statusCode: 424, message: 'bid no should not be empty' });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}

/**
 * update user
 * @param req
 * @param res
 * @param done
 */
export async function updateUserStateHandler(req: any, res: any, done: any) {
  try {
    const auth: any = req.headers;
    const body: any = req.body;
    const data: any = {
      emailId: auth.username,
      state: body.state,
      stateTimer: body.stateTimer,
      active_channel: body.active_channel,
    };
    await updateUserState(data);
    if (body.state === 1) {
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
    }
    res.status(200).send({ statusCode: 200, message: RESPONSE.User_update_state_success });
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}
