import { ioredisChat, mysqlPoolConnection, notificationMessages } from '../plugins/db';

import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { sessionHistoryModel } from '../models/sessionHistory.models';
import { insertNotificationDao } from './notification.dao';

/**
 *
 * @param data
 * @returns
 */
export const insertDispositionStatus = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const disposition = `INSERT INTO disposition_status (dispositionName,type,description,status,domainId,createdAt, colorCode) VALUES ('${data.dispositionName}','${data.type}','${data.description}',${data.status},${data.domainId},'${currentDate}', '${data.colorCode}')`;
      mysqlPoolConnection.query(disposition, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            did: result.insertId,
            dispositionName: data.dispositionName,
            type: data.type,
            description: data.description,
            status: data.status,
            domainId: data.domainId,
            colorCode: data.colorCode,
            createdAt: currentDate,
            updatedAt: '',
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getAgentListByDomianId = async (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT * FROM user WHERE domainId = ${data.domainId}`;
      mysqlPoolConnection.query(mysqlq, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 *
 * @param data
 * @returns
 */
export const getDispositinStatus = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT * FROM disposition_status a where a.domainId =${data.domainId} order by a.type desc,a.did desc`;
      mysqlPoolConnection.query(mysqlq, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 *
 * @param data
 * @param qdata
 * @returns
 */
export const updateDispositionStatus = (data: any, did: any) => {
  return new Promise((resolve, reject) => {
    try {
      const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const updateq = `UPDATE disposition_status SET dispositionName ='${data.dispositionName}',type = '${data.type}',description = '${data.description}',status = ${data.status},updatedAt = '${currentDate}', colorCode = '${data.colorCode}'  WHERE did =${did} AND domainId = ${data.domainId}`;
      mysqlPoolConnection.query(updateq, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 *
 * @param did
 * @param domainId
 * @returns
 */
export const deleteDisposition = (did: any, data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const dispositionname = `SELECT * from disposition_status WHERE did =${did} AND domainId =${data.domainId}`;
      mysqlPoolConnection.query(dispositionname, (result1) => {
        const agentnames = `SELECT * from user where roleid = 3 AND domainId = ${data.domainId}`;
        mysqlPoolConnection.query(agentnames, (err, result2) => {
          if (err) {
            reject(err);
          } else {
            const arr: any = [];
            for (const resultone of result2) {
              const data1 = {
                id: uuidv4(),
                type: 'Admin deleted disposition status',
                message: `Admin has updated the disposition status ${data.dispositionName}`,
              };
              notificationMessages(data1, resultone.ext);
              insertNotificationDao({
                uuid: data1.id,
                domainId: data.domainId,
                toExt: resultone.ext,
                notificationMsg: data1?.message,
                type: data1.type,
                channelType: 'settings',
                markAsRead: 1,
                timeStamp: new Date().getTime(),
              });
            }
            resolve(result2);
          }
        });
      });
      const updates = `DELETE FROM disposition_status WHERE did =${did} AND domainId =${data.domainId}`;
      mysqlPoolConnection.query(updates, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 *
 * @param data
 * @returns
 */
/* export const updateDisposition = async (data: any) => {
  try {
    return new Promise(async (resolve, reject) => {
      sessionHistoryModel
        .updateMany({ domainId: data.domainId }, { $set: { disposition: data.dispositionName } })
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  } catch (err: any) {
    console.log(err);
  }
}; */

/**
 *
 * @param data
 * @returns
 */
export const updateDisposition = (data: any) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE sessionHistory SET dispositionName = '${data.dispositionName}' WHERE domainId = ${data.domainId}`;
    mysqlPoolConnection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

/**
 *
 * @param data
 * @returns
 */
export const isValidDispositionName = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT * FROM disposition_status WHERE dispositionName= '${data.dispositionName}' AND domainId = ${data.domainId}`;
      mysqlPoolConnection.query(mysqlq, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
/**
 *
 * @param data
 * @returns
 */
/* export const updateDispositionForCall = async (data: any) => {
  try {
    return new Promise(async (resolve, reject) => {
      sessionHistoryModel
        .updateOne({ domainId: data.domainId, sessionId: data.sessionId }, { $set: { summary: data.summary, disposition: data.disposition, dispositionName: data.dispositionName, afterCallWorkTime: data.afterCallWorkTime } })
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  } catch (err: any) {
    console.log(err);
  }
}; */

/**
 *
 * @param data
 * @returns
 */
export const updateDispositionForCall = async (data: any) => {
  try {
    return new Promise(async (resolve, reject) => {
      const disposition = JSON.stringify(data.disposition).replace(/[\/\(\)\']/g, '&apos;');
      const calledPersonDetails = JSON.stringify(data.calledPersonDetails);
      const mysqlq = `UPDATE sessionHistory SET summary = '${data.summary}', disposition = '${disposition}', dispositionName = '${data.dispositionName}', afterCallWorkTime = ${data.afterCallWorkTime},calledPersonDetails = '${calledPersonDetails}',subject = '${data.subject}' WHERE domainId = ${data.domainId} AND sessionId = '${data.sessionId}'`;
      mysqlPoolConnection.query(mysqlq, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
        const updatep = `UPDATE user SET isVoice = 1 AND statusName = 'Ready' WHERE ext = ${data.ext} AND domainId = ${data.domainId}`;
        mysqlPoolConnection.query(updatep, (err, results) => {
          if (err) {
            reject(err);
          } else {
            ioredisChat.emit('updatedstatus', { statusName: 'Ready' });
            resolve(results);
          }
        });
      });
    });
  } catch (err: any) {
    console.log(err);
  }
};

/**
 *
 * @param data
 * @returns
 */
export const updateCalledPersonDetailsCall = (data: any) => {
  return new Promise((resolve, reject) => {
    const calledPersonDetails = JSON.stringify(data.calledPersonDetails);
    const query = `UPDATE sessionHistory SET calledPersonDetails = '${calledPersonDetails}' WHERE domainId = ${data.domainId} AND sessionId = '${data.sessionId}'`;
    mysqlPoolConnection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};
