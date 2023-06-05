import console from 'console';
import moment from 'moment';
import { notificationModel } from '../models/notification.model';
import { mysqlPoolConnection } from '../plugins/db';

/**
 * @description Create a Notification data
 * @param data
 * @returns
 */
/* export const insertNotificationDao = async (data: any) => {
  try {
    return await notificationModel.create(data);
  } catch (err) {
    return err;
  }
}; */

/* export const getNotificationDao = async (data: any) => {
  try {
    return await notificationModel.find({ $and: [{ toExt: data.ext }, { domainId: data.domainId }, { timeStamp: { $gte: data.timeStamp } }] }).sort({ _id: -1 });
  } catch (err) {
    return err;
  }
}; */

/* export const deleteNotificationDao = async (data: any) => {
  try {
    return await notificationModel.deleteMany({ $and: [{ toExt: data.ext }, { domainId: data.domainId }] });
  } catch (err) {
    return err;
  }
}; */

/* export const updateMarkAsReadNotificationDao = async (data: any) => {
  try {
    if (data.uuid === 'All') {
      return await notificationModel.updateMany({ domainId: data.domainId, toExt: data.ext }, { $set: { markAsRead: 0 } });
    }
    return await notificationModel.updateOne({ uuid: data.uuid }, { $set: { markAsRead: 0 } });

  } catch (err) {
    return err;
  }
}; */

/**
 *  create a notification
 */
export const insertNotificationDao = (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      mysqlPoolConnection.query('call ccaas_notification_details(?,?,?,?,?,?,?,?)', [
        data.uuid,
        data.domainId,
        data.toExt,
        data.notificationMsg,
        data.markAsRead,
        data.timeStamp,
        data.type,
        data.channelType,
      ],                        (err: any, result: any) => {
        if (err) {
          reject(err);
          console.log(err);
        }
        resolve(result);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @description Get notifications
 * @param data
 * @returns
 */
export const getNotificationDao = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT * FROM notification WHERE domainId = ${data.domainId} AND toExt = ${data.ext} AND timestamp >= '${data.timeStamp}' order by nId DESC`;
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
 * @description delete notifications
 * @param data
 * @returns
 */
export const deleteNotificationDao = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `DELETE FROM notification WHERE domainId = ${data.domainId} AND toExt = ${data.ext}`;
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
export const updateMarkAsReadNotificationDao = async (data: any) => {
  try {
    if (data.uuid === 'All') {
      const sql = `UPDATE notification SET markAsRead = 0 WHERE domainId = ${data.domainId} AND toExt = ${data.ext}`;
      return await mysqlPoolConnection.query(sql);
    }  {
      const sql = `UPDATE notification SET markAsRead = 0 WHERE domainId = ${data.domainId} AND uuid = '${data.uuid}'`;
      return await mysqlPoolConnection.query(sql);
    }
  } catch (err) {
    return err;
  }
};

export const agentExtDao = async (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `SELECT * FROM user where domainId=${data.domainId} AND name='${data.assignedTo}'`;
      mysqlPoolConnection.query(sql, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result[0]);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
