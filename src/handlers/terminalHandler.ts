import { Server, Socket } from 'socket.io';
import ptyProcessInstance from '../constants/ptyInstance';
import { ClientToServerEvents, ServerToClientEvents } from '../types/socketEventTypes';

const terminalHandlers = (
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
) => {
  ptyProcessInstance.onData((data) => {
    if (data.includes('exit')) {
      socket.emit('terminal:writeToTerminalFromServer', 'This command not work here!!\n');
    } else {
      socket.emit('terminal:writeToTerminalFromServer', data);
    }
  });

  const writeToTerminalFromClient = (command: string) => {
    try {
      ptyProcessInstance.write(command);
    } catch (error) {
      console.log('Error writing to terminal:', error);
    }
  };

  socket.on('terminal:writeToTerminalFromClient', writeToTerminalFromClient);
};

export default terminalHandlers;
