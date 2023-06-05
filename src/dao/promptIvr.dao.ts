import { AudioPlayPrompt, defaultAudio, defaultAudioRes, textToAudio } from '../models/promptIvr.models';

import { log } from 'console';
import moment from 'moment';
import { configs } from '../config/app';
import { mysqlPoolConnection } from '../plugins/db';
import VoiceEngine from '../service/testToSpeech';

/**
 * @description Create a audio
 * @param data
 * @returns
 */
/* export const insertIvr = async (data: any) => {
  try {
    return await AudioPlayPrompt.create(data);
  } catch (err) {
    return err;
  }
}; */

/**
 *
 * @param data
 * @returns
 */
export const chatFilePath = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const chat = `INSERT INTO chatMessages (fieldName,encoding,mimetype,fileName,path,size,uuid,url,name,domainId,message,createdAt) VALUES ('${data?.fieldname}','${data?.encoding}','${data?.mimetype}','${data?.filename}','${data?.path}',${data?.size},'${data?.uuid}','${data?.url}','${data?.name}',${data?.domainId},'${data.message}','${currentDate}')`;
      mysqlPoolConnection.query(chat, (err, result) => {
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
 * @description Create a audio
 * @param data
 * @returns
 */
export const textToSpeechh = async (data: any) => {
  try {
    return await textToAudio.create(data);
  } catch (err) {
    return err;
  }
};

/**
 * getall file
 * @param uid
 */
export const getAllFile = (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await AudioPlayPrompt.find({ domain: data.domainId }).select({ _id: 0 }).sort({ _id: -1 });
      resolve(res);
    } catch (err) {
      reject(err);
    }
  });
};

export const getPromptAudio = (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await textToAudio.find({ domainId: data.domainId }).select({ _id: 0 }).sort({ _id: -1 });
      resolve(res);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * getall file
 * @param uid
 */
export const getDefault = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await defaultAudioRes.find({});
      resolve(res);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 *
 * @param data
 * @returns
 * @description Convert the Text to Speech
 */
export const textToSpeech = async (data: any) => {
  const voiceEngine = new VoiceEngine();
  const fileInfo: any = await voiceEngine.convertInToSpeech(data);
  const audio_url = `${configs.paths.fileGetUrl}${data.domainId}/${fileInfo.fileName}`;
  const fileData = {
    message: data.text,
    path: fileInfo.filePath,
    url: audio_url,
    fileName: fileInfo.fileName,
    domainId: data.domainId,
    name: data.name,
    type: data.type,
    description: data.description,
    promptType: data.promptType,
    uuid: data.uuid,
  };
  await textToSpeechh(fileData);
  return { fileData };
};

/**
 * @description Get Call flow list
 * @param data
 * @returns
 */

export const createPrompt = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const arrData: any = [];
      const res = await AudioPlayPrompt.find({ domain: data?.domainId }).select({ _id: 0 });
      if (res.length === 0) {
        const dataFile = await defaultAudio.find().select({ _id: 0 });
        for (const [i, datum] of dataFile.entries()) {
          let obj: any = {};
          obj = datum;
          obj.domain = `${data?.domainId}`;
          arrData.push(obj);
        }
        const response = await AudioPlayPrompt.insertMany(arrData);
        resolve(response);
      } else {
        resolve(0);
      }
    } catch (err) {
      reject(err);
    }
  });
};

/**
 *
 * @param data
 * @returns Convert the Text to Speech
 */
export const textToConvert = async (data: any) => {
  const voiceEngine = new VoiceEngine();
  const fileInfo: any = await voiceEngine.convertInToSpeech(data);
  // const audio_url = `${configs.paths.fileGetUrl}${data.domainId}/${fileInfo.fileName}`;
  const fileData: any = {
    message: data?.text ?? null,
    path: fileInfo?.nfsPath ?? null,
    url: fileInfo?.filePath ?? null,
    fileName: fileInfo?.fileName ?? null,
    domainId: data?.domainId ?? 0,
    name: data?.name ?? null,
    type: data?.type ?? null,
    promptStatus: data?.promptStatus ?? null,
    description: data?.description ?? null,
    promptType: data?.promptType ?? 1,
    fieldname: data?.fieldname ?? null,
    encoding: data?.encoding ?? null,
    mimetype: data?.mimetype ?? null,
    size: data.size ?? 0,
    companyId: data.companyId ?? 0,
  };
  const cid: any = await insertPrompt(fileData);
  fileData.insertId = cid.insertId;
  return { fileData };
};

/**
 *
 * @param data
 * @returns Convert the Text to Speech
 */
export const textToConvertPreview = async (data: any) => {
  const voiceEngine = new VoiceEngine();
  const fileInfo: any = await voiceEngine.convertInToSpeech(data);
  // const audio_url = `${configs.paths.fileGetUrl}${data.domainId}/${fileInfo.fileName}`;
  const fileData: any = {
    message: data?.text ?? null,
    path: fileInfo?.filePath ?? null,
    // url: audio_url ?? null,
    // fileName: fileInfo?.fileName ?? null,
    // domainId: data?.domainId ?? 0,
    // name: data?.name ?? null,
    // type: data?.type ?? null,
    // description: data?.description ?? null,
    // promptType: data?.promptType ?? 1,
    // fieldname: data?.fieldname ?? null,
    // encoding: data?.encoding ?? null,
    // mimetype: data?.mimetype ?? null,
    // size: data.size ?? 0,
    // companyId: data.companyId ?? 0
  };
  // const cid: any = await insertPrompt(fileData);
  // fileData.insertId = cid.insertId;
  return { fileData };
};

