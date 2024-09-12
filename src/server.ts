import dotenv from 'dotenv';
dotenv.config();
import { createServer } from 'http';
import { Server } from 'socket.io';
import terminalHandlers from './handlers/terminalHandler';

import { PORT } from './constants/global';
import { ClientToServerEvents, ServerToClientEvents } from './types/socketEventTypes';
import authenticateUser from './middlewares/authenticateUser';
// import playgroundHandlers from './handlers/playgroundHandler';
import filesAndFoldersHandlers from './handlers/filesAndFoldersHandler';
import bootPlayground from './middlewares/bootPlayground';

const httpServer = createServer();
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: '*',
    allowedHeaders: ['authorization'],
  },
});

io.use(authenticateUser);
io.use(bootPlayground);

io.on('connection', (socket) => {
  terminalHandlers(io, socket);
  filesAndFoldersHandlers(io, socket);
});

httpServer.listen(PORT);
