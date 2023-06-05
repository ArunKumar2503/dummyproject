import { deleteNotificationDao, getNotificationDao, insertNotificationDao, updateMarkAsReadNotificationDao } from '../../dao/notification.dao';

/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */
import { v4 as uuidv4 } from 'uuid';
import { RESPONSE } from '../../helpers/constants';

// insert notification
export async function insertNotification(req: any, res: any, done: any) {
  try {
    const auth: any = req.headers;
    const data: any = {
      uuid: req.body.uuid,
      toExt: req.body.toUser,
      domainId: auth.domainId,
      notificationMsg: req.body.notificationMsg,
      channelType: req.body.channelType,
      markAsRead: 1,
      type: req.body.type,
      timeStamp: new Date().getTime(),
    };
    await insertNotificationDao(data);
    res.status(200).send({ statusCode: 200, message: RESPONSE.notification_success_status });
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}

// get notifications
export async function getNotification(req: any, res: any, done: any) {
  try {
    const auth: any = req.headers;
    const data: any = {
      ext: auth.ext,
      domainId: auth.domainId,
      timeStamp: req?.params?.timestamp ?? 0,
    };
    const getStatus: any = await getNotificationDao(data);
    if (Array.isArray(getStatus) && getStatus.length > 0) {
      res.status(200).send({ statusCode: 200, message: RESPONSE.success_message, result: getStatus });
    } else {
      res.send({ statusCode: 404, message: RESPONSE.not_found });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}

// delete a notification
export async function deleteNotification(req: any, res: any, done: any) {
  try {
    const auth: any = req.headers;
    const data: any = {
      ext: auth.ext,
      domainId: auth.domainId,
    };
    await deleteNotificationDao(data);
    res.send({ statusCode: 200, message: RESPONSE.notification_delete_status });
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}

// update notification
export async function updateMarkAsReadNotification(req: any, res: any, done: any) {
  try {
    const auth: any = req.headers;
    const data: any = {
      uuid: req.body.uuid,
      ext: auth.ext,
      domainId: auth.domainId,
    };
    if (data.uuid !== null && data.uuid !== '') {
      const getStatus: any = await updateMarkAsReadNotificationDao(data);
      res.send({ statusCode: 200, message: RESPONSE.update_markas_read });
    } else {
      res.send({ statusCode: 404, message: RESPONSE.valid_input });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}