/**
 *
 * @param data
 * @returns
 */
export const editTextToSpeech = async (data: any) => {
  const uuid = data.uuid;
  const voiceEngine = new VoiceEngine();
  const fileInfo: any = await voiceEngine.convertInToSpeech(data);
  // const audio_url = `${configs.paths.fileGetUrl}${data.domainId}/${fileInfo.fileName}`;
  const fileData = {
    message: data.text,
    name: data.name,
    description: data.description,
    promptType: data.promptType,
    domainId: data.domainId,
    uuid: data.uuid,
    url: fileInfo.filePath,
    path: fileInfo.filePath,
    fileName: fileInfo.fileName,
    type: data.type,
  };
  await updateTextToSpeechUserPromptLib(fileData, fileData.uuid);
  return { fileData };
};

/**
 *
 * @param data
 * @param uuid
 * @returns
 */
export const updateUserPromptLib = (data: any, uuid: any) => {
  return new Promise((resolve, reject) => {
    try {
      const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const updates = `UPDATE prompt_library SET url ='${data.url}',name ='${data.name}',description ='${data.description}', type = '${data.type}',updateddAt = '${currentDate}' WHERE uuid = ${uuid} `;
      mysqlPoolConnection.query(updates, (err, result) => {
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

export const updateUserPromptBasedOnName = (data: any, uuid: any) => {
  return new Promise((resolve, reject) => {
    try {
      const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const updates = `UPDATE prompt_library SET url ='${data.url}',name ='${data.name}',description ='${data.description}', updateddAt = '${currentDate}' WHERE uuid = ${uuid} `;
      mysqlPoolConnection.query(updates, (err, result) => {
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
 * @param uuid
 * @returns
 */
export const updateTextToSpeechUserPromptLib = (data: any, uuid: any) => {
  return new Promise((resolve, reject) => {
    try {
      const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const updates = ` UPDATE prompt_library SET message='${data?.message}',name ='${data?.name}',description ='${data?.description}',url ='${data?.url}',path = '${data?.path}',fileName = '${data?.fileName}',type = '${data?.type}',updateddAt = '${currentDate}' WHERE uuid =${uuid}`;
      mysqlPoolConnection.query(updates, (err, result) => {
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

export const updateTextToSpeechNameAndDescription = (data: any, uuid: any) => {
  return new Promise((resolve, reject) => {
    try {
      const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const updates = ` UPDATE prompt_library SET name ='${data?.name}',description ='${data?.description}',type = '${data?.type}',updateddAt = '${currentDate}' WHERE uuid =${uuid}`;
      mysqlPoolConnection.query(updates, (err, result) => {
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
 * @param uuid
 * @returns
 */
export const deletePromptAudio = (data: any, uuid: any) => {
  return new Promise((resolve, reject) => {
    try {
      const update1 = `delete from prompt_library WHERE uuid = ${uuid} AND domainId = ${data?.domainId}`;
      mysqlPoolConnection.query(update1, (err, result) => {
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
 * @returns
 */
export const getAudioPromptLibrary = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT * FROM prompt_library WHERE domainId = ${data.domainId} order by uuid desc`;
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
 * @returns
 */
export const insertPrompt = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const prompt_library = `INSERT INTO prompt_library (fieldname,encoding,mimetype,filename,path,size,type,promptType,url,name,description,domainId,companyId,message,promptStatus,updateddAt,createdAt) VALUES ('${data?.fieldname}','${data?.encoding}','${data?.mimetype}','${data?.filename}','${data?.path}',${data?.size},'${data?.type}',${data?.promptType},'${data?.url}','${data?.name}','${data?.description}',${data?.domainId},${data?.companyId},'${data?.message}','${data?.promptStatus}','${currentDate}','${currentDate}')`;
      mysqlPoolConnection.query(prompt_library, (err, result) => {
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
 * @returns
 */
export const insertPromptText = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const prompt_library = `INSERT INTO prompt_library (fieldname,encoding,mimetype,filename,path,size,type,promptType,url,name,description,domainId,companyId,message,promptStatus,updateddAt,createdAt) VALUES ('${data.fieldname}','${data.encoding}','${data.mimetype}','${data.filename}','${data.path}',${data.size},'${data.type}',${data.promptType},'${data?.url}','${data?.name}','${data?.description}',${data?.domainId},${data?.companyId},'${data?.message}','${data.promptStatus}','${currentDate}','${currentDate}')`;
      mysqlPoolConnection.query(prompt_library, (err, result) => {
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
 * @returns
 */
export const isValidPromptName = (data: any) => {
  return new Promise((resolve, reject) => {
    try {
      const mysqlq = `SELECT * FROM prompt_library WHERE name = '${data?.name}' AND domainId = ${data?.domainId}`;
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
