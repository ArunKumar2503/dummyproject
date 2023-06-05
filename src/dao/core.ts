import { ioredisChat, mysqlPoolConnection } from '../plugins/db';

import { sessionHistoryModel } from '../models/sessionHistory.models';

/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */
export const createInitiateFeedback = async (data: any) => {
  try {
    return new Promise(async (resolve, reject) => {
      const curtime = Math.floor(Date.now());
      sessionHistoryModel
        .find({ sessionId: data.sessionId })
        .then((sessionRes) => {
          const sessionEndTime = sessionRes[0].agentDisconnectTime;
          const diff = curtime - sessionEndTime;
          // const duration = dispSecondsAsMins(diff);
          sessionHistoryModel
            .updateOne(
              { sessionId: data.sessionId },
              { $set: { category: data.category, disposition: data.disposition, status: data.status, priority: data.priority, summary: data.summary, follow_up_action: data.follow_up_action, wrapTime: diff } }
            )
            .then((res: any) => {
              resolve(res);
            })
            .catch((err: any) => {
              reject(err);
            });
        });
    });
  } catch (err: any) {
    console.log(err);
  }
};

// get initiate feedbach
export const getInitiateFeedback = (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      sessionHistoryModel
        .find({ ext: data })
        .sort({ _id: -1 })
        .then((list: any) => {
          resolve(list);
        });
    } catch (err) {
      reject(err);
    }
  });
};

const dispSecondsAsMins = (seconds: any) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  const seconds_ = seconds - hours * 3600 - minutes * 60;
  const dhours = hours <= 9 ? `0${hours.toString()}` : hours.toString();
  const dminutes = minutes <= 9 ? `0${minutes.toString()}` : minutes.toString();
  const dseconds =
    seconds_ <= 10 ? `0${seconds_.toFixed()}` : seconds_.toFixed();
  return `${dhours}:${dminutes}:${dseconds}`;
};

/**
 *
 * @param data
 * @param bid
 * @returns
 */
export const stateUpdateDao = async (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const curtime = Math.floor(Date.now() / 1000);
      const getAgentState = `SELECT * FROM user where ext = ${data.ext} AND domainId = ${data.domainId}`;
      mysqlPoolConnection.query(getAgentState, (error, results) => {
        if (results[0].state === '4') {
          const updatep = `UPDATE user SET state = '1', stateTimer=${curtime} WHERE ext = ${data.ext} AND domainId = ${data.domainId}`;
          mysqlPoolConnection.query(updatep, (err, result) => {
            if (err) {
              reject(err);
            } else {
              ioredisChat.to(data.ext.toString()).emit('updateAgentState', 'Ready');
              resolve(result);
            }
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
