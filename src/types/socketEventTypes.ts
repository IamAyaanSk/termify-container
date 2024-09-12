import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { StatusMessageMap } from './common';
import { FileAndFolderEvent, IFileAndFolderDetails } from './fileAndFolderTypes';

interface ISocketResponseMessage {
  status: StatusMessageMap;
  message: string;
  path?: string;
  event?: FileAndFolderEvent;
  data?: IFileAndFolderDetails[];
  toListRoot?: boolean;
}

interface ServerToClientEvents {
  'terminal:writeToTerminalFromServer': (command: string) => void;
  'filesAndFolders:output': (message: ISocketResponseMessage) => void;
  'playground:boot': (message: ISocketResponseMessage) => void;
}

interface ClientToServerEvents {
  'terminal:writeToTerminalFromClient': (command: string) => void;
  'filesAndFolders:input': (details: IFileAndFolderDetails) => void;
}

type ConnectionMiddleware = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  next: (err?: ExtendedError) => void,
) => void;

export { ServerToClientEvents, ClientToServerEvents, ConnectionMiddleware };
