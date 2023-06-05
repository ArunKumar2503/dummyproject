/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */
import {
  deleteDisposition,
  getDispositinStatus,
  insertDispositionStatus,
  isValidDispositionName,
  updateCalledPersonDetailsCall,
  updateDisposition,
  updateDispositionForCall,
  updateDispositionStatus,
} from '../../dao/dispositionStatus';

import { RESPONSE } from '../../helpers/constants';

/**
 *
 * @param req
 * @param res
 * @param done
 * agent status api
 */
export async function insertDispositionStatusHandler(req: any, res: any, done: any) {
  try {
    const auth: any = req.headers;
    const data: any = {
      dispositionName: req?.body?.dispositionName ?? null,
      type: 'Custom',
      description: req?.body?.description ?? null,
      domainId: auth.domainId,
      status: req?.body?.status ?? 0,
      colorCode: req.body?.colorCode ?? null,
    };
    const insertStatus: any = await insertDispositionStatus(data);
    if (insertStatus) {
      res.status(200).send({ statusCode: 200, message: RESPONSE.disposition_status, insertStatusList: insertStatus ?? {} });
    } else {
      res.status(200).send({ statusCode: 404, message: RESPONSE.not_found });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}

/**
 *
 * @param req
 * @param res
 * @param done
 */
export async function getDispositinStatusHandler(req: any, res: any, done: any) {
  try {
    const auth = req.headers;
    const data: any = {};
    data.domainId = auth.domainId;
    const getDispositin: any = await getDispositinStatus(data);
    if (Array.isArray(getDispositin) && getDispositin.length > 0) {
      res.status(200).send({ statusCode: 200, message: RESPONSE.success_message, getDispositinListRes: getDispositin });
    } else {
      res.status(200).send({ statusCode: 404, message: RESPONSE.not_found, getDispositinListRes: [] });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}

/**
 *
 * @param req
 * @param res
 * @param done
 * agent status api
 */
export async function updateDispositionStatusHandler(req: any, res: any, done: any) {
  try {
    const auth: any = req.headers;
    const did = req.params.did;
    const data: any = {
      dispositionName: req?.body?.dispositionName ?? null,
      type: req?.body?.type ?? null,
      description: req?.body?.description ?? null,
      domainId: auth.domainId,
      status: req?.body?.status ?? 0,
      colorCode: req.body?.colorCode ?? null,
    };
    if (did !== '') {
      const updateStatus: any = await updateDispositionStatus(data, did);
      if (updateStatus) {
        res.status(200).send({ statusCode: 200, message: RESPONSE.disposition_statuss });
      } else {
        res.status(200).send({ statusCode: 404, message: RESPONSE.not_found });
      }
    } else {
      res.status(200).send({ statusCode: 405, message: RESPONSE.did });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}

/**
 *
 * @param req
 * @param res
 * @param done
 */
export async function deleteDispositionStatusHandler(req: any, res: any, done: any) {
  try {
    const auth = req.headers;
    const did: any = req.params.did;
    const data: any = {
      domainId: auth.domainId,
      dispositionName: req.body.dispositionName,
    };
    if (did !== '') {
      await updateDisposition(data);
      const deletedisposition: any = await deleteDisposition(did, data);
      if (deletedisposition) {
        res.status(200).send({ statusCode: 200, message: RESPONSE.dispositionn_statuss });
      } else {
        res.status(200).send({ statusCode: 404, message: RESPONSE.not_found });
      }
    } else {
      res.status(200).send({ statusCode: 405, message: RESPONSE.did });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}

/**
 *
 * @param req
 * @param res
 * @param done
 */
export async function isValidDispositionNameHandler(req: any, res: any, done: any) {
  try {
    const auth: any = req.headers;
    const data: any = {};
    data.domainId = auth.domainId;
    data.dispositionName = req?.body?.name ?? null;
    const dispositionRes: any = await isValidDispositionName(data);
    if (dispositionRes && dispositionRes.length > 0 && dispositionRes[0]?.dispositionName.length > 0) {
      res.status(200).send({ statusCode: 403, message: RESPONSE.name_already_exist, flag: 0 });
    } else {
      res.status(200).send({ statusCode: 200, message: RESPONSE.available, flag: 1 });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}

/**
 *
 * @param req
 * @param res
 * @param done
 */
export async function updateDispositionHandler(req: any, res: any, done: any) {
  try {
    const auth: any = req.headers;
    const params = req.params;
    const data: any = {
      domainId: auth.domainId,
      ext: auth.ext,
      sessionId: params.sessionId,
      summary: req?.body?.summary ?? null,
      disposition: req?.body?.disposition ?? {},
      dispositionName: req?.body?.dispositionName ?? null,
      afterCallWorkTime: req?.body?.afterCallWorkTime ?? 0,
      calledPersonDetails: req?.body?.calledPersonDetails ?? {},
      subject: req?.body?.subject ?? null,
    };
    const updateDispStatus: any = await updateDispositionForCall(data);
    if (updateDispStatus) {
      res.status(200).send({ statusCode: 200, message: RESPONSE.disposition_statuss });
    } else {
      res.status(200).send({ statusCode: 404, message: RESPONSE.not_found });
    }
  } catch (err) {
    req.log.error(err);
    console.log(err);

    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}

/**
 *
 * @param req
 * @param res
 * @param done
 */
export async function updateCalledPersonDetailsCallHandler(req: any, res: any, done: any) {
  try {
    const auth: any = req.headers;
    const params = req.params;
    const data: any = {
      domainId: auth.domainId,
      sessionId: params.sessionId,
      calledPersonDetails: req?.body?.calledPersonDetails ?? {},
    };
    const updateCalledPerson: any = await updateCalledPersonDetailsCall(data);
    if (updateCalledPerson) {
      res.status(200).send({ statusCode: 200, message: RESPONSE.success_message });
    } else {
      res.status(200).send({ statusCode: 404, message: RESPONSE.not_found });
    }
  } catch (err) {
    req.log.error(err);
    console.log(err);
    res.status(500).send({ statusCode: 500, message: RESPONSE.internal_error });
  }
}
