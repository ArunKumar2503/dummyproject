/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */

import { FastifyReply, FastifyRequest } from 'fastify';
import * as jwt from 'jsonwebtoken';
import { configs } from '../config/app';
import {
  invalidCredentials,
  missingAuthenticationToken,
} from '../helpers/response-builders';

/**
 * Allow authorized user to access resource, without narrowing scope to role/account
 *
 * @export
 * @param {FastifyRequest<{}>} req
 * @param {FastifyReply<{}>} res
 * @param {(err?: Error) => void} done
 * @returns
 */
export function validateSession(
  req: FastifyRequest<{}>,
  res: FastifyReply,
  done: (err?: Error) => void
) {
  try {
    // let decoded: any = {};
    if (!req.headers || !req.headers.authorization) {
      res
        .status(401)
        .send(missingAuthenticationToken('Missing authentication token'));
    } else {
      const decoded: any = jwt.verify(req.headers.authorization, configs.jwtsecret);
      if (!decoded.username && !decoded.password && !decoded.deviceId) {
        res
          .status(403)
          .send(
            invalidCredentials('Invalid credentials in authentication token')
          );
      } else {
        req.headers = {
          username: decoded.username,
          password: decoded.password,
          deviceId: decoded.deviceId,
          sipLoginId: decoded.sipLoginId,
          roleId: decoded.roleId,
          domainId: decoded.domainId,
          ext: decoded.ext,
          companyId: decoded.companyId,
          enetepriseid: decoded.enetepriseid,
          hostAddress: decoded.hostAddress,
          orderId: decoded.orderId,
          dirUserId: decoded.dirUserId,
          ccas_role_info: decoded.ccas_role_info
        };
        return done();
      }
    }
  } catch (err) {
    res
      .status(403)
      .send(invalidCredentials('Invalid credentials in authentication token'));
  }
}

/* // validate Basic auth for public apis
export function basicAtuh(req: any, reply: any, done: any) {
  // check for basic auth header
  if (
    !req.headers.authorization ||
    req.headers.authorization.indexOf('Basic ') === -1
  ) {
    return reply.status(401).json({ message: 'Missing Authorization Header' });
  }
  // verify auth credentials
  const base64Credentials = req.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString(
    'ascii'
  );
  const [username, password] = credentials.split(':');

  username === configs.basic_uname && password === configs.basic_pw
    ? done()
    : done({ statusCode: 401, message: 'Authorization required' });
}
 */
