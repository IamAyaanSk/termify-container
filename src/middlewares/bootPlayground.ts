import { startWatchingFilesAndFolders } from '../constants/chokidarWatcher'
import { ConnectionMiddleware } from '../types/socketEventTypes'
import { StatusMessageMap, ErroMessageMap } from '../types/common'
import ptyProcessInstance from '../constants/ptyInstance'

const bootPlayground: ConnectionMiddleware = async (socket, next) => {
  try {
    socket.emit('playground:boot', { status: StatusMessageMap.SUCCESS, message: 'Playground Ready', path: '' })

    startWatchingFilesAndFolders(socket)

    ptyProcessInstance.write('su damner\n')
    ptyProcessInstance.write('clear\n')
    next()
  } catch (err) {
    socket.emit('playground:boot', { status: StatusMessageMap.ERROR, message: 'Crash', path: '' })
    next(new Error(`Server Error ${err}`))
  }
}

export default bootPlayground
