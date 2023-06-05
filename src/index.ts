import dotenv from 'dotenv';
import * as app from './config/app';
import createServer from './server';
import { ChatServer } from './socketio-redis/socket-server';

const PORT = process.env.SERVER_PORT || '5007';
const server = createServer();

server.listen(PORT, '0.0.0.0', (err, address) => {
  if (err) throw err;
  console.info(`call server started...${address}`);
});

const socketApp = new ChatServer(dotenv).getApp();
export { socketApp };

module.exports = server;
