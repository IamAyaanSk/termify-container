import { Server, Socket } from 'socket.io';
import { promises as fsp } from 'fs';
import path from 'path';

import { ErroMessageMap, StatusMessageMap, SuccessMessageMap } from '../types/common';
import { ClientToServerEvents, ServerToClientEvents } from '../types/socketEventTypes';
import { FileAndFolderType, IFileAndFolderDetails } from '../types/fileAndFolderTypes';
import { USER_CODE_BASE_PATH } from '../constants/global';

const filesAndFoldersHandlers = (
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
) => {
  const addFileAndFolder = async (details: IFileAndFolderDetails) => {
    try {
      switch (details.type) {
        case 'file':
          await fsp.appendFile(details.path, '');
          break;
        case 'folder':
          await fsp.mkdir(details.path);
          break;
        default:
          throw new Error(ErroMessageMap['fileAndFolder/type']);
      }
    } catch (error) {
      socket.emit('filesAndFolders:output', {
        status: StatusMessageMap.ERROR,
        message: `Error adding ${details.name}: ${error}`,
        path: details.path,
        event: details.event,
      });
    }
  };

  const removeFileAndFolder = async (details: IFileAndFolderDetails) => {
    try {
      await fsp.rm(details.path, { recursive: true });
    } catch (error) {
      socket.emit('filesAndFolders:output', {
        status: StatusMessageMap.ERROR,
        message: `Error removing ${details.name}: ${error}`,
        path: details.path,
        event: details.event,
      });
    }
  };

  const renameFileAndFolder = async (details: IFileAndFolderDetails) => {
    try {
      if (!details.newName) {
        throw new Error(ErroMessageMap['fileAndFolder/renameNoNewName']);
      }

      await fsp.rename(details.path, path.join(details.path, '..', details.newName));
    } catch (error) {
      socket.emit('filesAndFolders:output', {
        status: StatusMessageMap.ERROR,
        message: `Error renaming ${details.name}: ${error}`,
        path: details.path,
        event: details.event,
      });
    }
  };

  const listFilesAndFolders = async (details: IFileAndFolderDetails) => {
    try {
      const filePath = details.path ? details.path : USER_CODE_BASE_PATH;
      const filesAndFolders = await fsp.readdir(filePath, {
        withFileTypes: true,
      });

      const filesAndFoldersDetails = filesAndFolders.map((fileOrFolder) => {
        return {
          name: fileOrFolder.name,
          type: fileOrFolder.isDirectory() ? FileAndFolderType.FOLDER : FileAndFolderType.FILE,
          path: path.join(fileOrFolder.parentPath, fileOrFolder.name),
          event: details.event,
        };
      });

      socket.emit('filesAndFolders:output', {
        status: StatusMessageMap.SUCCESS,
        message: SuccessMessageMap['fileAndFolder/list'],
        path: details.path,
        toListRoot: details.path === '',
        event: details.event,
        data: filesAndFoldersDetails,
      });
    } catch (error) {
      socket.emit('filesAndFolders:output', {
        status: StatusMessageMap.ERROR,
        message: `Error listing ${details.name}: ${error}`,
        path: details.path,
        event: details.event,
      });
    }
  };

  const getFileContent = async (details: IFileAndFolderDetails) => {
    try {
      const fileContent = await fsp.readFile(details.path, 'utf-8');
      socket.emit('filesAndFolders:output', {
        status: StatusMessageMap.SUCCESS,
        message: fileContent,
        path: details.path,
        event: details.event,
      });
    } catch (error) {
      socket.emit('filesAndFolders:output', {
        status: StatusMessageMap.ERROR,
        message: `Error reading ${details.name}: ${error}`,
        path: details.path,
        event: details.event,
      });
    }
  };

  const writeFileContent = async (details: IFileAndFolderDetails) => {
    try {
      if (details.content === undefined) {
        throw new Error(ErroMessageMap['fileAndFolder/writeNoContent']);
      }

      await fsp.writeFile(details.path, details.content);
    } catch (error) {
      socket.emit('filesAndFolders:output', {
        status: StatusMessageMap.ERROR,
        message: `Error writing ${details.name}: ${error}`,
        path: details.path,
        event: details.event,
      });
    }
  };

  const fileAndFolderManager = async (details: IFileAndFolderDetails) => {
    switch (details.event) {
      case 'add':
        await addFileAndFolder(details);
        break;
      case 'remove':
        await removeFileAndFolder(details);
        break;
      case 'rename':
        await renameFileAndFolder(details);
        break;
      case 'list':
        await listFilesAndFolders(details);
        break;
      case 'read':
        await getFileContent(details);
        break;
      case 'write':
        await writeFileContent(details);
        break;
      default:
        break;
    }
  };

  socket.on('filesAndFolders:input', fileAndFolderManager);
};

export default filesAndFoldersHandlers;
