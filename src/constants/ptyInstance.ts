import * as pty from 'node-pty';
import os from 'os';
import { USER_CODE_BASE_PATH } from './global';

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

const ptyProcessInstance = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 12,
  cwd: USER_CODE_BASE_PATH,
  env: {},
});

export default ptyProcessInstance;
