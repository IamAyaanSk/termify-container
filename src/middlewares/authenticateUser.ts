import { CONTAINER_ACCESS_TOKEN_SECRET } from '../constants/global';
import { ConnectionMiddleware } from '../types/socketEventTypes';
import * as jwt from 'jsonwebtoken';

const authenticateUser: ConnectionMiddleware = (socket, next) => {
  try {
    const containerAccessTokenSecret = CONTAINER_ACCESS_TOKEN_SECRET;
    const token: string = socket.handshake.headers.authorization || '';
    const payload = jwt.verify(token, containerAccessTokenSecret);

    if (typeof payload === 'string') {
      throw new Error('Unauthenticated');
    } else {
      next();
    }
  } catch (err) {
    console.log('Error aagaya');
    next(new Error(`Server Error ${err} `));
  }
};

export default authenticateUser;
