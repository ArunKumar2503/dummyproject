import moment from 'moment';
import { mysqlPoolConnection } from '../../src/plugins/db';
import { ioredisChat } from '../plugins/db';
/**
 *
 * @param data
 * @returns
 *
 */

// getDefaultEmail

export const getEmailAddress = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT * FROM email_config WHERE domainId= ${data.domainId} AND ORDER BY createdAt ASC`;
      mysqlPoolConnection.query(mysqlq, (err: any, getResult: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(getResult);
        }
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

// InsertEmail

export const insertEmailChannel = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const insertEmailData = `INSERT INTO email_config (uid, emailAddress, aliasName, queue, emailThreshold,isEmail, domainId, createdAt, updatedAt) VALUES
     ('${data.uid}', '${data.emailAddress}', '${data.aliasName}', '${data.queue}', ${data.emailThreshold}, ${data.isEmail}, ${data.domainId},'${currentDate}', '${currentDate}')`;

      mysqlPoolConnection.query(insertEmailData, (err: any, insertResult: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(insertResult);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

// DeleteEmail

export const emailDeleteFunction = (data: any, uid: any) => {
  return new Promise((resolve, reject) => {
    try {
      const deletedEmail = `delete FROM email_config WHERE uid = '${uid}' AND domainId = ${data.domainId}`;
      mysqlPoolConnection.query(deletedEmail, (err: any, deleteResult: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(deleteResult);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

// updateEmailPrimaryKey

export const primaryKeyUpdateFunction = (data: any, uid: any) => {
  return new Promise((resolve, reject) => {
    try {
      const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const updatedEmail = `UPDATE email_config SET isEmail = ${data.isEmail}, updatedAt = '${currentDate}' WHERE uid = '${uid}' AND domainId = ${data.domainId}`;
      mysqlPoolConnection.query(updatedEmail, (err: any, updateResult: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(updateResult);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const insertImapInboxData = async (data: any) => {
  const domainId = data?.domainId ? data?.domainId : 0;
  return new Promise((resolve, reject) => {
    try {
      const query = `INSERT INTO imap_inbox (mail_data, domainId, sessionStartTime) VALUES ( '${JSON.stringify(data)}',  ${domainId}, '${
        data.customerData.sessionStartTime
      }')`;
      mysqlPoolConnection.query(query, (err: any, results: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
};

export const createEmailSessionDao = async () => {
  return new Promise((resolve, reject) => {
    try {
      const query = 'SELECT * FROM imap_inbox';
      mysqlPoolConnection.query(query, (err: any, result1: any) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(result1);
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
};

export const createEmailSessionHistory = (data: any, id: any) => {
  return new Promise(async (resolve, reject) => {
    const customerData = JSON.stringify(data?.customerData);
    const message = data?.message;
    try {
      mysqlPoolConnection.query(
        'call ccaas_session_history_details(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,??,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          id,
          data?.sessionStartTime ?? null,
          data?.sessionEndTime ?? null,
          data?.botStartTime ?? null,
          data?.botEndTime ?? null,
          data?.agentConnectTime ?? null,
          data?.agentDisconnectTime ?? null,
          data?.ipAddress ?? null,
          data?.source ?? null,
          data?.lastMessage ?? null,
          data?.botDetails ?? null,
          data?.category ?? null,
          false,
          data?.agentComments ?? null,
          data?.agentDetails ?? null,
          data?.cli ?? null,
          data?.browser ?? null,
          data?.OS ?? null,
          true,
          data?.skillsIdentify ?? null,
          data?.callFlowSourceId ?? null,
          data?.channelType ?? 'Email',
          data?.location ?? null,
          data?.deviceType ?? null,
          customerData ?? null,
          data.domainId ?? null,
          data?.companyId ?? null,
          data?.disposition ?? null,
          data?.status ?? null,
          data?.priority ?? null,
          data?.summary ?? null,
          data?.follow_up_action ?? null,
          data?.recordingUrl ?? null,
          data?.callType ?? null,
          data?.queue ?? null,
          data?.wrapTime ?? null,
          data?.botDuration ?? null,
          data?.agentDuration ?? null,
          data?.agentRecordingUrl ?? null,
          data?.disconnectedBy ?? null,
          data?.qid ?? null,
          data?.assigned ?? null,
          data?.assignedTo ?? null,
          data?.assignedBy ?? null,
          data?.waitDuration ?? null,
          data?.agentHoldDuration ?? null,
          data?.dialDuration ?? null,
          data?.calledNumber ?? null,
          data?.queueDuration ?? null,
          data?.queueName ?? null,
          data?.callDuration ?? null,
          message ?? null,
          data?.customerFile ?? null,
          data?.agentName ?? null,
          data?.skillName ?? null,
          data?.dispositionName ?? null,
          data?.afterCallWorkTime ?? null,
          data?.callRecorded === 1 ? 1 : 0 ?? null, // Recording type: If call is recorded or not
          data?.callDuration ?? null, // Recording duration: Same as call duration
          data?.transferred ?? null,
          data?.activeChatTime ?? null,
          data?.responseTime ?? null,
          data?.assignedOn ?? null,
          data?.chatSession ?? null,
          data?.transferredTo ?? null,
          data?.markAsRead ?? null,
          data?.agentStatus ?? null,
          data?.calledPersonDetails ?? null,
          data?.subject ?? null,
          data?.primarySkill ?? null,
          data?.primaryAgent ?? null,
          data?.transferredSkill ?? null,
          data?.transferredAgent ?? null,
          data?.primaryQueue ?? null,
          data?.transferredQueue ?? null,
          data?.transferredTime ?? null,
          data?.transferredType ?? null,
          data?.voicemailUrl ?? null,
          data?.vmsTranscript ?? null,
          data?.callBackDetails ?? null,
        ],
        (err: any, result2: any) => {
          if (err) {
            reject(err);
            console.log(err);
          }
          resolve(result2);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

export const checkExistUser = async (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const query = `SELECT * FROM sessionHistory WHERE JSON_EXTRACT(customerData, '$.fromData') = '${data?.customerData?.fromData}'
       AND JSON_EXTRACT(customerData, '$.subjectData')='${data?.customerData?.subjectData}'`;
      mysqlPoolConnection.query(query, (err: any, resultt: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(resultt);
        }
      });
    } catch (err) {
      return err;
    }
  });
};

export const findEmailRoutedQueue = async (data: any) => {
  return new Promise((resolve, reject) => {
    let email: any;
    const field = data.customerData.toData;
    if (field.includes('<') && field.includes('>')) {
      const startIndex = field.indexOf('<') + 1;
      const endIndex = field.indexOf('>');
      email = field.substring(startIndex, endIndex);
    } else {
      email = field;
    }
    try {
      const query = `SELECT * FROM  email_config WHERE emailAddress LIKE '%${email}%'`;
      mysqlPoolConnection.query(query, (err: any, resultt: any) => {
        if (err) {
          reject(err);
        } else {
          const queries = `SELECT * FROM queue WHERE qid=${resultt[0]?.q_id}`;
          mysqlPoolConnection.query(queries, (error: any, results: any) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          });
        }
      });
    } catch (err) {
      return err;
    }
  });
};

export const getAgentDetailsForEmail = async (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const query = `SELECT * FROM user where domainId=${data.domainId} AND statusName='Ready' AND isEmail=1 AND roleid != 2`;
      mysqlPoolConnection.query(query, (errs: any, result1: any) => {
        if (errs) {
          reject(errs);
        } else {
          resolve(result1);
        }
      });
    } catch (err) {
      return err;
    }
  });
};

export const deleteImapMail = async (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const query = `DELETE FROM imap_inbox WHERE JSON_CONTAINS(mail_data, '{"customerData" : ${JSON.stringify(data?.customerData)}}')`;
      mysqlPoolConnection.query(query, (err: any, result2: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result2);
        }
      });
    } catch (err) {
      return err;
    }
  });
};

// export const acceptAgentRequest = async (data: any, id: any) => {
//   return new Promise((resolve, reject) => {
//     try {

//     } catch (err) {
//       return err;
//     }
//   });
// };
