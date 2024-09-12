import chokidar from 'chokidar';
import path from 'path';
import { USER_CODE_BASE_PATH } from './global';
import { Socket } from 'socket.io';
import { StatusMessageMap } from '../types/common';
import { ClientToServerEvents, ServerToClientEvents } from '../types/socketEventTypes';
import { FileAndFolderEvent } from '../types/fileAndFolderTypes';

const startWatchingFilesAndFolders = (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
  const chokidarWatcher = chokidar.watch(USER_CODE_BASE_PATH, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    ignoreInitial: true,
  });

  chokidarWatcher.on('all', (event, filePath) => {
    switch (event) {
      case 'unlink':
      case 'unlinkDir':
      case 'add':
      case 'addDir':
        socket.emit('filesAndFolders:output', {
          status: StatusMessageMap.SUCCESS,
          message: `Action for ${path.basename(filePath)}`,
          path: filePath,
          event: event === 'unlink' || event === 'unlinkDir' ? FileAndFolderEvent.REMOVE : FileAndFolderEvent.ADD,
        });
        break;

      case 'change':
        console.log(`File ${path.basename(filePath)} has been changed`);
        break;

      default:
        break;
    }
  });
};

export { startWatchingFilesAndFolders };
