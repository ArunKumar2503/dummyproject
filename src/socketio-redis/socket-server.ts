import express from 'express';
import { createServer } from 'http';
import { IOServer } from './socket-pubsub';

export class ChatServer {
  public static readonly PORT = process.env.PORT || 5008;
  private app: express.Application = express();
  private server: any;
  private io: any;
  private port: string | number | undefined;

  constructor(dotenv: any) {
    dotenv.config();
    this.config();
    this.createServer();
    this.sockets();
    this.listen();
  }

  public getApp(): express.Application {
    return this.app;
  }

  private createServer(): void {
    this.server = createServer(this.app);
  }

  private config(): void {
    this.port = process.env.SOCKETPORT || ChatServer.PORT;
  }

  private sockets(): void {
    this.io = new IOServer(this.server);
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log('');
    });
  }
}
