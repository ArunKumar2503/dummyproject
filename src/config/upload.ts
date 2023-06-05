import multer from 'fastify-multer';
import fs from 'fs';
import { configs } from './app';

/**
 * chat_upload_file
 */
const storage = multer.diskStorage({
  destination(req: any, file: any, cb: any) {
    const authorization = req.headers;
    const domainId = authorization.domainId;
    let dir: any = '';
    if (domainId !== undefined) {
      dir = configs.chat_path.upload_destination + domainId;
    } else {
      dir = configs.chat_path.upload_destination + domainId;
    }
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename(req: any, file: any, cb: any) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage, limits: { fileSize: 20000010 } });
export const cpUpload = upload.fields([{ name: 'doc', maxCount: 10 }]);

/**
 * prompt_file_upload
 */
const storages = multer.diskStorage({
  destination(req, file, cb) {
    const authorization = req.headers;
    const domainId = authorization.domainId;
    let dir: any = '';
    if (domainId !== undefined) {
      dir = configs.paths.upload_destination + domainId;
    } else {
      dir = configs.paths.upload_destination + domainId;
    }
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  }
});

const uploaded = multer({ storage: storages, limits: { fileSize: 20000010 } });
export const cpUploaded = uploaded.fields([{ name: 'doc', maxCount: 10 }]);

/**
 * customer file upload
 */

const storagess = multer.diskStorage({
  destination(req, file, cb) {
    const dir: any = configs.chat_path.upload_destination;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  }
});

const chatUpload = multer({ storage: storagess, limits: { fileSize: 20000010 } });
export const Uploaded = chatUpload.fields([{ name: 'doc', maxCount: 10 }]);
