import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { uuid } from 'uuidv4';
import { configs } from '../config/app';

export default class VoiceEngine {
  public bassUrl: string;

  constructor() {
    this.bassUrl = configs.voiceEngineBaseUrl;
  }

  /**
   *
   * @param data
   * @returns
   */
  public async convertInToSpeech(data: any) {
    try {
      const rand = Date.now();
      const fid = uuid();
      const dataToSend: any = {
        domainId: data.domainId,
        uuid: fid,
      };
      const waveFile = `${rand}.wav`;
      const tempDir = `${configs.paths.upload_destination}/${dataToSend.domainId}/${dataToSend.uuid}`;
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      const destination = `${tempDir}/${waveFile}`;
      const url = `https://readspeaker.unifiedring.co.uk/rest/vtspeech?voice=Sophie&lang=en_uk&&pitch=110&speed=96&srate=16000&aformat=ogg&text=${data.text}`;
      const response: any = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
      });
      await response.data.pipe(fs.createWriteStream(destination));
      const fileUrl = `${configs.paths.fileGetUrl}${dataToSend.domainId}/${dataToSend.uuid}/${waveFile}`;
      const nfsPath = `${configs.paths.upload_destination}${dataToSend.domainId}/${dataToSend.uuid}/${waveFile}`;
      return { nfsPath, fileName: waveFile, filePath: fileUrl };
    } catch (err) {
      console.log(err);
    }
  }
  public mkdirp(dir: string) {
    if (fs.existsSync(dir)) {
      return true;
    }
    const dirname = path.dirname(dir);
    this.mkdirp(dirname);
    fs.mkdirSync(dir);
  }
}
