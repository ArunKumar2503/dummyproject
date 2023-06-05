/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */
import moment from 'moment';
import { mysqlPoolConnection } from '../plugins/db';

/**
 *
 * @param data
 * @returns
 */
export const createState = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const state = `INSERT INTO state_timer (state,ext,domainId,timestamp,createdAt) VALUES ('${data.state}',${data.ext}, ${data.domainId},'${data.timestamp}','${currentDate}')`;
      mysqlPoolConnection.query(state, (err, result) => {
        if (err) {
          reject(err);
        } else {
          const getState = `select * from state_timer where ext = ${data.ext} and domainId = ${data.domainId} ORDER BY stid DESC LIMIT 1 OFFSET 1`;
          mysqlPoolConnection.query(getState, (error, getStates) => {
            if (getStates.length > 0) {
              const oldTimestamp = getStates[0].timestamp;
              const difference = data?.timestamp - oldTimestamp;
              const updateQuery = `UPDATE state_timer SET stateDuration = ${difference} where stid = ${getStates[0].stid} AND ext = ${data.ext} AND domainId = ${data.domainId}`;
              mysqlPoolConnection.query(updateQuery, (er, update) => {
                if (er) {
                  reject(er);
                } else {
                  resolve(update);
                }
              });
            } else {
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

/**
 *
 * @param data
 * @returns
 */
/* export const createStateTimer = async (data: any) => {
  try {
    return await stateTimerModel.create(data);
  } catch (err) {
    return err;
  }
}; */

/**
 *
 * @param data
 * @returns
 */
export const getStateListBy = (ext: number) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT * FROM state_timer WHERE ext = '${ext}'`;
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
 * @param data
 * @param qdata
 * @returns
 */
export const updateUserState = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const selectQuery = `SELECT * FROM user WHERE emailId ='${data.emailId}'`;
      mysqlPoolConnection.query(selectQuery, (err, result) => {
        if (err) {
          reject(err);
        } else {
          let updateU: any = JSON.stringify(result);
          updateU = JSON.parse(updateU ?? 'null');
          if (updateU.length === 1) {
            const update = [data.emailId, data.state, data.stateTimer, data.active_channel];
            if (data.state === 5) {
              const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
              let updateq = 'UPDATE user a  SET ';
              updateq += data.state ? `a.state = ifNull('${data.state}',a.state),` : '';
              updateq += data.stateTimer ? `a.stateTimer = ifNull('${data.stateTimer}',a.stateTimer),` : '';
              updateq += data.active_channel ? `a.active_channel = ifNull('${data.active_channel}',a.active_channel),` : '';
              updateq += `a.updatedAt = '${currentDate}' WHERE a.emailId = '${data.emailId}'`;
              mysqlPoolConnection.query(updateq, update, (error, updateResult) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(updateResult);
                }
              });
            } else {
              const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
              let updateq = 'UPDATE user a  SET ';
              updateq += data.state ? `a.state = ifNull('${data.state}',a.state),` : '';
              updateq += data.stateTimer ? `a.stateTimer = ifNull('${data.stateTimer}',a.stateTimer),` : '';
              updateq += `a.updatedAt = '${currentDate}' WHERE a.emailId = '${data.emailId}'`;
              mysqlPoolConnection.query(updateq, update, (error, updateResult) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(updateResult);
                }
              });
            }
          }
          /* else {
            const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            const mysqlq = `INSERT IGNORE INTO user (emailId,state,stateTimer,active_channel)
        VALUES ('${data.emailId}',${data.state},'${data.stateTimer}','${data.active_channel}')`;
            ;

            mysqlPoolConnection.query(mysqlq, (errr, resultt) => {
              if (errr) {
                ;
                reject(errr);
              } else {
                result.flag = 2;
                ;

                resolve(resultt);
              }
            });
          } */
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
