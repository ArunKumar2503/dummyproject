import { NOTIFICATION } from '../../helpers/constants';
import { deleteNotification, getNotification, insertNotification, updateMarkAsReadNotification } from './handler';
import { deleteNotificationSchema, getNotificationSchema, insertGetNotificationSchema, updatemarkasReadNotificationSchema } from './schema';

export default function notificationhandler(server: any, options: any, next: any) {
  server.post(
    NOTIFICATION.INSERT_NOTIFICATION,
    {
      preValidation: [server.validateSession],
      schema: {
        description: 'Notificaton saved',
        tags: ['Notification'],
        body: insertGetNotificationSchema.body,
        response: insertGetNotificationSchema.response
      },
    },
    insertNotification,
  );

  server.get(
    NOTIFICATION.GET_NOTIFICATION,
    {
      preValidation: [server.validateSession],
      schema: {
        description: 'Notificaton saved',
        tags: ['Notification'],
        response: getNotificationSchema.response
      },
    },
    getNotification,
  );
  server.delete(
    NOTIFICATION.DELETE_NOTIFICATION,
    {
      preValidation: [server.validateSession],
      schema: {
        description: 'Notificaton saved',
        tags: ['Notification'],
        response: deleteNotificationSchema.response
      },
    },
    deleteNotification,
  );

  server.put(
    NOTIFICATION.UPDATE_MARKAS_READ,
    {
      preValidation: [server.validateSession],
      schema: {
        description: 'Notificaton saved',
        tags: ['Notification'],
        response: updatemarkasReadNotificationSchema.response
      },
    },
    updateMarkAsReadNotification,
  );
  next();
}
