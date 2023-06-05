import { mysqlPoolConnection } from '../plugins/db';

export const getchanneldata = (sid: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT * FROM callMap WHERE sourceId = '${sid}'`;
      mysqlPoolConnection.query(mysqlq, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(Object.values(JSON.parse(JSON.stringify(result)) ?? 'null'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getBotDetails = (url: number) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT * FROM bot WHERE botChannelId = '${url}'`;
      mysqlPoolConnection.query(mysqlq, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(Object.values(JSON.parse(JSON.stringify(result)) ?? 'null'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
