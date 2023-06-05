import console, { Console } from 'console';
import { mysqlPoolConnection, notificationMessages } from '../plugins/db';

import { v4 as uuidv4 } from 'uuid';
import { sessionHistoryModel } from '../models/sessionHistory.models';
import { insertNotificationDao } from './notification.dao';

/**
 * @description Creat call flow history
 * @param data
 * @returns
 */
/* export const callflowhistory = async (data: any) => {
  try {
    return await callflowhistoryModel.create(data);
  } catch (err) {
    return err;
  }
}; */

/**
 * @description Creat call flow history
 * @param data
 * @returns
 */
export const callflowhistory = (data: any, nodeData: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      mysqlPoolConnection.query(
        'call ccaas_call_Flow_history_details(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          data?.cfid,
          data?.templateName,
          nodeData.node,
          nodeData.edge,
          data?.version,
          data?.type,
          data?.createDate,
          data?.lastModifiedDate,
          data?.uuid,
          data?.status,
          data?.companyId,
          data?.domainId,
          data?.callFlowStatus,
          data?.description,
          data?.publishedDataArr,
        ],
        (err: any, result: any) => {
          if (err) {
            reject(err);
            console.log(err);
          }
          resolve(result);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

/**
 *
 * @param qid
 * @param domainId
 * @returns
 */
export const getQueueSettingS = (qid: any, domainId: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlqs = `SELECT * FROM queue WHERE qid = ${qid} AND domainId = ${domainId} `;
      mysqlPoolConnection.query(mysqlqs, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 *
 * @param qid
 * @param domainId
 * @returns
 */
export const getQueueSettings = (qid: any, domainId: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlqs = `SELECT * FROM queue WHERE qid = ${qid} AND domainId = ${domainId} `;
      mysqlPoolConnection.query(mysqlqs, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
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
export const getFiFOQueueS = (data: any) => {
  try {
    return new Promise(async (resolve, reject) => {
      const selectQuery = `SELECT * FROM user WHERE emailId ='${data.username}' AND domainId='${data.domainId}'`;
      mysqlPoolConnection.query(selectQuery, (err, result) => {
        if (err) {
          reject(err);
        } else {
          const mysqlqs = `SELECT * FROM routingqueueprofilemapping WHERE rqmid = ${result[0]?.routing_profile} `;
          mysqlPoolConnection.query(mysqlqs, (error, res) => {
            if (error) {
              reject(error);
            }
            const selectedQueue: any = res?.sort((x, y) => {
              return x.priority - y.priority;
            });
            selectedQueue?.map((queue: any) => {
              const query = `SELECT * FROM queueWeighTime WHERE qid = ${queue.qid}`;
              mysqlPoolConnection.query(query, (er, results) => {
                if (er) {
                  reject(er);
                } else {
                  if (results[0]?.queueList?.length > 0) {
                    resolve(results);
                  }
                }
              });
            });
          });
        }
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
export const updateAgentState = (data: any) => {
  return new Promise((resolve, reject) => {
    const StateTimer = Math.floor(Date.now() / 1000);
    try {
      const UpdateState = `UPDATE user SET state= '10', stateTimer=${StateTimer} WHERE domainId = ${data.domainId} AND ext = ${data.ext} `;
      mysqlPoolConnection.query(UpdateState, (err, Update) => {
        if (err) {
          reject(err);
        } else {
          resolve(Update);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 *
 * @param qid
 * @param domainId
 * @param calledNumber
 * @returns
 */
export const getAgentListS = (qid: any, domainId: any, calledNumber: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlqs = `SELECT * FROM routingqueueprofilemapping WHERE qid = ${qid} `;
      mysqlPoolConnection.query(mysqlqs, (err, results) => {
        if (err) {
          reject(err);
        } else {
          const rqSetvalue: any = [];
          const mapres: any = results?.map((data: any) => rqSetvalue.push(data.rqmid));
          if (calledNumber !== '436889116888') {
            const mysqlq = `SELECT * FROM user WHERE routing_profile IN (${rqSetvalue?.toString()}) AND state = 1 AND domainId = ${domainId} AND ext != 225 `;
            mysqlPoolConnection.query(mysqlq, (errors, res) => {
              const resultArray: any = res.sort((x, y) => {
                return x.stateTimer - y.stateTimer;
              });
              resolve(resultArray[0]);
              if (errors) {
                reject([]);
              }
            });
          } else {
            const mysqlqso = `SELECT * FROM user WHERE routing_profile IN (${rqSetvalue?.toString()}) AND state = 1 AND domainId = ${domainId} AND ext = 225`;
            mysqlPoolConnection.query(mysqlqso, (erro, result) => {
              if (erro) {
                reject([]);
              }
              if (result.length > 0) {
                resolve(result[0]);
              } else {
                const mysqlqq = `SELECT * FROM user WHERE routing_profile IN (${rqSetvalue?.toString()}) AND state = 1 AND domainId = ${domainId} `;
                mysqlPoolConnection.query(mysqlqq, (errors, resultss) => {
                  const resultArray: any = resultss.sort((x, y) => {
                    return x.stateTimer - y.stateTimer;
                  });
                  resolve(resultArray[0]);
                  if (errors) {
                    reject([]);
                  }
                });
              }
            });
          }
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 *
 * @param qid
 * @returns
 */
export const getAgentList = (qid: any) => {
  return new Promise((resolve, reject) => {
    try {
      let domainId: any = '';
      const mysqlqq = `SELECT * FROM queue WHERE qid = ${qid} `;
      mysqlPoolConnection.query(mysqlqq, (error, res) => {
        domainId = res[0].domainId;
        const mysqlqs = `SELECT * FROM routingqueueprofilemapping WHERE qid = ${qid} `;
        mysqlPoolConnection.query(mysqlqs, (err, results) => {
          if (err) {
            reject(err);
          } else {
            const mysqlq = `SELECT * FROM user WHERE routing_profile = ${results[0]?.rqmid} AND state = 1 AND domainId = ${domainId}`;
            mysqlPoolConnection.query(mysqlq, (errors, result) => {
              const resultArray: any = result.sort((x, y) => {
                return x.stateTimer - y.stateTimer;
              });
              resolve(resultArray);
              if (errors) {
                reject([]);
              }
            });
          }
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * @description Creat call flow
 * @param data
 * @returns
 */

/* export const savecallflow = async (data: any) => {
  try {
    const isAvailable = await callflowModel.find({ cfid: data.cfid });
    if (isAvailable && isAvailable.length > 0) {
      const updateDate: any = {};
      updateDate.templateName = data.templateName;
      updateDate.nodes = data.nodes;
      updateDate.edges = data.edges;
      updateDate.version = data.version;
      updateDate.lastModifiedDate = Date.now();
      updateDate.uuid = data.uuid;
      updateDate.callFlowStatus = data.callFlowStatus;
      updateDate.status = data.status;
      updateDate.description = data.description;
      return await callflowModel
        .updateOne({ cfid: data.cfid }, { $set: updateDate })
        .then((res: any) => res)
        .catch((err: any) => {
          console.log(err);
        });
    }
    return await callflowModel
      .create(data)
      .then((res: any) => res)
      .catch((err: any) => {
        console.log(err);
      });

    // const adata = await callflowModel.find({ cfid: data.cfid }).then(async (res) => {
    //   if (res && res.length > 0) {
    //     const updateDate: any = {};
    //     updateDate.templateName = data.templateName;
    //     updateDate.nodes = data.nodes;
    //     updateDate.edges = data.edges;
    //     updateDate.version = data.version;
    //     updateDate.lastModifiedDate = Date.now();
    //     updateDate.uuid = data.uuid;
    //     updateDate.callFlowStatus = data.callFlowStatus;
    //     callflowModel.updateOne({ cfid: data.cfid }, { $set: updateDate }).then((result) => {
    //       ;
    //       return result;
    //     }).catch((err) => {
    //       ;
    //       return err;
    //     });
    //   } else {
    //     const adat = await callflowModel.create(data).then((result)=>{

    //       ;
    //       return result;
    //     }).catch((e)=>{
    //       ;
    //     });
    //     // return true;
    //     ;
    //   }
    // }).catch((err1) => {
    //   ;
    //   return err1;
    // });
    // ;
  } catch (err2) {
    return err2;
  }
}; */

/**
 *  savecallflow
 */
export const savecallflow = (data: any, nodeData: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      mysqlPoolConnection.query(
        'call ccaas_call_Flow_details(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          data?.cfid,
          data?.templateName,
          nodeData?.node,
          nodeData?.edge,
          data?.version,
          data?.type,
          data?.createDate,
          data?.lastModifiedDate,
          data?.uuid,
          data?.status,
          data?.companyId,
          data?.domainId,
          data?.callFlowStatus,
          data?.description,
          data?.publishedDataArr,
        ],
        (err: any, result: any) => {
          if (err) {
            reject(err);
            console.log(err);
          }
          resolve(result);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @description Get Call flow list
 * @param data
 * @returns
 */

/* export const callFlowList = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      callflowModel
        .find({ domainId: data.domainId }, { _id: 0, __v: 0 })
        .sort({ lastModifiedDate: -1 })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
}; */

/**
 * @description Get Call flow list
 * @param data
 * @returns
 */
export const callFlowList = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT * FROM callFlow where domainId =${data.domainId} order by cid desc`;
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
 * @description Get Call flow Details
 * @param data
 * @returns
 */
export const callFlowDetails = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT * FROM callFlow where domainId = ${data.domainId} AND cfid = '${data.cfid}'`;
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
 * @description Get Call flow Details by cfid
 * @param data
 * @returns
 */
export const callFlowDetailByCfid = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT * FROM callFlowHistory where domainId = ${data.domainId} AND cfid = '${data.cfid}'`;
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
 * @description Get Call flow Details
 * @param data
 * @returns
 */
/* export const callFlowDetails = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      callflowhistoryModel
        .find({ cfid: data.cfid }, { _id: 0 })
        .sort({ createDate: -1 })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
}; */

/**
 * @description Get Call flow list
 * @param data
 * @returns
 */

export const getAllActive = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      let channelType: any;
      if (data.channelType === 'All') {
        channelType = { $in: ['Chat', 'Call'] };
      } else {
        channelType = data.channelType;
      }
      let offset;
      if (data.offset > 0) {
        offset = data.offset * 10;
      } else {
        offset = data.offset;
      }
      sessionHistoryModel
        .find({
          $and: [
            {
              channelType,
              domainId: data.domainId,
              sessionStartTime: {
                $gte: data.fromDate,
                $lte: data.toDate,
              },
              $or: [
                {
                  customerDetails: { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
                {
                  callType: { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
                {
                  callDuration: { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
                {
                  summary: { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
                {
                  disposition: { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
              ],
              agentDetails: { $in: data.ext },
            },
          ],
        })
        .sort({ _id: -1 })
        .skip(offset)
        .limit(data.limit)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * total Voice call count
 * @param data
 * @returns
 */
/* export const getAllActivityCount = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      sessionHistoryModel
        .find({
          $and: [
            {
              domainId: data.domainId,
              sessionStartTime: {
                $gte: data.fromDate,
                $lte: data.toDate,
              },
              agentDetails: { $in: data.ext },
            },
          ],
        })
        .count()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
}; */

/**
 * @description Get Call flow list
 * @param data
 * @returns
 */

/* export const getAgentCall = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      //
      sessionHistoryModel
        .find({ agentDetails: { $in: data }, channelType: 'Call' })
        .sort({ _id: -1 })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
}; */

/**
 * @description Get Call flow list
 * @param data
 * @returns
 */
export const getAgentCall = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await mysqlPoolConnection.query("SELECT * FROM sessionHistory WHERE agentDetails IN (?) AND channelType = 'Call' ORDER BY shid DESC", [data]);
      resolve(res);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @description Get Call flow list
 * @param data
 * @returns
 */

/* export const getAgentChat = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      //
      sessionHistoryModel
        .find({ agentDetails: { $in: data }, channelType: 'Chat' })
        .sort({ _id: -1 })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
}; */

/**
 * @description Get Call flow list
 * @param data
 * @returns
 */
export const getAgentChat = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await mysqlPoolConnection.query("SELECT * FROM sessionHistory WHERE agentDetails IN (?) AND channelType = 'Chat' ORDER BY shid DESC", [data]);
      resolve(res);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @description Get sessionId flow list
 * @param data
 * @returns
 */

/* export const getSessionIdDao = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      conversationHistoryModel
        .findOne({ sessionId: data.sessionId })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
}; */

/**
 * @description Get sessionId flow list
 * @param data
 * @returns
 */
export const getSessionIdDao = (sessionId: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT * FROM conversationHistory WHERE sessionId = '${sessionId}'`;
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
 * @description Get call back list
 * @param data
 * @returns
 */

/* export const getCallBackList = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      let channelType;
      if (data.channelType === 'All') {
        channelType = { $in: ['Chat', 'Call', 'Email', 'Sms'] };
      } else {
        channelType = data.channelType;
      }
      let offset;
      if (data.offset > 0) {
        offset = data.offset * 10;
      } else {
        offset = data.offset;
      }
      sessionHistoryModel
        .find({
          $and: [
            {
              channelType,
              domainId: data.domainId,
              sessionStartTime: {
                $gte: data.fromDate,
                $lte: data.toDate,
              },
              agentDetails: { $in: data.ext },
              disposition: { $in: ['missed', 'abandoned'] },
            },
            {
              $or: [
                {
                  'customerData.FirstName': { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
                {
                  'customerData.LastName': { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
                {
                  'customerData.MobileNo': { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
                {
                  'customerData.Email': { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
                {
                  queue: { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
                {
                  callType: { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
                {
                  disposition: { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
              ],
            },
          ],
        })
        .sort({ _id: -1 })
        .skip(offset)
        .limit(data.limit)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
}; */

/**
 * get CallBack List
 * @param data
 * @returns
 */
export const getCallBackList = (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      mysqlPoolConnection.query(
        'call ccass_get_callback_session_history_details(?,?,?,?,?,?,?,?,?)',
        [data.domainId, data.channelType, data.fromDate, data.toDate, data?.resultExt ?? null, data?.assigned_ext ?? null, data.search, data.offset, data.limit],
        (err: any, result: any) => {
          if (err) {
            reject(err);
          }
          resolve(result?.length ? result[0] : {});
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @description Get call back list
 * @param data
 * @returns
 */

/* export const getCallBackCount = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      sessionHistoryModel
        .find({
          $and: [
            {
              domainId: data.domainId,
              sessionStartTime: {
                $gte: data.fromDate,
                $lte: data.toDate,
              },
              agentDetails: { $in: data.ext },
              disposition: { $in: ['missed', 'abandoned'] },
            },
          ],
        })
        .count()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
}; */
/**
 * get voice call list
 * @param data
 * @returns
 */
export const getVoiceCallList = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      let channelType;
      if (data.channelType === 'All') {
        channelType = { $in: ['Chat', 'Call', 'Email', 'Sms'] };
      } else {
        channelType = data.channelType;
      }
      let disposition;
      if (data.disposition === 'All') {
        disposition = { $in: ['Resolved', 'Unresolved', 'Transferred', 'Closed', 'Follow-Up', 'DoNotContact'] };
      } else {
        disposition = data.disposition;
      }
      let callType;
      if (data.callType === 'All') {
        callType = { $in: ['inbound', 'outbound'] };
      } else {
        callType = data.callType;
      }
      let offset;
      if (data.offset > 0) {
        offset = data.offset * 10;
      } else {
        offset = data.offset;
      }
      sessionHistoryModel
        .find({
          $and: [
            {
              channelType,
              disposition,
              callType,
              domainId: data.domainId,
              sessionStartTime: {
                $gte: data.fromDate,
                $lte: data.toDate,
              },
              agentDetails: { $in: data.ext },
            },
            {
              $or: [
                {
                  'customerData.FirstName': { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
                {
                  'customerData.LastName': { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
                {
                  'customerData.MobileNo': { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
                {
                  'customerData.Email': { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
                {
                  queue: { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
                {
                  callType: { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
                {
                  disposition: { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
              ],
            },
          ],
        })
        .sort({ _id: -1 })
        .skip(offset)
        .limit(data.limit)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
};

export const getRoleIdList = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      if (data.emailId) {
        const mysqlqs = `SELECT ext FROM user WHERE report_to = '${data.emailId}'`;
        mysqlPoolConnection.query(mysqlqs, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const getCallFlowNodes = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlqs = `SELECT * FROM callFlow WHERE cfid = '${data.cfid}'`;
      mysqlPoolConnection.query(mysqlqs, (err: any, results: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * total Voice call count
 * @param data
 * @returns
 */
/* export const getVoiceListCount = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      sessionHistoryModel
        .find({
          $and: [
            {
              domainId: data.domainId,
              sessionStartTime: {
                $gte: data.fromDate,
                $lte: data.toDate,
              },
              agentDetails: { $in: data.ext },
            },
          ],
        })
        .countDocuments()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
}; */

/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */
/* export const assignCallBack = async (data: any) => {
  try {
    return new Promise(async (resolve, reject) => {
      sessionHistoryModel
        .updateOne(
          { sessionId: data.sessionId, agentDetails: data.ext, domainId: data.domainId },
          { $set: { assignedTo: data.assignedTo, assignedBy: data.assignedBy, assigned: true } }
        )
        .then((res: any) => {
          const data1 = {
            id: uuidv4(),
            type: 'Call back assigned by supervisor',
            message: `Callback assigned by ${data.assignedBy} Callback to <Customer Name or Mobile Number> ${data.sessionId}`,
          };
          notificationMessages(data1, data.ext);
          insertNotificationDao({
            uuid: data1.id,
            domainId: data.domainId,
            toExt: data.ext,
            notificationMsg: data1.message,
            type: data1.type,
            channelType: 'call',
            markAsRead: 1,
            timeStamp: new Date().getTime(),
          });
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
export const assignCallBack = async (data: any) => {
  try {
    return new Promise(async (resolve, reject) => {
      // const res = await mysqlPoolConnection.query(
      //   'UPDATE sessionHistory SET assignedTo = ?, assignedBy = ?, assigned = ? assignedOn = ? WHERE sessionId = ? AND agentDetails = ? AND domainId = ?',
      //   [data.assignedTo, data.assignedBy, 0, data.assignedOn,  data.sessionId, data.ext, data.domainId]
      // );
      const assignToData = JSON.stringify(data?.assignedTo);
      mysqlPoolConnection.query(
        'call ccaas_session_history_details(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          data?.session_id,
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
          true,
          data?.agentComments ?? null,
          data?.agentDetails ?? null,
          data?.cli ?? null,
          data?.browser ?? null,
          data?.OS ?? null,
          true,
          data?.skillsIdentify ?? null,
          data?.callFlowSourceId ?? null,
          data?.channelType,
          data?.location ?? null,
          data?.deviceType ?? null,
          data?.customerData ?? null,
          data?.domainId ?? null,
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
          assignToData ?? null,
          data?.assignedBy ?? null,
          data?.waitDuration ?? null,
          data?.agentHoldDuration ?? null,
          data?.dailDuration ?? null,
          data?.calledNumber ?? null,
          data?.queueDuration ?? null,
          data?.queueName ?? null,
          data?.callDuration ?? null,
          data.message ?? null,
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
        (err: any, result: any) => {
          if (err) {
            reject(err);
            console.log(err);
          }
          resolve(result);
        }
      );
      const data1 = {
        id: uuidv4(),
        type: 'Call back assigned by supervisor',
        message: `Callback assigned by ${data.assignedBy} Callback to <Customer Name or Mobile Number> ${data.sessionId}`,
      };
      notificationMessages(data1, data.ext);
      insertNotificationDao({
        uuid: data1.id,
        domainId: data.domainId,
        toExt: data.ext,
        notificationMsg: data1?.message,
        type: data1.type,
        channelType: 'call',
        markAsRead: 1,
        timeStamp: new Date().getTime(),
      });
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * get activity list
 * @param data
 * @returns
 */
/* export const getActivityList = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      let channelType;
      if (data.channelType === 'All') {
        channelType = { $in: ['Chat', 'Call', 'Email', 'Sms'] };
      } else {
        channelType = data.channelType;
      }
      let disposition;
      if (data.disposition === 'All') {
        disposition = { $in: ['Resolved', 'Unresolved', 'Transferred', 'Closed', 'Follow-up', 'Do Not Contact'] };
      } else {
        disposition = data.disposition;
      }
      let callType;
      if (data.callType === 'All') {
        callType = { $in: ['inbound', 'outbound'] };
      } else {
        callType = data.callType;
      }
      let offset;
      if (data.offset > 0) {
        offset = data.offset * 10;
      } else {
        offset = data.offset;
      }
      sessionHistoryModel
        .find({
          $and: [
            {
              channelType,
              disposition,
              callType,
              domainId: data.domainId,
              sessionStartTime: {
                $gte: data.fromDate,
                $lte: data.toDate,
              },
              agentDetails: { $in: data.ext },
            },
            {
              $or: [
                {
                  'customerData.FirstName': { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
                {
                  'customerData.LastName': { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
                {
                  'customerData.MobileNo': { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
                {
                  'customerData.Email': { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
                {
                  queue: { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
                {
                  callType: { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
                {
                  disposition: { $regex: new RegExp('.*' + `${data.search}` + '.*', 'i') },
                },
              ],
            },
          ],
        })
        .sort({ _id: -1 })
        .skip(offset)
        .limit(data.limit)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
}; */

/**
 * get activity list
 * @param data
 * @returns
 */
export const getActivityList = (data: any) => {
  return new Promise(async (resolve, reject) => {
    const resultExt = data.ext.toString();
    try {
      mysqlPoolConnection.query(
        'call ccass_get_session_history_details(?,?,?,?,?,?,?,?,?,?)',
        [data.domainId, data.channelType, data.disposition, data.callType, data.fromDate, data.toDate, resultExt, data.search, data.offset, data.limit],
        (err: any, result: any) => {
          if (err) {
            reject(err);
          }
          resolve(result?.length ? result[0] : {});
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @description Get voice call back list
 * @param data
 * @returns
 */

export const getVoiceCallBackList = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      let offset;
      if (data.offset > 0) {
        offset = data.offset * 10;
      } else {
        offset = data.offset;
      }
      sessionHistoryModel
        .find({
          $and: [
            {
              domainId: data.domainId,
              sessionStartTime: {
                $gte: data.fromDate,
                $lte: data.toDate,
              },
              disposition: { $in: ['missed', 'abandoned'] },
            },
          ],
        })
        .sort({ _id: -1 })
        .skip(offset)
        .limit(data.limit)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @description Get voice call back list
 * @param data
 * @returns
 */

export const getVoiceCallBackExtList = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      let offset;
      if (data.offset > 0) {
        offset = data.offset * 10;
      } else {
        offset = data.offset;
      }
      sessionHistoryModel
        .find({
          $and: [
            {
              domainId: data.domainId,
              sessionStartTime: {
                $gte: data.fromDate,
                $lte: data.toDate,
              },
              agentDetails: { $in: data.ext },
              disposition: { $in: ['missed', 'abandoned'] },
            },
          ],
        })
        .sort({ _id: -1 })
        .skip(offset)
        .limit(data.limit)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @description Get voice call back list
 * @param data
 * @returns
 */

/* export const getCallBackExtCount = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      sessionHistoryModel
        .find({
          $and: [
            {
              domainId: data.domainId,
              sessionStartTime: {
                $gte: data.fromDate,
                $lte: data.toDate,
              },
              agentDetails: { $in: data.ext },
              disposition: { $in: ['missed', 'abandoned'] },
            },
          ],
        })
        .count()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
}; */

/**
 * @description Get sessionId list
 * @param data
 * @returns
 */

/* export const getSessionAllList = async (dataq: any, data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      sessionHistoryModel
        .find({ customerDetails: dataq, domainId: data.domainId })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
}; */

/**
 * @description Get sessionId list
 * @param data
 * @returns
 */
export const getSessionAllList = (dataq: any, data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `select * from sessionHistory where customerDetails = '${dataq}' AND domainId = ${data.domainId}`;
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
 * @description Get sessionId list
 * @param data
 * @returns
 */

/* export const getConversationList = async (sessionId: any, data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      conversationHistoryModel
        .find({ sessionId, domainId: data.domainId })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
}; */

/**
 * @description get Conversation List
 * @param data
 * @returns
 */
export const getConversationList = (sessionId: any, data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `select * from conversationHistory where sessionId = '${sessionId}' AND domainId = ${data.domainId}`;
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

export const getCustomerChatHistory = (sessionId: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `select * from sessionHistory where sessionId = '${sessionId}'`;
      mysqlPoolConnection.query(mysqlq, (err: any, result: any) => {
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

export const createCustomerCallBack = (data: any) => {
  return new Promise((resolve, reject) => {
    const createdAt = Date.now();
    try {
      // const mysqlq = `INSERT INTO callBack (sessionId,customerData, domainId,insertAt)
      // VALUES ('${data.session_id}',${data.customerData}, ${data.domain_id},${createdAt}) `;
      // mysqlPoolConnection.query(mysqlq, (err: any, result: any) => {
      //   if (err) {
      //     reject(err);
      //   } else {
      //     resolve(result);
      //   }
      // });
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
export const createCustomerFilepath = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `UPDATE  sessionHistory SET customerFile = '${data.url}' where sessionId = '${data.sessionId}'`;
      mysqlPoolConnection.query(mysqlq, (err: any, result: any) => {
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

export const roleInfoDao = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT * from user where domainId=${data.domainId} AND ext=${data.ext}`;
      mysqlPoolConnection.query(mysqlq, (err: any, result: any) => {
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

export const getCustomerChatHistoryByEmailId = (data: any) => {
  const emailId = data.customerData.Email;
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT * FROM sessionHistory WHERE JSON_EXTRACT(customerData, '$.Email') = '${emailId}' AND domainId = ${data.domainId}`;
      mysqlPoolConnection.query(mysqlq, (err: any, result: any) => {
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
