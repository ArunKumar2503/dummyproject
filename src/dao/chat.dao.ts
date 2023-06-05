import axios from 'axios';
import { log } from 'console';
import { Json } from 'sequelize/types/utils';
import { v1 as uuidv1 } from 'uuid';
import { coChatModel } from '../models/coChat';
import { conversationHistoryModel } from '../models/conversationHistory.models';
import { sessionHistoryModel } from '../models/sessionHistory.models';
import { mysqlPoolConnection } from '../plugins/db';

/* export const updateMessage = async (data: any) => {
  try {
    return new Promise(async (resolve, reject) => {
      conversationHistoryModel
        .updateOne({ id: data.id }, { $set: data })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
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
export const updateMessage = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const updateq = `UPDATE conversationHistory SET message = '${data}' WHERE id = '${data.id}'`;
      mysqlPoolConnection.query(updateq, async (err, result) => {
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

export const createCallSession = async (data: any, callflowid: any) => {
  try {
    const initialData: any = {
      ipAddress: data?.ipAddress ? data?.ipAddress : '',
      callFlowSourceId: callflowid || '',
      sessionId: data.session_id,
      browser: data?.browser ? data?.browser : '',
      source: data?.source ? data?.source : '',
      sessionStartTime: new Date().getTime() / 1000,
      channelType: 'Call',
      sessionEndTime: data?.sessionEndTime ? data?.sessionEndTime : null,
      botStartTime: data?.botStartTime ? data?.botStartTime : null,
      botEndTime: data?.botEndTime ? data?.botEndTime : null,
      agentConnectTime: data?.agentConnectTime ? data.agentConnectTime : null,
      agentDisconnectTime: data?.agentDisconnectTime ? data?.agentDisconnectTime : null,
      lastMessage: data?.lastMessage ? data?.lastMessage : '',
      botDetails: data?.botDetails ? data?.botDetails : {},
      category: data?.category ? data?.category : '',
      isBot: true,
      agentComments: data?.agentComments ? data.agentComments : '',
      agentDetails: data?.agentDetails ? data.agentDetails : '',
      customerDetails: data?.cli ? data.cli : '',
      OS: data?.OS ? data?.OS : '',
      onlineStatus: true,
      skillsIdentify: data?.skillsIdentify ? data?.skillsIdentify : '',
      location: data?.location ? data?.location : '',
      deviceType: data?.deviceType ? data?.deviceType : '',
    };

    return new Promise(async (resolve, reject) => {
      /*   sessionHistoryModel.find({ chatSessionId: initialData.chatSessionId }).then((res) => {
          ;

          if (res && res.length > 0) {
            sessionHistoryModel.updateOne({ chatSessionId: initialData.chatSessionId }, { $set: initialData }).then((result) => {

              return true;
            }).catch((err) => {
              return err;
            });
          } else {
            ;
            sessionHistoryModel.create(initialData)
            return true;
          }
        }).catch((err) => {
          return err;
        }); */
      sessionHistoryModel
        .create(initialData)
        .then((response: any) => {
          resolve(response);
        })
        .catch((errors: any) => {
          reject(errors);
        });
    });
  } catch (err: any) {
    console.log(err);
  }
};

/* export const createSession = async (data: any, Id: any) => {
  try {
    const initialData: any = {
      ipAddress: data?.ipAddress ? data?.ipAddress : '',
      callFlowSourceId: data?.webChatId ? data.webChatId : '',
      sessionId: Id,
      browser: data?.browser ? data?.browser : '',
      source: data?.source ? data?.source : '',
      sessionStartTime: new Date().getTime() / 1000,
      channelType: 'Chat',
      sessionEndTime: data?.sessionEndTime ? data?.sessionEndTime : null,
      botStartTime: data?.botStartTime ? data?.botStartTime : null,
      botEndTime: data?.botEndTime ? data?.botEndTime : null,
      agentConnectTime: data?.agentConnectTime ? data.agentConnectTime : null,
      agentDisconnectTime: data?.agentDisconnectTime
        ? data?.agentDisconnectTime
        : null,
      lastMessage: data?.lastMessage ? data?.lastMessage : '',
      botDetails: data?.botDetails ? data?.botDetails : {},
      category: data?.category ? data?.category : '',
      isBot: true,
      agentComments: data?.agentComments ? data.agentComments : '',
      agentDetails: data?.agentDetails ? data.agentDetails : '',
      customerDetails: '',
      OS: data?.OS ? data?.OS : '',
      onlineStatus: true,
      skillsIdentify: data?.skillsIdentify ? data?.skillsIdentify : '',
      location: data?.location ? data?.location : '',
      deviceType: data?.deviceType ? data?.deviceType : '',
    };

    return new Promise(async (resolve, reject) => {
      sessionHistoryModel
        .find({ sessionId: initialData.sessionId })
        .then((res) => {
          if (res && res.length > 0) {
            sessionHistoryModel
              .updateOne(
                { sessionId: initialData.sessionId },
                { $set: initialData }
              )
              .then((result) => {
                return true;
              })
              .catch((err) => {
                return err;
              });
          } else {
            sessionHistoryModel.create(initialData);
            return true;
          }
        })
        .catch((err) => {
          return err;
        });
    });
  } catch (err: any) {
    console.log(err);
  }
}; */

