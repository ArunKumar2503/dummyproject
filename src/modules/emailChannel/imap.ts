import { v4 as uuidv4 } from 'uuid';
import { insertImapInboxData } from '../../dao/emailChannel';
const Imap = require('imap');
const { simpleParser } = require('mailparser');
class ImapConfig {
  public server: any;
  public imap: any;
  public simpleParser: any;

  constructor(imap: any, _simpleParser: any) {
    this.imap = imap;
    this.simpleParser = _simpleParser;
    this.server = new imap({
      user: 'test@postfix.worktual.co.uk',
      password: 'vicarage2000',
      host: 'mail.postfix.worktual.co.uk',
      port: 993,
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false,
      },
      authTimeout: 20000,
    }).once('error', (err: any) => {
      console.log(err);
    });
    this.server.connect();
  }

  public async getServer() {
    return this.server;
  }
}

// export const getInbox = async () => {
//   const ob = new ImapConfig(Imap, simpleParser);
//   const imap = await ob.getServer();
//   imap.setMaxListeners(25);
//   imap.once('ready', () => {
//     const inboxMailArr: any = [];
//     imap.openBox('INBOX', false, (error: any, box: any) => {

//       imap.search(['UNSEEN'], (err: any, unseen: any) => {
//         if (unseen.length > 0) {
//           const f = imap.fetch(unseen, {
//             bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
//             struct: true,
//             markSeen: true,
//           });
//           f.on('message', (msg: any, seqno: any) => {
//             let buffer = '';
//             msg.on('body', (stream: any, info: any) => {
//               stream.on('data', (chunk: any) => {
//                 buffer += chunk.toString('utf8');
//               });

//               stream.once('end', () => {
//                 simpleParser(buffer, async (parseErr: any, mail: any) => {
//                   if (parseErr) {
//                   } else {
//                     let subject: any; let to: any; let date: any; let from: any; let text: any;

//                     if (mail?.subject !== undefined && mail?.to?.text !== undefined && mail?.date !== undefined && mail?.from?.text !== undefined) {
//                       subject = mail?.subject;
//                       to = mail?.to?.text;
//                       date = mail?.date;
//                       from = mail?.from?.text;
//                     }
//                     if (mail?.text !== undefined) {
//                       const firstValue = mail?.text.split('\n')[4].trim();
//                       const sixValue = mail?.text.split('\n')[8].trim();
//                       const value = firstValue;
//                       const pattern = /^_[0-9]{2,3}[a-zA-Z]+$|^_[0-9]{3}[a-zA-Z]+$/;
//                       const isMatchingPattern = pattern.test(value);
//                      if(isMatchingPattern){
//                       text = sixValue;
//                      }else{
//                       text = firstValue;
//                      }
//                     }

//                     if (subject !== undefined && text !== undefined && date !== undefined && from !== undefined && to !== undefined) {
//                       const data: any = {
//                         customerData: {
//                           fromData: from,
//                           toData: to,
//                           dateData: date,
//                           textData: text,
//                           subjectData: subject,
//                           sessionStartTime: Date.now(),
//                         },
//                         channelType: 'Email',
//                       };
//                       inboxMailArr.push(data);
//                       await insertImapInboxData(data);
//                     }
//                   }
//                 });
//               });
//             });

//             msg.once('end', () => {
//               // Handle the end of message event
//             });
//           });
//           f.once('error', (errors: any) => {
//           });

//           f.once('end', () => {
//           });
//         }
//       });
//     });
//     if (imap.state !== 'authenticated') {
//       imap.connect();
//     }
//   });
//   imap.once('error', (err: any) => {
//     if (err.source === 'timeout') {
//       imap.destroy();
//     }
//   });
// };
const MAX_CONNECTIONS = 10;
const connectionCount = 0;
const connectionQueue = [];

export const getInbox = async () => {
  // const processConnection = async () => {
  //   const ob = new ImapConfig(Imap, simpleParser);
  //   const imap = await ob.getServer();
  //   imap.setMaxListeners(0); // Set maximum listener limit to 0 to remove the default limit
  //   imap.once('ready', () => {
  //     const inboxMailArr: any = [];
  //     imap.openBox('INBOX', false, (error: any, box: any) => {
  //       imap.search(['UNSEEN'], (err: any, unseen: any) => {
  //         if (unseen.length > 0) {
  //           const f = imap.fetch(unseen, {
  //             bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
  //             struct: true,
  //             markSeen: true,
  //           });
  //           f.on('message', (msg: any, seqno: any) => {
  //             let buffer = '';
  //             msg.on('body', (stream: any, info: any) => {
  //               stream.on('data', (chunk: any) => {
  //                 buffer += chunk.toString('utf8');
  //               });
  //               stream.once('end', () => {
  //                 simpleParser(buffer, async (parseErr: any, mail: any) => {
  //                   if (parseErr) {
  //                     // Handle parsing error
  //                   } else {
  //                     let subject: any, to: any, date: any, from: any, text: any;
  //                     if (mail?.subject !== undefined && mail?.to?.text !== undefined && mail?.date !== undefined && mail?.from?.text !== undefined) {
  //                       subject = mail?.subject;
  //                       to = mail?.to?.text;
  //                       date = mail?.date;
  //                       from = mail?.from?.text;
  //                     }
  //                     if (mail?.text !== undefined) {
  //                       const firstValue = mail?.text.split('\n')[4].trim();
  //                       const sixValue = mail?.text.split('\n')[8].trim();
  //                       const value = firstValue;
  //                       const pattern = /^_[0-9]{2,3}[a-zA-Z]+$|^_[0-9]{3}[a-zA-Z]+$/;
  //                       const isMatchingPattern = pattern.test(value);
  //                       if (isMatchingPattern) {
  //                         text = sixValue;
  //                       } else {
  //                         text = firstValue;
  //                       }
  //                     }
  //                     if (subject !== undefined && text !== undefined && date !== undefined && from !== undefined && to !== undefined) {
  //                       const data: any = {
  //                         customerData: {
  //                           fromData: from,
  //                           toData: to,
  //                           dateData: date,
  //                           textData: text,
  //                           subjectData: subject,
  //                           sessionStartTime: Date.now(),
  //                         },
  //                         channelType: 'Email',
  //                       };
  //                       inboxMailArr.push(data);
  //                       await insertImapInboxData(data);
  //                     }
  //                   }
  //                 });
  //               });
  //             });
  //             msg.once('end', () => {
  //               // Handle the end of message event
  //             });
  //           });
  //           f.once('error', (errors: any) => {
  //             // Handle fetch error
  //           });
  //           f.once('end', () => {
  //             // Handle fetch completion
  //           });
  //         }
  //       });
  //     });
  //     if (imap.state !== 'authenticated') {
  //       imap.connect();
  //     }
  //   });
  //   imap.once('error', (err: any) => {
  //     if (err.source === 'timeout') {
  //       imap.destroy();
  //     }
  //     connectionCount--;
  //     processNextConnection();
  //   });
  //   imap.once('end', () => {
  //     connectionCount--;
  //     processNextConnection();
  //   });
  // };
  // const processNextConnection = () => {
  //   if (connectionQueue.length > 0) {
  //     const nextConnection = connectionQueue.shift();
  //     connectionCount++;
  //     nextConnection();
  //   }
  // };
  // if (connectionCount < MAX_CONNECTIONS) {
  //   connectionCount++;
  //   processConnection();
  // } else {
  //   connectionQueue.push(processConnection);
  // }
};
