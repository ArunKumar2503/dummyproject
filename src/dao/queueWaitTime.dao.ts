import { queueWaitTimeModel } from '../models/queueWaitTime';
import { mysqlPoolConnection } from '../plugins/db';
/**
 * @description Creat queue wait time
 * @param data
 * @returns
 */
/* export const createQueueWaitTime = async (data: any) => {
  try {
    return await queueWaitTimeModel.create(data);
  } catch (err) {
    return err;
  }
}; */

/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */
export const updateQueueWatiTime = async (data: any, uuid: any) => {
  try {
    return new Promise(async (resolve, reject) => {
      queueWaitTimeModel
        .updateOne({ uuid }, { $set: data })
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
};

/**
 * delete Queue WaitTime
 */
export const deleteQueueWaitTime = async (data: any) => {
  try {
    return queueWaitTimeModel
      .find({ qid: data.qid })
      .then(async (res) => {
        if (res) {
          const newQueueList: any = res[0].queueList.filter((response: any) => {
            return response.sessionId !== data.sessionId;
          });
          await queueWaitTimeModel
            .updateOne({ qid: data.qid }, { $set: { queueList: newQueueList } })
            .then((result: any) => {
              return result;
            })
            .catch((err: any) => {
              return err;
            });
        }
        return res;
      })
      .catch((err) => {
        return err;
      });
  } catch (err: any) { console.log(err); }
};

/**
 *
 * @param data
 * @returns
 */
export const createQueueWaitTime = async (data: any) => {
  try {
    return queueWaitTimeModel
      .find({
        $or: [
          { queueList: { $elemMatch: { sessionId: data.queueList[0].sessionId } } },
          {
            $and: [{ qid: data.qid, domainId: data.domainId }],
          },
        ],
      })
      .then(async (res: any) => {
        if (res.length === 0) {
          return await queueWaitTimeModel.create(data);
        }
        if (res[0].queueList.length === 0) {
          const qs = res[0].queueList;
          const fd = data.queueList;
          return await queueWaitTimeModel.updateMany({ qid: data.qid, domainId: data.domainId }, { queueList: data.queueList });
        }
        if (res[0].queueList.length >= 1) {
          const qs = res[0].queueList;
          const fd = data.queueList;
          const quearr = [...qs, ...fd];
          const ids = quearr.map(o => o.sessionId);
          const filtered = quearr.filter(({ sessionId }, index) => !ids.includes(sessionId, index + 1));
          return await queueWaitTimeModel.updateMany({ qid: data.qid, domainId: data.domainId }, { queueList: filtered });
        }
      })
      .catch((err) => {
        return err;
      });
  } catch (err: any) { console.log(err); }
};

/**
 * get queue wait time
 */
/* export const getQueueWaitTime = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      queueWaitTimeModel
        .findOne({ qid: data.qid, domainId: data.domainId })
        .sort({ _id: -1 })
        .then((list: any) => {
          resolve(list);
        });
    } catch (err) {
      reject(err);
    }
  });
}; */

/**
 * @description get queue wait time
 * @param data
 * @returns
 */
export const getQueueWaitTime = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `select * from queueWeighTime where qid = '${data.qid}' AND domainId = ${data.domainId}`;
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
 * @description get queue wait time
 * @param data
 * @returns
 */
export const getAllQueueWaitTime = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `select * from queueWeighTime where domainId = ${data.domainId} order by qwtId desc`;
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
 * get queue wait time
 */
/* export const getAllQueueWaitTime = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      queueWaitTimeModel
        .find({ domainId: data.domainId })
        .sort({ _id: -1 })
        .then((list: any) => {
          resolve(list);
        });
    } catch (err) {
      reject(err);
    }
  });
}; */

/**
 *
 * @param domainId
 * @returns
 */
export const getWaitTimeData = (domainId: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT phoneNumber,firstName FROM customer_contact WHERE ${domainId}`;
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