/**
 *  chat history initial data
 */
export const createSession = (data: any, id: any) => {
  return new Promise(async (resolve, reject) => {
    try {

      const botDetails = JSON.stringify(data?.botDetails);
      const customerData = JSON.stringify(data?.customerData);
      const message = JSON.stringify(data?.message);
      const customerCallBackData = JSON.stringify(data?.callBackRequest);
      mysqlPoolConnection.query(
        'call ccaas_session_history_details(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
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
          botDetails ?? null,
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
          data?.channelType ?? 'Chat',
          data?.location ?? null,
          data?.deviceType ?? null,
          customerData ?? null,
          data.domain_id ?? null,
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
          customerCallBackData ?? null,
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
 * @param data
 * @returns get Message WebChat
 */
export const getMessageWebChat = (id: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT message FROM sessionHistory where sessionId = '${id}'`;
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
 * @returns
 */
export const storeMessageHistory = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      // const message = JSON.stringify(data.message);
      mysqlPoolConnection.query(
        'call ccass_create_conv_history_details(?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          data.sessionId,
          data.from,
          data.to,
          data.messageType,
          data.message,
          data.id,
          data.timeStamp,
          data.agentState,
          data.customerState,
          data.botDetails,
          data.domainId,
          data.companyId,
          data.isBot,
        ],
        (err: any, result: any) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
      const mysqlqs = `UPDATE sessionHistory SET lastMessage= '${data?.message}' WHERE sessionId= '${data?.sessionId}'`;
      mysqlPoolConnection.query(mysqlqs, (err, results) => {
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

/* export const storeMessageHistory = async (data: any) => {
  try {
    return new Promise(async (resolve, reject) => {
      conversationHistoryModel
        .create(data)
        .then((result) => {
          resolve(result);
          sessionHistoryModel
            .updateOne(
              { sessionId: data.sessionId },
              { $set: { lastMessage: data.message } }
            )
            .then((rsp) => {
              return true;
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  } catch (err: any) {
    console.log(err);
  }
}; */

/**
 *
 * @param id
 * @param number
 * @returns
 */
export const storeCustomerDetails = async (id: any, number: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT * FROM customer_contact WHERE phoneNumber = '${number}'`;
      mysqlPoolConnection.query(mysqlq, (err, result) => {
        if (err) {
          reject(err);
        } else {
          if (result.length !== 0) {
            const response = JSON.parse(JSON.stringify(result) ?? 'null');
            const updateQuery = `UPDATE sessionHistory SET customerData='${JSON.stringify(response[0])}' WHERE sessionId='${id}'`;
            mysqlPoolConnection.query(updateQuery, (error, res) => {
              if (error) {
                reject(error);
              } else {
                resolve(res);
              }
            });
          } else {
            const updateQuery = `UPDATE sessionHistory SET customerData='{}' WHERE sessionId='${id}'`;
            mysqlPoolConnection.query(updateQuery, (error, res) => {
              if (error) {
                reject(error);
              } else {
                resolve(res);
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

/* export const storeCustomerDetails = async (id: any, number: any) => {
  try {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(
          'https://liveurapi.worktual.co.uk/vectone-myaccount/v1/user/Websitecentralgetcustomerinfo',
          { mundio_product: 'vmuk', searchby: 'mobileno', searchvalue: number },
          { headers: { Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiN2UwNTJmYTAtMzc4Ni00MDZjLWJiNjctZDYxNzFlOWJkMTlhIiwidXNlcm5hbWUiOiJwZXJzaGliYS52QHZlY3RvbmUuY29tIiwiZGV2aWNlSWQiOiJhMTJhZWVjMi1iNGJiLTRjZjEtYmI1OC1kZmQ1YzQzOWZlZTkiLCJzaXBMb2dpbklkIjoiNTQ0OCIsInJvbGVJZCI6NCwiZG9tYWluSWQiOjMzMjgsImV4dCI6NTg0LCJjb21wYW55SWQiOjMzNjIsImVuZXRlcHJpc2VpZCI6ODAzMiwiaG9zdEFkZHJlc3MiOiI4MDMyLnVyY2hhdC51bmlmaWVkcmluZy5jby51ayIsIm9yZGVySWQiOjExMDE4LCJkaXJVc2VySWQiOjMyNzA2LCJwcm9maWxlTmFtZSI6IlBlcnNoaWJhIFZlbHVzYW15IiwicHJvZmlsZUltZyI6Imh0dHBzOi8vdXJzdG9yYWdlLnVuaWZpZWRyaW5nLmNvLnVrL2ZpbGVzL3VzZXIvMzM2Mi81NDQ4XzU4NC8xNjUzNTQ1MTQ1MzQwLzEwODBwLWdpcmwtQmVhdXRpZnVsLVdoYXRzYXBwLURwLVByb2ZpbGUtSW1hZ2VzLXBob3RvLWhkLmpwZWciLCJzb3VyY2UiOiJXZWIiLCJpcGFkZHJlc3MiOiIxMzYuMTQ0LjU2LjI1NTo0NDMiLCJpYXQiOjE2NTU0NDI4OTZ9.yhEcej3x7miIQebCQRrAzAznckyLWhHkYslIPKa-BGk' } }
        )
        .then((result: any) => {
          if (result.data.result) {
            sessionHistoryModel
              .updateOne(
                { sessionId: id },
                { $set: { customerData: result.data.result[0] } }
              )
              .then((res: any) => {
                resolve(res);
              })
              .catch((err: any) => {
                reject(err);
              });
          } else {
            sessionHistoryModel
              .updateOne({ sessionId: id }, { $set: { customerData: {} } })
              .then((res: any) => {
                resolve(res);
              })
              .catch((err: any) => {
                reject(err);
              });
          }
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  } catch (err: any) {
    console.log(err);
  }
};

/* export const storeCallHistory = async (data: any) => {
  // ;
  try {
    return new Promise(async (resolve, reject) => {
      conversationHistoryModel
        .create(data)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
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
 * @returns get Chat History
 */
export const getChatHistory = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT * FROM conversationHistory where sessionId = '${data}'`;
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

/* export const getChatHistory = async (id: any) => {
  try {
    return new Promise(async (resolve, reject) => {
      conversationHistoryModel
        .find({ sessionId: id })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  } catch (err: any) {
    console.log(err);
  }
}; */

// export const chatUpdateDao = async (data: any) => {
//   try {
//     // ;

//     return new Promise(async (resolve, reject) => {
//       sessionHistoryModel
//         .updateOne({ sessionId: data.sessionId }, { $set: data })
//         .then((res: any) => {
//           resolve(res);
//         })
//         .catch((err: any) => {
//           reject(err);
//         });
//     });
//   } catch (err: any) {
//     console.log(err);
//   }
// };

/**
 *  call history initial data
 */
export const chatUpdateDao = (data: any) => {
  return new Promise(async (resolve, reject) => {
    const botDetails = JSON.stringify(data?.botDetails);
    const customerData = JSON.stringify(data?.customerData);
    const message = JSON.stringify(data?.message);
    const domainId = parseInt(data?.domain_id, 10);
    try {
      mysqlPoolConnection.query(
        'call ccaas_session_history_details(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,??,?,?,?,?,?,?,?,?,?,?,?,?)',
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
          botDetails ?? null,
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
          'Call',
          data?.location ?? null,
          data?.deviceType ?? null,
          customerData ?? null,
          domainId ?? null,
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

/* export const getChatSessionDao = async (ext: number) => {
  try {
    return new Promise(async (resolve, reject) => {
      sessionHistoryModel
        .find({ agentDetails: ext, channelType: 'Chat' })
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
 * @description get Chat Session
 * @param data
 * @returns
 */
export const getChatSessionDao = (ext: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT * FROM sessionHistory where agentDetails = ${ext} AND channelType: 'Chat'`;
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
 * @param ext
 * @returns
 */
/* export const getCallSessionDao = async (ext: number) => {
  try {
    return new Promise(async (resolve, reject) => {
      sessionHistoryModel
        .find({ agentDetails: ext, channelType: 'Call' })
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
 * @description get Call Session
 * @param data
 * @returns
 */
export const getCallSessionDao = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT * FROM sessionHistory where domainId = ${data.domainId} AND isBot = 0 AND agentDetails is not null AND dispositionName is null`;
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
/* export const getChatSessionIdDao = async (id: string) => {
  try {
    return new Promise(async (resolve, reject) => {
      sessionHistoryModel
        .findOne({ sessionId: id })
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
 * @param number
 * @returns
 */

/**
 * @description get the chat session
 * @param data
 * @returns
 */
export const getChatSessionIdDao = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT * FROM sessionHistory where sessionId = '${data}'`;
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
 * @description get chat number from
 * @param data
 * @returns
 */
export const getChatByNumberDao = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      if (data) {
        const mysqlq = `SELECT * FROM sessionHistory where customerDetails = '${data}'`;
        mysqlPoolConnection.query(mysqlq, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      } else {
        resolve([]);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * @description get chat by endTime
 * @param data
 * @returns
 */
export const getChatByEndTimeDao = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT * FROM sessionHistory where agentDetails = ${data} AND wrapTime = 0`;
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
/* export const getChatByNumberDao = async (number: string) => {
  try {
    return new Promise(async (resolve, reject) => {
      sessionHistoryModel
        .find({ customerDetails: number })
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

/* export const getChatByEndTimeDao = async (ext: number) => {
  try {
    return new Promise(async (resolve, reject) => {
      sessionHistoryModel
        .find({ agentDetails: ext, wrapTime: null })
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
 * @param dataq
 * @returns
 */

export const coChatUpdateDao = async (data: any, dataq: any) => {
  const query = `UPDATE coChat SET subscribedUsers = CONCAT(subscribedUsers, ?) WHERE uid = '${dataq.uid}' AND channelId = '${dataq.channelId}' AND  domainId = ${dataq.domainId}`;
  const values = [JSON.stringify(data), dataq.id];
  try {
    return new Promise(async (resolve, reject) => {
      mysqlPoolConnection.query(query, values, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * @description
 * @param data
 * @returns
 */
export const getAllMessageId = (channelId: any, domainId: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT * FROM coChat WHERE channelId = '${channelId}' AND domainId = ${domainId}`;
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
 * @param dataq
 * @returns
 */

export const sendMessageToCoChat = async (data: any, dataq: any) => {
  const query = `UPDATE coChat SET messages = CONCAT(messages, ?) WHERE uid = '${dataq.uid}' AND channelId = '${dataq.channelId}' AND  domainId = ${dataq.domainId}`;
  const values = [JSON.stringify(data), dataq.id];
  try {
    return new Promise(async (resolve, reject) => {
      mysqlPoolConnection.query(query, values, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
};

export const availableAgentData = async (data: any) => {
  const query = `SELECT * from user where domainId=${data.domain_id} AND statusName='Ready'`;
  try {
    return new Promise(async (resolve, reject) => {
      mysqlPoolConnection.query(query, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
};

export const storeCochatDetailsByIDDao = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlMessage = `SELECT messages FROM coChat Where domainId = ${data?.domainId ?? null} AND channelId = '${data?.channelId ?? null}'`;
      mysqlPoolConnection.query(mysqlMessage, (err, result) => {
        if (err) {
          reject(err);
        } else {
          let resultMessage: any = [];
          if (result?.length > 0 && result[0]?.messages?.length > 0) {
            resultMessage = JSON.parse(result[0]?.messages ?? 'null');
            resultMessage.push(data);
          } else {
            resultMessage.push(data);
          }
          const parseResultMessage = JSON.stringify(resultMessage);
          const mysqlq = `UPDATE coChat SET messages='${parseResultMessage}' WHERE domainId = ${data?.domainId ?? null} AND channelId = '${data.channelId}'`;
          mysqlPoolConnection.query(mysqlq, (errs, result1) => {
            if (errs) {
              reject(errs);
            } else {
              resolve(result1);
            }
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
