import { checkExistUser, createEmailSessionDao, createEmailSessionHistory, deleteImapMail, emailDeleteFunction, findEmailRoutedQueue, getAgentDetailsForEmail, getEmailAddress, insertEmailChannel, primaryKeyUpdateFunction } from '../../../src/dao/emailChannel';

import { v4 as uuidv4 } from 'uuid';
import { ioredisChat } from '../../plugins/db';
import { RedisAdapters } from '../../redisAdapters';
import { getInbox } from './imap';
/**
 *
 * @param req
 * @param res
 * @param done
 *
 */

// get defaultEmailList

export const getDefaultEmailHandler = async (req: any, res: any, done: any) => {
  try {
    const auth: any = req.headers;
    const data: any = {};
    data.domainId = auth.domainId;
    const getEmail: any = await getEmailAddress(data);
    if (getEmail) {
      res.status(200).send({
        statusCode: 200,
        message: 'Success',
        getEmailData: getEmail,
      });
    } else {
      res.status(200).send({ statusCode: 404, message: 'Not Found', getList: [] });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: 'Internal Server Error' });
  }
};

// postDefaultEmailList

export const postDefaultEmailHandler = async (req: any, res: any, done: any) => {
  try {
    const auth: any = req.headers;
    const body: any = req.body;
    const data: any = {
      uid: uuidv4(),
      emailAddress: body.emailId,
      aliasName: body.aliasName,
      queue: body.queue,
      emailThreshold: body.emailThreshold,
      domainId: auth.domainId,
      isEmail: 0
    };
    const newEmail = await insertEmailChannel(data);
    res.send({
      status_code: 200,
      err_code: -1,
      affected_rows: 1,
      message: 'success',
      insertedEmail: newEmail
    });
  } catch (err) {
    res.status(500).send({ statusCode: 500, message: 'Internal server error' });
  }
};

// deleteEmailList

export const deleteDefaultEmailHandler = async (req: any, res: any, done: any) => {
  try {
    const auth: any = req.headers;
    const uid: any = req.params.uid;
    const data: any = {
      domainId: auth.domainId
    };
    const emailToDelete: any = await emailDeleteFunction(data, uid);
    if (emailToDelete) {
      res.status(200).send({ statusCode: 200, message: 'Email deleted successfully' });
    } else {
      res.status(200).send({ statusCode: 404, message: 'data not found' });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: 'Internal server error' });
  }
};

// updateEmailPrimaryKey

export const updateEmailPrimaryKeyHandler = async (req: any, res: any, done: any) => {
  try {
    const auth: any = req.headers;
    const uid: any = req.params.uid;
    const body: any = req.body;
    const data: any = {
      domainId: auth.domainId,
      isEmail: body.isEmail
    };

    const result = await primaryKeyUpdateFunction(data, uid);
    if (result) {
      res.status(200).send({
        statusCode: 200,
        message: 'Primary key updated successfully',
      });
    } else {
      res.status(200).send({
        statusCode: 404,
        message: 'Data is Not Found',
      });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: 'Internal server error' });
  }
};

// Inbox mail

// export async function imapInboxInboxHandler(req: any, res: any) {
//   try {
//     const datas = await getInbox();
//     res.send({ datas, errCode: 0, message: 'success' });
//   } catch (err) {
//     res.log.error(err);
//   }
// }

async function imapInboxInboxHandler() {
  try {
    const datas = await getInbox();
  } catch (err) {
    console.error(err);
  }
}
imapInboxInboxHandler();
setInterval(imapInboxInboxHandler, 6000);

// create Email Session

async function createEmailSession() {
  const redisadaptor: RedisAdapters = new RedisAdapters();
  try {
    const createSession: any = await createEmailSessionDao();
    const mailDataArr: any = [];
    if (createSession?.length !== 0) {
      createSession?.map((list: any) => {
        mailDataArr?.push(JSON.parse(list?.mail_data));
      });
      const uniqueArray = mailDataArr?.filter(
        (item: any, index: any, self: any) =>
          index ===
          self.findIndex(
            (obj: any) =>
              JSON.stringify(obj?.customerData) === JSON.stringify(item?.customerData)
          )
      );
      uniqueArray?.map(async (list: any) => {
        const checkUser: any = await checkExistUser(list);
        let session_Id: any;
        if (checkUser?.length === 0) {
          session_Id = uuidv4();
          const customerImapMsg: any = [];
          customerImapMsg.push(list.customerData);
          list.message = JSON.stringify(customerImapMsg);
          const routedQueue = await findEmailRoutedQueue(list);
          list.queueName = routedQueue[0]?.name;
          list.domainId = routedQueue[0]?.domainId;
          list.sessionId = session_Id;
          // redisadaptor.emailRpush(list, sessionId)
          // redisadaptor.emailBlpop(list);
          const findAvailableAgent: any = await getAgentDetailsForEmail(list);
          if (findAvailableAgent?.length !== 0) {
            list.agentExt = findAvailableAgent[0]?.ext;
            console.log(`${list.domainId}_${list.agentExt}`);
            ioredisChat.to(`${list.domainId}_${list.agentExt}`).emit('email_channel_emit', list);
            await deleteImapMail(list);
          }
        } else {
          session_Id = checkUser[0]?.sessionId;
          const ext = checkUser[0]?.agentDetails;
          const messageList: any = JSON.parse(checkUser[0]?.message);
          messageList.push(list.customerData);
          const messageData: any = { message: JSON.stringify(messageList) };
          ioredisChat.to(`${list.domainId}_${ext}`).emit('email_channel_emit', list);
          await createEmailSessionHistory(messageData, session_Id);
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
}
process.setMaxListeners(25);
createEmailSession();
setInterval(createEmailSession, 12000);
