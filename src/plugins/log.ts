/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */

import { configure, getLogger } from 'log4js';
import moment from 'moment';

export const logger = getLogger();
logger.level = 'info';
const dir = process.platform === 'win32' ? '/tmp' : '/var/log';

configure({
  appenders: {
    log: {
      type: 'file',
      filename: `${dir}/${moment().format('MMMDoYYYY')}-call_service.log`,
      maxLogSize: 10485760,
      backups: 5,
    },
  },
  categories: { default: { appenders: ['log'], level: 'info' } },
});
